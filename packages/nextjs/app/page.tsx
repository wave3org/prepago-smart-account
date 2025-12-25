"use client";

import { useAccount, useWalletClient } from 'wagmi'
import { useEffect, useState } from 'react'
import { createPublicClient, http, encodeFunctionData } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { createKernelAccount, createZeroDevPaymasterClient, createKernelAccountClient } from '@zerodev/sdk'
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator'
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import { toPermissionValidator } from '@zerodev/permissions'
import { toECDSASigner } from '@zerodev/permissions/signers'
import { toCallPolicy, CallPolicyVersion } from '@zerodev/permissions/policies'
import deployedContracts from "~~/contracts/deployedContracts"
import type { NextPage } from "next";

const chain = sepolia 
const entryPoint = getEntryPoint("0.7")
const kernelVersion = KERNEL_V3_1

const Home: NextPage = () => {
    const { address, isConnected } = useAccount()
    const { data: walletClient } = useWalletClient()
    const [kernelAddress, setKernelAddress] = useState<string>()
    const [kernelClient, setKernelClient] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState<bigint>()
    const [lastTxHash, setLastTxHash] = useState<string>()
    const [lastUserOpHash, setLastUserOpHash] = useState<string>()
    const [kernelEthBalance, setKernelEthBalance] = useState<bigint>()

    useEffect(() => {
        if (!walletClient) return

        const setupKernel = async () => {
            const publicClient = createPublicClient({
                transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
                chain: chain
            })

            const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
                signer: walletClient,
                entryPoint: entryPoint,
                kernelVersion: kernelVersion
            })

            // Create or get session key from localStorage
            let sessionPrivateKey = localStorage.getItem('musicVaultSessionKey')
            if (!sessionPrivateKey) {
                sessionPrivateKey = generatePrivateKey()
                localStorage.setItem('musicVaultSessionKey', sessionPrivateKey)
            }
            const sessionKeySigner = privateKeyToAccount(sessionPrivateKey as `0x${string}`)

            // Create permission validator for reproducirCancion
            const contract = deployedContracts[chain.id].BovedaMusical
            
            const sessionKeySigner2 = await toECDSASigner({ signer: sessionKeySigner })
            
            const callPolicy = toCallPolicy({
                policyVersion: CallPolicyVersion.V0_0_5,
                permissions: [{
                    abi: contract.abi,
                    target: contract.address as `0x${string}`,
                    functionName: 'reproducirCancion',
                    valueLimit: BigInt(0),
                }, {
                    abi: contract.abi,
                    target: contract.address as `0x${string}`,
                    functionName: 'depositar',
                    valueLimit: BigInt(1000), // Allow up to 1000 wei
                }]
            })
            
            const permissionPlugin = await toPermissionValidator(publicClient, {
                signer: sessionKeySigner2,
                policies: [callPolicy],
                entryPoint: entryPoint,
                kernelVersion: kernelVersion,
            })

            const kernelAccount = await createKernelAccount(publicClient, {
                plugins: {
                    sudo: ecdsaValidator,
                    regular: permissionPlugin,
                },
                entryPoint: entryPoint,
                kernelVersion: kernelVersion,
            })

            const zerodevPaymaster = createZeroDevPaymasterClient({
                chain,
                transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
            })

            const client = createKernelAccountClient({
                account: kernelAccount,
                chain,
                bundlerTransport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
                client: publicClient,
                paymaster: {
                    getPaymasterData(userOperation) {
                        return zerodevPaymaster.sponsorUserOperation({userOperation})
                    }
                },
            })

            setKernelAddress(kernelAccount.address)
            setKernelClient(client)

            // Read balance from contract
            const bal = await publicClient.readContract({
                address: contract.address as `0x${string}`,
                abi: contract.abi,
                functionName: 'saldoPorUsuario',
                args: [kernelAccount.address],
            })
            setBalance(bal as bigint)
            
            // Read Kernel Account ETH balance
            const kernelBal = await publicClient.getBalance({
                address: kernelAccount.address as `0x${string}`
            })
            setKernelEthBalance(kernelBal)
        }

        setupKernel()
    }, [walletClient])

    const reproducirCancion = async () => {
        if (!kernelClient) {
            console.error("Kernel client not ready")
            return
        }

        setLoading(true)
        try {
            const contract = deployedContracts[chain.id].BovedaMusical
            
            const callData = encodeFunctionData({
                abi: contract.abi,
                functionName: "reproducirCancion",
                args: []
            })
            
            const userOpHash = await kernelClient.sendUserOperation({
                callData: await kernelClient.account.encodeCalls([{
                    to: contract.address,
                    value: BigInt(0),
                    data: callData,
                }]),
            })
            
            console.log("UserOp hash:", userOpHash)
            setLastUserOpHash(userOpHash)
            
            const receipt = await kernelClient.waitForUserOperationReceipt({ hash: userOpHash })
            console.log("Transaction receipt:", receipt)
            console.log("Success:", receipt.success)
            
            const txHash = receipt.receipt.transactionHash
            setLastTxHash(txHash)
            console.log("Transaction hash:", txHash)
            
            alert(receipt.success ? `¡Canción reproducida!\nTx: ${txHash}` : "Error al reproducir")
        } catch (error) {
            console.error("Error:", error)
            alert("Error: " + (error as any).message)
        } finally {
            setLoading(false)
        }
    }

    const depositar = async () => {
        if (!kernelClient) {
            console.error("Kernel client not ready")
            return
        }

        setLoading(true)
        try {
            const contract = deployedContracts[chain.id].BovedaMusical
            
            const callData = encodeFunctionData({
                abi: contract.abi,
                functionName: "depositar",
                args: []
            })
            
            // Deposit 10 wei
            const depositAmount = BigInt(10)
            
            console.log("=== DEPOSITAR DEBUG ===")
            console.log("Kernel Balance:", kernelEthBalance?.toString(), "wei")
            console.log("Deposit Amount:", depositAmount.toString(), "wei")
            console.log("Contract:", contract.address)
            
            const userOpHash = await kernelClient.sendUserOperation({
                callData: await kernelClient.account.encodeCalls([{
                    to: contract.address,
                    value: depositAmount,
                    data: callData,
                }]),
            })
            
            console.log("UserOp hash:", userOpHash)
            setLastUserOpHash(userOpHash)
            
            const receipt = await kernelClient.waitForUserOperationReceipt({ hash: userOpHash })
            console.log("Transaction receipt:", receipt)
            
            const txHash = receipt.receipt.transactionHash
            setLastTxHash(txHash)
            console.log("Transaction hash:", txHash)
            
            if (receipt.success) {
                // Reload balance
                const publicClient = createPublicClient({
                    transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
                    chain: chain
                })
                const bal = await publicClient.readContract({
                    address: contract.address as `0x${string}`,
                    abi: contract.abi,
                    functionName: 'saldoPorUsuario',
                    args: [kernelClient.account.address],
                })
                setBalance(bal as bigint)
                alert("¡Depositado!")
            } else {
                alert("Error al depositar")
            }
        } catch (error) {
            console.error("Error completo:", error)
            const errorMsg = (error as any).message || ""
            const errorDetails = (error as any).details || ""
            const errorName = (error as any).name || ""
            const errorBody = (error as any).body || ""
            
            if (errorMsg.includes("AA23") || errorDetails.includes("AA23") || errorMsg.includes("reverted")) {
                const currentBalance = kernelEthBalance?.toString() || '0'
                const kernelAddr = kernelClient?.account?.address || 'unknown'
                
                // Log completo para debugging
                console.log("=== AA23 ERROR DEBUG ===")
                console.log("Kernel Address:", kernelAddr)
                console.log("Current Balance:", currentBalance, "wei")
                console.log("Balance in ETH:", Number(currentBalance) / 1e18)
                console.log("Trying to send VALUE:", "10 wei")
                console.log("Error Name:", errorName)
                console.log("Error Message:", errorMsg)
                console.log("Error Details:", errorDetails)
                console.log("Error Body:", errorBody)
                console.log("Full Error:", error)
                
                // Extraer revert reason code
                const revertCode = errorDetails.match(/0x[0-9a-fA-F]+/)
                const revertReason = revertCode ? revertCode[0] : "unknown"
                
                const balanceInEth = (Number(currentBalance) / 1e18).toFixed(6)
                
                alert(`🔴 AA23 ERROR - DEBUGGING\n\n` +
                      `Tu balance: ${currentBalance} wei (${balanceInEth} ETH)\n` +
                      `Esto ES SUFICIENTE para 10 wei + gas!\n\n` +
                      `Revert code: ${revertReason}\n` +
                      `Esto sugiere que NO es solo falta de fondos.\n\n` +
                      `POSIBLES CAUSAS:\n` +
                      `1. Problema con nonce/validation\n` +
                      `2. Bug en Kernel Account validator\n` +
                      `3. Problema con paymaster sponsorship\n` +
                      `4. Gas estimation incorrecta\n\n` +
                      `Revisa la CONSOLA para más detalles.\n` +
                      `Error: ${errorDetails}`)
            } else {
                alert("Error: " + errorMsg + "\n\nDetails: " + errorDetails)
            }
        } finally {
            setLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">🎵 MusicVault</h1>
                    <p className="text-lg mb-6">Conecta tu billetera para comenzar</p>
                    <p className="text-sm text-gray-600">Necesitas MetaMask para usar esta aplicación</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">🎵 MusicVault</h1>
            
            {/* Network Info */}
            <div className="mb-4 bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-semibold">Red:</span> Sepolia Testnet
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">BovedaMusical:</span>
                        <code className="bg-white px-2 py-1 rounded text-xs">
                            {deployedContracts[chain.id].BovedaMusical.address}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(deployedContracts[chain.id].BovedaMusical.address);
                                alert('Dirección del contrato copiada!');
                            }}
                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                            📋
                        </button>
                        <a
                            href={`https://sepolia.etherscan.io/address/${deployedContracts[chain.id].BovedaMusical.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                            🔍 Ver
                        </a>
                    </div>
                </div>
            </div>
            
            {/* Tutorial Section */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-900">👋 ¡Bienvenido!</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">1️⃣</span>
                            <div>
                                <p className="font-semibold">Tu Kernel Account es tu ID en esta aplicación</p>
                                <p className="text-gray-700 mt-1">Esta es una billetera inteligente creada para ti:</p>
                                <code className="bg-white px-2 py-1 rounded text-xs block mt-1 break-all">
                                    {kernelAddress || 'Cargando...'}
                                </code>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">2️⃣</span>
                            <div>
                                <p className="font-semibold">Balance de tu Kernel Account</p>
                                <p className="text-gray-700 mt-1">
                                    {kernelEthBalance !== undefined 
                                        ? `${kernelEthBalance.toString()} wei`
                                        : 'Cargando...'}
                                </p>
                                {kernelEthBalance !== undefined && kernelEthBalance === 0n && (
                                    <p className="text-red-600 font-semibold mt-1">
                                        ⚠️ ¡Necesitas fondos! Envía wei desde MetaMask a esta dirección
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">3️⃣</span>
                            <div>
                                <p className="font-semibold">Saldo en BovedaMusical</p>
                                <p className="text-gray-700 mt-1">
                                    {balance !== undefined ? `${balance.toString()} wei` : 'Cargando...'}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">Cada canción cuesta 1 wei</p>
                            </div>
                        </div>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4">
                            <p className="font-semibold text-yellow-900">💡 Importante:</p>
                            <p className="text-sm text-yellow-800 mt-1">
                                Tu MetaMask ({address?.slice(0, 6)}...{address?.slice(-4)}) solo firma transacciones.
                                El Kernel Account es quien ejecuta las operaciones y necesita ETH.
                            </p>
                        </div>
                    </div>
            </div>
            
            {/* Account Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                    <p className="text-xs text-gray-500 uppercase mb-1">MetaMask (EOA)</p>
                    <p className="font-mono text-xs break-all mb-2">{address}</p>
                    <p className="text-sm text-gray-600">Solo para firmar transacciones</p>
                </div>
                
                <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                    <p className="text-xs text-blue-600 uppercase mb-1 font-semibold">Kernel Account (Tu ID)</p>
                    <p className="font-mono text-xs break-all mb-2">{kernelAddress || 'Cargando...'}</p>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">
                            {kernelEthBalance !== undefined 
                                ? `${(Number(kernelEthBalance) / 1e18).toFixed(6)} ETH`
                                : '...'}
                        </p>
                        {kernelAddress && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(kernelAddress);
                                    alert('Dirección copiada!');
                                }}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                📋 Copiar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Balance in Contract */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Saldo en BovedaMusical</p>
                <p className="text-3xl font-bold text-green-700">
                    {balance !== undefined ? balance.toString() : '...'} wei
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Puedes reproducir {balance !== undefined ? balance.toString() : '0'} canciones
                </p>
            </div>
            
            {lastTxHash && (
                    <div className="border border-blue-500 p-4 rounded bg-blue-50 mb-6">
                        <p className="font-bold mb-2">Last Transaction:</p>
                        <p className="text-sm mb-1">UserOp Hash: <code className="text-xs bg-gray-200 px-2 py-1 rounded break-all">{lastUserOpHash}</code></p>
                        <p className="text-sm mb-2">Tx Hash: <code className="text-xs bg-gray-200 px-2 py-1 rounded break-all">{lastTxHash}</code></p>
                        <div className="flex flex-col gap-1 mt-2">
                            <a 
                                href={`https://sepolia.etherscan.io/tx/${lastTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                📋 View Transaction on Etherscan →
                            </a>
                            <a 
                                href={`https://sepolia.etherscan.io/tx/${lastTxHash}#internal`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline text-sm font-semibold"
                            >
                                🔍 View Internal Txns (your call to BovedaMusical) →
                            </a>
                            {kernelAddress && (
                                <a 
                                    href={`https://sepolia.etherscan.io/address/${kernelAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:underline text-sm"
                                >
                                    👛 View Your Kernel Account →
                                </a>
                            )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">💡 Tip: Click &quot;Internal Txns&quot; to see your Kernel account calling BovedaMusical</p>
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <button 
                        onClick={depositar}
                        disabled={!kernelClient || loading || (kernelEthBalance !== undefined && kernelEthBalance < BigInt(10))}
                        className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Procesando...' : '💰 Depositar 10 wei'}
                    </button>
                    
                    <button 
                        onClick={reproducirCancion}
                        disabled={!kernelClient || loading || (balance !== undefined && balance < BigInt(1))}
                        className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Reproduciendo...' : '🎵 Reproducir Canción'}
                    </button>
                </div>
                
                {/* Warnings */}
                {kernelEthBalance !== undefined && kernelEthBalance < BigInt(10) && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <p className="font-bold text-red-900">⚠️ Sin fondos suficientes</p>
                        <p className="text-sm text-red-800 mt-1">
                            Necesitas al menos 10 wei en tu Kernel Account para depositar.
                        </p>
                        <p className="text-xs text-red-700 mt-2">
                            Tienes: {kernelEthBalance.toString()} wei. Envía más wei desde MetaMask.
                        </p>
                    </div>
                )}
                
                {balance !== undefined && balance < BigInt(1) && kernelEthBalance !== undefined && kernelEthBalance >= BigInt(10) && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                        <p className="font-bold text-yellow-900">💡 Sin saldo en BovedaMusical</p>
                        <p className="text-sm text-yellow-800 mt-1">
                            Deposita primero para poder reproducir canciones.
                        </p>
                    </div>
                )}
        </div>
    )
}

export default Home;
