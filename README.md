# MusicVault - Account Abstraction con ZeroDev

## 📑 Índice

1. [🌐 Aplicación en Vivo](#-aplicación-en-vivo)
2. [⚡ Quick Start - Cómo Usar la App](#-quick-start---cómo-usar-la-app)
   - [Paso 1: Prepara tu Wallet](#paso-1-prepara-tu-wallet)
   - [Paso 2: Conecta y Crea tu Smart Wallet](#paso-2-conecta-y-crea-tu-smart-wallet)
   - [Paso 3: Fondea tu Kernel Account](#paso-3-fondea-tu-kernel-account)
   - [Paso 4: Deposita en la Bóveda Musical](#paso-4-deposita-en-la-bóveda-musical)
   - [Paso 5: ¡Escucha Música!](#paso-5-escucha-música)
3. [📚 ¿Qué es esto?](#-qué-es-esto)
4. [🎯 Conceptos Clave](#-conceptos-clave)
   - [⚠️ IMPORTANTE: Entendiendo las Direcciones](#️-importante-entendiendo-las-direcciones)
   - [Flujo de Fondos Completo](#flujo-de-fondos-completo)
   - [Account Abstraction (Abstracción de Cuentas)](#account-abstraction-abstracción-de-cuentas)
   - [Flujo de Transacciones](#flujo-de-transacciones)
   - [Componentes del Sistema](#componentes-del-sistema)
5. [🔍 Cómo Ver las Transacciones en Sepolia](#-cómo-ver-las-transacciones-en-sepolia)
6. [🏗️ Arquitectura del Código](#️-arquitectura-del-código)
7. [🚀 Cómo Ejecutar](#-cómo-ejecutar)
8. [🔑 Puntos Importantes](#-puntos-importantes)
   - [Session Keys vs Permisos Completos](#session-keys-vs-permisos-completos)
   - [¿Por qué usar Session Keys?](#por-qué-usar-session-keys)
   - [Seguridad](#seguridad)
9. [📖 Recursos](#-recursos)
10. [🤝 Contribuir](#-contribuir)
11. [📝 Notas Técnicas](#-notas-técnicas)
    - [Estructura de una UserOperation](#estructura-de-una-useroperation)
    - [Anatomía del Kernel Account](#anatomía-del-kernel-account)
    - [Call Flow Detallado](#call-flow-detallado)
    - [Ejemplo de CallData Encoding](#ejemplo-de-calldata-encoding)
    - [Políticas Avanzadas](#políticas-avanzadas)
    - [Gas y Paymaster](#gas-y-paymaster)
    - [Debugging](#debugging)
    - [TypeScript Types](#typescript-types)
12. [🐛 Troubleshooting](#-troubleshooting)
13. [📌 Mejoras Sugeridas para Producción](#-mejoras-sugeridas-para-producción)
14. [🐳 Docker y Deployment](#-docker-y-deployment)

---

## � Aplicación en Vivo

**🎵 Prueba la app ahora: [https://prepago-smart-account.onrender.com/](https://prepago-smart-account.onrender.com/)**

## ⚡ Quick Start - Cómo Usar la App

### Paso 1: Prepara tu Wallet

1. **Instala MetaMask** (si no lo tienes)
2. **Cambia a Sepolia Testnet** en MetaMask
3. **Obtén Sepolia ETH gratis**:
   - **Recomendado**: [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) ⭐
   - Opción 2: [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - Opción 3: [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
   - Necesitas ~0.01 ETH (es gratis, son tokens de prueba)

### Paso 2: Conecta y Crea tu Smart Wallet

1. Abre [https://prepago-smart-account.onrender.com/](https://prepago-smart-account.onrender.com/)
2. Click en **"Connect Wallet"** (arriba a la derecha)
3. Acepta la conexión en MetaMask (popup de MetaMask aparecerá **una sola vez**)
4. La app creará automáticamente tu **Kernel Account** (Smart Wallet)
5. Verás dos direcciones:
   - **Tu dirección de MetaMask**: `0xYourMetaMask...` (tu EOA)
   - **Kernel Wallet Address**: `0xYourKernel...` (tu Smart Wallet - esta es tu ID real)

### Paso 3: Fondea tu Kernel Account

**⚠️ IMPORTANTE**: Tu Smart Wallet (Kernel Account) está vacía, necesita ETH para depositar.

1. Copia la dirección de **"Kernel Wallet Address"** (hay un botón para copiar)
2. Abre MetaMask
3. Envía **0.001 ETH** (o más) a esa dirección del Kernel
4. Espera ~15 segundos
5. Refresca la página - verás el balance actualizado en "Kernel ETH Balance"

### Paso 4: Deposita en la Bóveda Musical

1. En "Balance en BovedaMusical" click en **"Depositar 100 wei"**
2. **NO habrá popup de MetaMask** - la transacción se firma automáticamente con session key
3. Verás una notificación de éxito cuando complete
4. El saldo en "Balance en BovedaMusical" se actualizará a 100 wei

### Paso 5: ¡Escucha Música!

1. Click en **"Reproducir Canción (1 wei)"**
2. **NO habrá popup de MetaMask** - gasless transaction!
3. Verás la notificación: "🎵 Canción reproducida!"
4. Tu saldo bajará de 100 → 99 → 98... con cada canción

### 💡 ¿Por Qué No Hay Popups de MetaMask?

Esta es la magia de **Account Abstraction con Session Keys**:

- ✅ Solo firmas **una vez** al conectar (crear el Kernel Account)
- ✅ Después, todas las transacciones usan **session keys** (sin popups)
- ✅ El **Paymaster** paga el gas (transacciones gratis para ti)
- ✅ Las notificaciones que ves son de la app, no de MetaMask

**Esto es 100 veces mejor que Web3 tradicional donde cada click = popup de MetaMask!**

### 🔍 Ver tus Transacciones en Etherscan

Cada vez que reproduces o depositas, verás links a Etherscan:
- Click en "Ver en Etherscan" para ver la transacción
- Busca tu **Kernel Wallet Address** en [Sepolia Etherscan](https://sepolia.etherscan.io/)
- En la pestaña **"Internal Txns"** verás las llamadas a BovedaMusical

---

## �📚 ¿Qué es esto?

MusicVault es un proyecto que demuestra **Account Abstraction (ERC-4337)** usando ZeroDev SDK. Permite a los usuarios reproducir canciones pagando con saldo depositado en un contrato inteligente, utilizando billeteras inteligentes (smart wallets) en lugar de EOAs tradicionales.

## 🎯 Conceptos Clave

### ⚠️ IMPORTANTE: Entendiendo las Direcciones

**Esta es la fuente más común de confusión con Account Abstraction:**

```
Tu MetaMask (EOA)          →  0xYourMetaMask...  (tu billetera tradicional)
                                   ↓
                           crea y controla
                                   ↓
Kernel Account (Smart Wallet) →  0xYourKernelAccount...  (tu ID real en la app)
                                   ↓
                         deposita fondos en
                                   ↓
BovedaMusical Contract    →  Saldo[0xYourKernelAccount...]  (NO 0xYourMetaMask!)
```

**❗ El contrato NO ve tu dirección de MetaMask, ve tu Kernel Account:**

```solidity
// En BovedaMusical.sol
function depositar() public payable {
    // msg.sender = TU KERNEL ACCOUNT (0xYourKernelAccount..., no 0xYourMetaMask!)
    saldoPorUsuario[msg.sender] += msg.value;
}
```

### Flujo de Fondos Completo

```
1️⃣ Usuario tiene ETH en MetaMask (EOA)
   Balance: 0xYourMetaMask... = 1.0 ETH ✅

2️⃣ Se crea Kernel Account (Smart Wallet)
   Balance: 0xYourKernelAccount... = 0 ETH ⚠️
   
3️⃣ ⚠️ PROBLEMA: El Kernel necesita ETH para depositar
   - El Kernel es quien llama a depositar()
   - Necesita tener ETH para enviarlo
   
4️⃣ SOLUCIÓN: Transferir ETH a tu Kernel Account
   MetaMask → Kernel Account
   0xYourMetaMask... → 0xYourKernelAccount... (0.01 ETH)
   
5️⃣ Ahora el Kernel puede depositar en BovedaMusical
   Kernel (0xYourKernelAccount...) → BovedaMusical.depositar{value: 10 wei}()
   
6️⃣ El saldo queda registrado bajo el Kernel
   BovedaMusical.saldoPorUsuario[0xYourKernelAccount...] = 10 wei
```

**⚡ Sobre el Gas:**
- Nosotros patrocinamos el gas usando el Paymaster de ZeroDev
- El usuario NO paga gas por las transacciones
- PERO el Kernel sí necesita ETH para enviar value a otros contratos

### Account Abstraction (Abstracción de Cuentas)

En lugar de usar cuentas EOA tradicionales (como MetaMask directamente), usamos **smart contract wallets** que permiten:

- ✅ **Session Keys**: Permisos delegados para operaciones específicas sin necesidad de aprobar cada transacción
- ✅ **Gasless Transactions**: El paymaster puede pagar el gas por ti
- ✅ **Batch Transactions**: Múltiples operaciones en una sola transacción
- ✅ **Custom Logic**: Lógica personalizada para seguridad y automatización

### Flujo de Transacciones

```
1. Usuario crea UserOperation (ej: reproducirCancion)
          ↓
2. Bundler recibe la UserOp
          ↓
3. Bundler envía transacción → EntryPoint Contract (0x0000000071727De22E5E9d8BAf0edAc6f37da032)
          ↓
4. EntryPoint ejecuta → Tu Kernel Account (smart wallet)
          ↓
5. Kernel Account llama → BovedaMusical.reproducirCancion()
```

### Componentes del Sistema

#### 1. **MetaMask Wallet (EOA)**
- Tu billetera tradicional
- Solo se usa para **firmar** (crear la Kernel Account)
- **NO paga gas** ni ejecuta las transacciones

#### 2. **Kernel Account (Smart Wallet)**
- Un contrato inteligente que actúa como tu "cuenta"
- Dirección determinística basada en tu EOA
- Esta es tu **ID real** en la aplicación
- Almacena tu saldo en BovedaMusical

#### 3. **Session Key**
- Clave privada generada localmente (guardada en localStorage)
- Tiene **permisos limitados**: solo puede llamar `reproducirCancion()`
- No puede depositar, retirar, ni hacer otras operaciones
- Permite transacciones automáticas sin aprobar cada vez

#### 4. **Validators (Validadores)**

**ECDSA Validator (sudo)**
- Validador principal con permisos completos
- Usa tu MetaMask para firmar
- Necesario para operaciones administrativas (depositar, etc.)

**Permission Validator (regular)**
- Validador con permisos limitados
- Usa la Session Key
- Solo puede ejecutar funciones específicas permitidas por las políticas

#### 5. **Policies (Políticas)**

Las políticas definen qué puede hacer la Session Key:

```typescript
const callPolicy = toCallPolicy({
  policyVersion: CallPolicyVersion.V0_0_5,
  permissions: [{
    abi: contract.abi,
    target: contract.address,           // Solo puede llamar a BovedaMusical
    functionName: "reproducirCancion",  // Solo esta función
    valueLimit: BigInt(0),              // Sin enviar ETH
  }]
});
```

#### 6. **Bundler**
- Servicio que agrupa UserOperations
- Envía transacciones al blockchain
- URL: `process.env.NEXT_PUBLIC_ZERODEV_RPC`

#### 7. **Paymaster**
- Opcional: puede pagar el gas por ti
- En este proyecto: patrocina las transacciones

#### 8. **EntryPoint Contract**
- Contrato estándar ERC-4337
- Dirección: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`
- Coordina la ejecución de UserOperations

## 🔍 Cómo Ver las Transacciones en Sepolia

### En Etherscan:

1. **Transaction Tab**: Verás:
   - **From**: Bundler (no tu dirección)
   - **To**: EntryPoint Contract
   - Esto es normal ✅

2. **Internal Transactions Tab** 👈 **MIRA AQUÍ**:
   - Verás: `Tu Kernel Account → BovedaMusical.reproducirCancion()`
   - Esta es la llamada real a tu contrato

3. **Buscar tu Kernel Account**:
   - Copia tu "Kernel Wallet Address" de la UI
   - Búscala en Etherscan
   - Verás todas las operaciones de tu smart wallet

### Diferencia UserOp Hash vs Transaction Hash

- **UserOp Hash**: Identificador interno de ZeroDev
- **Transaction Hash**: Hash del blockchain (el que buscas en Etherscan)

La UI muestra ambos y links directos.

## 🏗️ Arquitectura del Código

### `/packages/hardhat/contracts/BovedaMusical.sol`

Contrato simple que:
- Permite depositar saldo (`depositar()`)
- Cobra 1 wei por reproducir canción (`reproducirCancion()`)
- Rastrea saldo por usuario en `saldoPorUsuario` mapping

```solidity
mapping(address => uint) public saldoPorUsuario;
```

**Importante**: El `msg.sender` es tu **Kernel Account**, no tu EOA de MetaMask.

### `/packages/nextjs/app/page.tsx`

Página principal con la lógica de Account Abstraction.

#### Setup Completo (useEffect):

```typescript
useEffect(() => {
  if (!walletClient) return;

  const setupKernel = async () => {
    // 1. Public Client para leer del blockchain
    const publicClient = createPublicClient({
      transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
      chain: sepolia
    });

    // 2. ECDSA Validator (sudo) - Permisos completos con MetaMask
    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      signer: walletClient,
      entryPoint: getEntryPoint("0.7"),
      kernelVersion: KERNEL_V3_1
    });

    // 3. Generar o recuperar Session Key de localStorage
    let sessionPrivateKey = localStorage.getItem('musicVaultSessionKey');
    if (!sessionPrivateKey) {
      sessionPrivateKey = generatePrivateKey();
      localStorage.setItem('musicVaultSessionKey', sessionPrivateKey);
    }
    const sessionKeySigner = privateKeyToAccount(sessionPrivateKey as `0x${string}`);

    // 4. Convertir a ModularSigner (formato ZeroDev)
    const sessionKeySigner2 = await toECDSASigner({ 
      signer: sessionKeySigner 
    });

    // 5. Definir políticas (qué puede hacer la session key)
    const callPolicy = toCallPolicy({
      policyVersion: CallPolicyVersion.V0_0_5,
      permissions: [{
        abi: contract.abi,
        target: contract.address as `0x${string}`,
        functionName: 'reproducirCancion',
        valueLimit: BigInt(0),  // No puede enviar ETH
      }]
    });

    // 6. Permission Validator con la session key
    const permissionPlugin = await toPermissionValidator(publicClient, {
      signer: sessionKeySigner2,
      policies: [callPolicy],
      entryPoint: getEntryPoint("0.7"),
      kernelVersion: KERNEL_V3_1,
    });

    // 7. Crear Kernel Account con ambos validators
    const kernelAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: ecdsaValidator,      // Permisos completos
        regular: permissionPlugin,  // Permisos limitados
      },
      entryPoint: getEntryPoint("0.7"),
      kernelVersion: KERNEL_V3_1,
    });

    // 8. Configurar Paymaster (patrocina el gas)
    const zerodevPaymaster = createZeroDevPaymasterClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
    });

    // 9. Crear Kernel Client (para enviar UserOperations)
    const client = createKernelAccountClient({
      account: kernelAccount,
      chain: sepolia,
      bundlerTransport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
      client: publicClient,
      paymaster: {
        getPaymasterData(userOperation) {
          return zerodevPaymaster.sponsorUserOperation({userOperation})
        }
      },
    });

    setKernelAddress(kernelAccount.address);
    setKernelClient(client);

    // 10. Leer saldo inicial del contrato
    const bal = await publicClient.readContract({
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      functionName: 'saldoPorUsuario',
      args: [kernelAccount.address],  // ⚠️ Kernel address, no EOA
    });
    setBalance(bal as bigint);
  };

  setupKernel();
}, [walletClient]);
```

#### Función: depositar() - Con ECDSA Validator

```typescript
const depositar = async () => {
  if (!kernelClient) return;
  
  setLoading(true);
  try {
    const contract = deployedContracts[chain.id].BovedaMusical;
    
    // Encode la llamada al contrato
    const callData = encodeFunctionData({
      abi: contract.abi,
      functionName: "depositar",
      args: []
    });
    
    const depositAmount = BigInt(10);  // 10 wei
    
    // Enviar UserOperation
    const userOpHash = await kernelClient.sendUserOperation({
      callData: await kernelClient.account.encodeCalls([{
        to: contract.address,
        value: depositAmount,  // 💰 Enviando ETH
        data: callData,
      }]),
    });
    
    console.log("UserOp hash:", userOpHash);
    setLastUserOpHash(userOpHash);
    
    // Esperar confirmación
    const receipt = await kernelClient.waitForUserOperationReceipt({ 
      hash: userOpHash 
    });
    
    // Extraer el transaction hash real
    const txHash = receipt.receipt.transactionHash;
    setLastTxHash(txHash);
    console.log("Transaction hash:", txHash);
    
    if (receipt.success) {
      // Actualizar saldo en UI
      const bal = await publicClient.readContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: 'saldoPorUsuario',
        args: [kernelClient.account.address],
      });
      setBalance(bal as bigint);
      alert("¡Depositado!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + (error as any).message);
  } finally {
    setLoading(false);
  }
};
```

#### Función: reproducirCancion() - Con Session Key

```typescript
const reproducirCancion = async () => {
  if (!kernelClient) return;

  setLoading(true);
  try {
    const contract = deployedContracts[chain.id].BovedaMusical;
    
    // Encode la llamada
    const callData = encodeFunctionData({
      abi: contract.abi,
      functionName: "reproducirCancion",
      args: []
    });
    
    // ⚡ Usa automáticamente el Permission Validator (session key)
    // NO requiere aprobación en MetaMask!
    const userOpHash = await kernelClient.sendUserOperation({
      callData: await kernelClient.account.encodeCalls([{
        to: contract.address,
        value: BigInt(0),  // No envía ETH
        data: callData,
      }]),
    });
    
    console.log("UserOp hash:", userOpHash);
    setLastUserOpHash(userOpHash);
    
    const receipt = await kernelClient.waitForUserOperationReceipt({ 
      hash: userOpHash 
    });
    
    const txHash = receipt.receipt.transactionHash;
    setLastTxHash(txHash);
    
    alert(receipt.success 
      ? `¡Canción reproducida!\nTx: ${txHash}` 
      : "Error al reproducir"
    );
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + (error as any).message);
  } finally {
    setLoading(false);
  }
};
```

#### Diferencias Clave entre depositar() y reproducirCancion()

| Aspecto | depositar() | reproducirCancion() |
|---------|-------------|---------------------|
| Validator usado | Permission (session key) | Permission (session key) |
| Requiere MetaMask popup | ❌ No (automático) | ❌ No (automático) |
| Envía ETH (value) | ✅ Sí (10 wei) | ❌ No |
| valueLimit permitido | 1000 wei | 0 wei |

**Importante**: AMBAS funciones usan el Permission Validator con session key, por eso ninguna abre popup de MetaMask.

**¿Cuándo se usa MetaMask entonces?**

MetaMask solo aparece **una vez al inicio** para:
1. ✅ Conectar la wallet (RainbowKit)
2. ✅ Firmar la creación del Kernel Account
3. ✅ Autorizar el Permission Validator con la session key

**Después de eso:**
- ❌ NO hay más popups de MetaMask
- ✅ Todo funciona automáticamente con la session key
- ✅ El Kernel Account ejecuta las transacciones
- ✅ El Paymaster paga el gas

Si intentas una operación NO permitida (ej: una función no configurada en permissions), entonces sí requeriría el ECDSA validator (sudo) y pediría MetaMask.

## 🚀 Cómo Ejecutar

### 📝 Paso 1: Crear Cuenta en ZeroDev y Obtener API Key

Antes de comenzar, necesitas una cuenta en ZeroDev para obtener el RPC endpoint:

1. **Crear cuenta en ZeroDev**:
   - Ve a [https://zerodev.app/](https://zerodev.app/)
   - Click en "Sign Up" o "Get Started"
   - Crea tu cuenta (puedes usar Google, GitHub, etc.)

2. **Crear un nuevo proyecto**:
   - Una vez dentro del dashboard, click en "Create Project"
   - Nombre del proyecto: `MusicVault` (o el que prefieras)
   - Selecciona la red: **Sepolia** (testnet)
   - Click en "Create"

3. **Obtener el RPC URL**:
   - En tu proyecto, ve a la sección "API Keys" o "Settings"
   - Copia el **Bundler RPC URL** - se verá algo así:
     ```
     https://rpc.zerodev.app/api/v2/bundler/YOUR_PROJECT_ID
     ```
   - Este es tu `NEXT_PUBLIC_ZERODEV_RPC` 🔑

### 🔧 Paso 2: Configurar Variables de Entorno

**Para desarrollo local:**

Crea el archivo `.env.local` en `packages/nextjs/`:

```bash
# packages/nextjs/.env.local
NEXT_PUBLIC_ZERODEV_RPC=https://rpc.zerodev.app/api/v2/bundler/YOUR_PROJECT_ID
```

**Para producción en Render:**

Ve a tu servicio en Render Dashboard:
1. Click en tu servicio
2. Ve a "Environment" en el menú lateral
3. Click "Add Environment Variable"
4. Agrega:
   - **Key**: `NEXT_PUBLIC_ZERODEV_RPC`
   - **Value**: Tu URL de ZeroDev
5. Click "Save Changes"

⚠️ **Importante**: Las variables de entorno en Render requieren un nuevo deploy para aplicarse.

### ⚠️ Paso 3: Setup Inicial - Fondear tu Kernel Account

Antes de poder usar la app, necesitas fondos en tu Kernel Account:

1. **Instalar dependencias**:
```bash
yarn install
```

2. **Deploy del contrato**:
```bash
cd packages/hardhat
yarn deploy --network sepolia
```

3. **Ejecutar frontend**:
```bash
cd packages/nextjs
yarn dev
```

4. **🔑 PASO CRÍTICO - Fondear tu Kernel Account**:

   a. **Conectar MetaMask** en la app
   
   b. **Copiar tu Kernel Wallet Address** (se muestra en la UI)
   
   c. **Enviar ETH desde MetaMask a tu Kernel Account**:
      - Abre MetaMask
      - Send → Pega tu Kernel Wallet Address
      - Envía al menos 0.001 ETH (1000000000000000 wei)
      - ⚠️ **SIN ESTE PASO NO PODRÁS DEPOSITAR**
   
   d. **Esperar confirmación** (ver en Etherscan)

6. **Usar la aplicación**:
   - ✅ Ahora sí puedes depositar (el Kernel tiene fondos)
   - ✅ Reproducir canciones (sin aprobar cada vez!)

### 💡 Recomendación: Tutorial en la UI

Para evitar confusión, considera agregar a la UI:

```tsx
{kernelAddress && balance === undefined && (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
    <p className="font-bold">⚠️ Primera vez?</p>
    <p className="text-sm">Tu Kernel Account aún no tiene fondos.</p>
    <p className="text-sm mt-2">
      <strong>Pasos:</strong>
    </p>
    <ol className="text-sm list-decimal list-inside">
      <li>Copia tu Kernel Address: <code>{kernelAddress}</code></li>
      <li>Envía ETH desde MetaMask a esa dirección</li>
      <li>Luego podrás depositar en BovedaMusical</li>
    </ol>
    <button 
      onClick={() => navigator.clipboard.writeText(kernelAddress)}
      className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
    >
      📋 Copiar Kernel Address
    </button>
  </div>
)}
```

### 📊 Mejora de UI: Mostrar Balances Claramente

```tsx
<div className="grid grid-cols-2 gap-4">
  {/* MetaMask Balance */}
  <div className="border p-4 rounded">
    <p className="text-sm text-gray-600">MetaMask (EOA)</p>
    <p className="font-mono text-xs">{address}</p>
    <p className="font-bold text-lg">{userEthBalance} ETH</p>
    <p className="text-xs text-gray-500">Solo para firmar</p>
  </div>
  
  {/* Kernel Account Balance */}
  <div className="border p-4 rounded border-blue-500">
    <p className="text-sm text-gray-600">Kernel Account (Tu ID)</p>
    <p className="font-mono text-xs">{kernelAddress}</p>
    <p className="font-bold text-lg">{kernelEthBalance} ETH</p>
    <p className="text-xs text-blue-600">Ejecuta transacciones</p>
  </div>
</div>

<div className="border p-4 rounded mt-4">
  <p className="text-sm text-gray-600">Saldo en BovedaMusical</p>
  <p className="font-bold text-lg">{balance} wei</p>
  <p className="text-xs text-gray-500">
    Asociado a: {kernelAddress}
  </p>
</div>
```

## 🔑 Puntos Importantes

### Session Keys vs Permisos Completos

| Aspecto | Session Key | ECDSA Validator (MetaMask) |
|---------|-------------|----------------------------|
| Aprobación | Automática | Requiere firmar en MetaMask |
| Permisos | Limitados por políticas | Completos |
| Uso | Operaciones frecuentes | Operaciones administrativas |
| Seguridad | Si se roba, daño limitado | Si se roba, control total |

### ¿Por qué usar Session Keys?

Imagina un juego donde cada acción requiere una transacción:
- ❌ **Sin session keys**: Aprobar cada movimiento, cada ataque, cada acción
- ✅ **Con session keys**: El juego puede ejecutar acciones permitidas automáticamente

En MusicVault:
- ❌ Sin session key: Aprobar cada vez que quieres reproducir una canción
- ✅ Con session key: Reproduces canciones automáticamente (ya tienes saldo)

### Seguridad

La session key SOLO puede:
- Llamar a `reproducirCancion()` en el contrato BovedaMusical
- NO puede depositar
- NO puede retirar
- NO puede llamar otros contratos
- NO puede enviar ETH

Si alguien roba tu session key (localStorage), el peor escenario es que reproduzcan canciones con tu saldo hasta agotarlo (1 wei cada vez).

## 📖 Recursos

- [ZeroDev Docs](https://docs.zerodev.app/)
- [ERC-4337 Spec](https://eips.ethereum.org/EIPS/eip-4337)
- [Account Abstraction](https://ethereum.org/en/roadmap/account-abstraction/)
- [Kernel Accounts](https://docs.zerodev.app/sdk/core-api/create-account)

## 🤝 Contribuir

Ver [OLD_README.md](./OLD_README.md) para instrucciones generales del proyecto Scaffold-ETH.

## 📝 Notas Técnicas

### Estructura de una UserOperation

Cuando llamas `kernelClient.sendUserOperation()`, internamente se crea:

```typescript
interface UserOperation {
  sender: Address;           // Tu Kernel Account address
  nonce: bigint;            // Nonce del account
  callData: Hex;            // Datos de la llamada encodificados
  callGasLimit: bigint;     // Gas para la ejecución
  verificationGasLimit: bigint;  // Gas para verificación
  preVerificationGas: bigint;    // Gas pre-verificación
  maxFeePerGas: bigint;          // Max fee
  maxPriorityFeePerGas: bigint;  // Priority fee
  signature: Hex;                // Firma del validator
  paymasterAndData?: Hex;        // Datos del paymaster (si patrocina)
}
```

El Kernel Client maneja todo esto automáticamente.

### Anatomía del Kernel Account

Tu Kernel Account es un contrato inteligente con esta estructura:

```
┌─────────────────────────────────────────┐
│        Kernel Account (Tu Wallet)       │
├─────────────────────────────────────────┤
│                                         │
│  Validators:                            │
│  ┌────────────────────────────────┐    │
│  │ ECDSA Validator (sudo)         │    │
│  │ - Owner: Tu EOA MetaMask       │    │
│  │ - Permisos: COMPLETOS          │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │ Permission Validator (regular) │    │
│  │ - Owner: Session Key           │    │
│  │ - Permisos: Definidos por      │    │
│  │   CallPolicy                   │    │
│  └────────────────────────────────┘    │
│                                         │
│  Estado:                                │
│  - Nonce: uint256                       │
│  - Plugins activos                      │
│                                         │
│  Funciones:                             │
│  - execute(target, value, data)         │
│  - executeBatch(calls[])                │
│  - validateUserOp(userOp, hash)         │
└─────────────────────────────────────────┘
```

### Call Flow Detallado

```
User Action: "Reproducir Canción"
        ↓
┌───────────────────────────────────────────────────┐
│ 1. Frontend: encodeFunctionData()                 │
│    Resultado: 0xabcd1234 (calldata)               │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 2. kernelClient.sendUserOperation()               │
│    - Crea UserOperation                           │
│    - Session key firma la UserOp                  │
│    - Envía al bundler                             │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 3. Bundler recibe UserOp                          │
│    - Valida firma                                 │
│    - Simula ejecución                             │
│    - Agrupa con otras UserOps                     │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 4. Bundler → Blockchain                           │
│    Transacción:                                   │
│      From: 0xZeroDevBundler...                    │
│      To: EntryPoint (0x0000...032)                │
│      Data: handleOps([userOp1, userOp2...])       │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 5. EntryPoint.handleOps()                         │
│    - Valida cada UserOp                           │
│    - Llama validateUserOp() en Kernel Account     │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 6. Kernel Account.validateUserOp()                │
│    - Permission Validator verifica:               │
│      ✓ Firma válida?                              │
│      ✓ Target = BovedaMusical?                    │
│      ✓ Selector = reproducirCancion()?            │
│      ✓ Value = 0?                                 │
│    - Retorna validationData                       │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 7. EntryPoint ejecuta la operación                │
│    Llama: kernelAccount.execute(                  │
│      target: BovedaMusical,                       │
│      value: 0,                                    │
│      data: reproducirCancion()                    │
│    )                                              │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 8. BovedaMusical.reproducirCancion()              │
│    - msg.sender = Kernel Account                  │
│    - Valida saldo: saldoPorUsuario[msg.sender]    │
│    - Descuenta 1 wei                              │
│    - Emite evento                                 │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 9. EntryPoint maneja paymaster                    │
│    - Paymaster reembolsa gas al bundler           │
└───────────────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────────────┐
│ 10. Transacción confirmada                        │
│     - Frontend recibe receipt                     │
│     - UI actualiza con txHash                     │
└───────────────────────────────────────────────────┘
```

### Ejemplo de CallData Encoding

```typescript
// Tu código:
const callData = encodeFunctionData({
  abi: contract.abi,
  functionName: "reproducirCancion",
  args: []
});

// Resultado (ejemplo):
// 0x1234abcd = selector de reproducirCancion()
// (No hay args, así que solo es el selector)

// Luego se wrappea para batch:
const batchCallData = await kernelClient.account.encodeCalls([{
  to: "0xBovedaMusicalAddress",
  value: 0n,
  data: "0x1234abcd"
}]);

// El Kernel Account decodifica esto y ejecuta:
// execute(to=0xBovedaMusical, value=0, data=0x1234abcd)
```

### Políticas Avanzadas

Las políticas pueden ser muy granulares:

```typescript
// Ejemplo: Restricción por parámetros
const callPolicy = toCallPolicy({
  policyVersion: CallPolicyVersion.V0_0_5,
  permissions: [{
    abi: contractABI,
    target: contractAddress,
    functionName: 'transfer',
    args: [{
      // Solo permite transferir a direcciones específicas
      condition: ParamCondition.ONE_OF,
      params: [
        '0xAllowedRecipient1...',
        '0xAllowedRecipient2...',
      ]
    }, {
      // Solo permite montos menores a 100 tokens
      condition: ParamCondition.LESS_THAN,
      params: parseEther('100')
    }]
  }]
});

// Ejemplo: Rate Limiting
import { toRateLimitPolicy } from '@zerodev/permissions/policies';

const rateLimitPolicy = toRateLimitPolicy({
  policyVersion: RateLimitPolicyVersion.V0_0_1,
  interval: 3600,  // 1 hora en segundos
  count: 10,       // Máximo 10 operaciones por hora
});

// Múltiples políticas:
const permissionPlugin = await toPermissionValidator(publicClient, {
  signer: sessionSigner,
  policies: [
    callPolicy,        // Define QUÉ puede hacer
    rateLimitPolicy,   // Define CUÁNTAS veces
  ],
  // ...
});
```

### Gas y Paymaster

```typescript
// Sin paymaster (usuario paga):
const client = createKernelAccountClient({
  account: kernelAccount,
  chain,
  bundlerTransport: http(BUNDLER_URL),
  // No paymaster
});

// Con paymaster (patrocinado):
const zerodevPaymaster = createZeroDevPaymasterClient({
  chain,
  transport: http(ZERODEV_RPC),
});

const client = createKernelAccountClient({
  account: kernelAccount,
  chain,
  bundlerTransport: http(BUNDLER_URL),
  paymaster: {
    getPaymasterData(userOperation) {
      // Puede agregar lógica condicional:
      if (userOperation.callData.includes('reproducir')) {
        // Patrocinar solo operaciones de reproducir
        return zerodevPaymaster.sponsorUserOperation({userOperation})
      }
      // Otras operaciones: usuario paga
      return undefined;
    }
  },
});
```

### Debugging

```typescript
// Ver qué validator se está usando:
const accountInfo = await kernelClient.account.getAccountInfo();
console.log("Current validator:", accountInfo.validator);

// Simular UserOp antes de enviar:
const simulateResult = await bundlerClient.simulateUserOperation({
  userOperation: userOp
});
console.log("Simulation:", simulateResult);

// Ver logs de EntryPoint:
// En Etherscan → Logs tab
// Busca eventos:
//   - UserOperationEvent(userOpHash, sender, ...)
//   - AccountDeployed(...)  // Si es primera vez
```

### TypeScript Types

```typescript
import type { 
  KernelAccountClient,
  KernelSmartAccount,
} from '@zerodev/sdk';
import type { 
  ModularSigner,
  Policy,
  PermissionPlugin 
} from '@zerodev/permissions';
import type { EntryPoint } from 'viem/account-abstraction';

// Tu client tipado:
const client: KernelAccountClient<
  typeof entryPoint,
  Transport,
  typeof sepolia,
  KernelSmartAccount<typeof entryPoint>
> = createKernelAccountClient({...});

// Signer tipado:
const signer: ModularSigner = await toECDSASigner({
  signer: privateKeyAccount
});
```

### ¿Por qué dos signers?

```typescript
// Session Key signer (viem Account)
const sessionKeySigner = privateKeyToAccount(sessionPrivateKey);

// Modular Signer (para ZeroDev)
const sessionKeySigner2 = await toECDSASigner({ signer: sessionKeySigner });
```

**Razón:**
- `privateKeyToAccount()` → Retorna un `LocalAccount` de viem
- `toECDSASigner()` → Convierte a `ModularSigner` que incluye:
  - `getSignerData()`: Serializa el signer para guardarlo
  - `getDummySignature()`: Para estimación de gas
  - `signerContractAddress`: Dirección del contrato de verificación

ZeroDev necesita estos métodos adicionales para manejar la lógica de Account Abstraction.

### Recuperar Kernel Account

Si ya creaste un Kernel Account antes, siempre se recupera la misma dirección:

```typescript
// Primera vez:
const kernelAccount1 = await createKernelAccount(publicClient, {
  plugins: { sudo: validator },
  entryPoint,
  kernelVersion,
});
console.log(kernelAccount1.address); // 0xYourKernelAccount...

// Después (mismo validator):
const kernelAccount2 = await createKernelAccount(publicClient, {
  plugins: { sudo: validator },  // Mismo validator
  entryPoint,
  kernelVersion,
});
console.log(kernelAccount2.address); // 0xYourKernelAccount... (¡Mismo!)
```

La dirección es **determinística** basada en:
- Owner (tu EOA)
- Validators configurados
- EntryPoint
- Salt (por defecto 0)

### Batch Transactions

Ejecutar múltiples operaciones en una UserOp:

```typescript
const userOpHash = await kernelClient.sendUserOperation({
  callData: await kernelClient.account.encodeCalls([
    {
      to: contractAddress1,
      value: 0n,
      data: encodeFunctionData({...}),
    },
    {
      to: contractAddress2,
      value: parseEther('0.1'),
      data: encodeFunctionData({...}),
    },
    // Más llamadas...
  ])
});

// Ejecuta todas atómicamente: o todas pasan o todas fallan
```

### Cambiar Session Key

```typescript
// Generar nueva session key:
const newSessionKey = generatePrivateKey();
localStorage.setItem('musicVaultSessionKey', newSessionKey);

// Recargar página → setup creará nuevo Permission Validator
// PERO: El Kernel Account es el mismo!
// Solo cambia el validator secundario
```

### ¿Qué pasa si pierdes la Session Key?

No hay problema:
1. Borra localStorage
2. Recarga la app
3. Se genera nueva session key
4. Nuevo Permission Validator se crea
5. El **Kernel Account sigue siendo el mismo** (determinado por ECDSA validator)
6. El saldo se mantiene intacto

Solo se pierde la session key, no tu cuenta principal.

### ¿Qué es KERNEL_V3_1?

```typescript
export const KERNEL_V3_1 = "0.3.1";
```

Es la versión del contrato Kernel Account. V3.1 soporta:
- ✅ **Multi-validator**: Múltiples validators simultáneos
- ✅ **Plugin system**: Extensible con plugins
- ✅ **Better gas optimization**: Mejoras de eficiencia
- ✅ **Granular permissions**: Políticas más específicas

Versiones anteriores (v2.x) tenían limitaciones en permisos.

### EntryPoint 0.7

```typescript
const entryPoint = getEntryPoint("0.7");
// Returns: "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
```

ERC-4337 ha evolucionado:
- **v0.6**: Primera implementación estable
- **v0.7**: Versión actual
  - Mejor manejo de gas
  - Soporte nativo para ERC-20 paymaster
  - Seguridad mejorada en validación
  - Optimizaciones de bundling

## 🐛 Troubleshooting

### Error AA23: "UserOperation reverted during simulation"

**🔴 Síntoma más común:**
```
Error: HTTP request failed.
Details: "UserOperation reverted during simulation with reason: AA23 reverted 0x007e472e"
Signature: 0xffffffffffffff...7aaaaaa...1c (firma dummy)
Balance: 100000000001100 wei (suficiente!)
```

**❗ DIAGNÓSTICO:**

Aunque el mensaje dice "fondos insuficientes", **AA23 con firma dummy** casi siempre significa:

**❌ El session key NO tiene permiso para ejecutar esa función**

**Cómo identificarlo:**
1. Abre consola del navegador (F12)
2. Busca `signature` en el error
3. Si ves `0xfffff...7aaaa...1c` → Es una **firma placeholder**
4. Significa: **El validator no pudo firmar porque NO tiene permiso**

**✅ SOLUCIÓN: Agregar la función al CallPolicy**

```typescript
// ❌ INCORRECTO - Session key solo puede reproducirCancion
const callPolicy = toCallPolicy({
  policyVersion: CallPolicyVersion.V0_0_5,
  permissions: [{
    abi: contract.abi,
    target: contract.address as `0x${string}`,
    functionName: 'reproducirCancion',
    valueLimit: BigInt(0),
  }]
});

// ✅ CORRECTO - Agregamos depositar con valueLimit adecuado
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
    valueLimit: BigInt(1000),  // Permite hasta 1000 wei
  }]
});
```

**⚠️ Después de cambiar permisos:**
1. Guarda el archivo
2. **Recarga la página completamente** (Ctrl+Shift+R)
3. El permissionPlugin se regenera con los nuevos permisos
4. Intenta depositar de nuevo

**Por qué pasa:**
- El session key es como un "permiso delegado" limitado
- Solo puede ejecutar funciones específicamente autorizadas
- `valueLimit` controla cuánto ETH puede enviar en cada llamada
- Si intentas algo no permitido → firma dummy → AA23

**Debugging avanzado:**
```typescript
// En catch del error depositar()
console.log("=== AA23 DEBUG ===")
console.log("Signature:", error.body.params[0].userOp.signature)
console.log("CallData:", error.body.params[0].userOp.callData)
console.log("Kernel Balance:", kernelEthBalance?.toString())

// Si signature empieza con 0xfffff → Permiso denegado
// Si signature es hash normal → Otro problema (gas, nonce, etc)
```

### "Saldo insuficiente para reproducir"
- El **Kernel Account** no tiene saldo en BovedaMusical
- Asegúrate de haber depositado primero

### "Error al depositar" (fondos reales insuficientes)

**Causa**: Tu Kernel Account no tiene ETH (diferente de AA23 con firma dummy)

```bash
# Verificar balance del Kernel en Etherscan:
# 1. Copia tu Kernel Address de la UI
# 2. Búscala en https://sepolia.etherscan.io
# 3. Mira el balance
```

**Solución**:
```
1. Abre MetaMask
2. Send → [Tu Kernel Address]
3. Envía 0.001 ETH o más
4. Espera confirmación
5. Intenta depositar de nuevo
```

### "Kernel client not ready"
- Espera a que termine el setup (puede tardar unos segundos)
- Verifica que `NEXT_PUBLIC_ZERODEV_RPC` esté configurado
- Refresca la página

### No veo la transacción en Etherscan
- Usa el link "View Internal Txns" de la UI
- Busca tu Kernel Account address, no tu EOA de MetaMask
- Las transacciones vienen del bundler, no de tu dirección

### "¿Perdí mis fondos?"

**NO**. Tus fondos están en tu Kernel Account, no perdidos:

1. **ETH en Kernel**: Búscalo en Etherscan con tu Kernel Address
2. **Saldo en BovedaMusical**: Llama a `saldoPorUsuario(kernelAddress)`
3. **¿Cómo recuperar?**: 
   - Puedes agregar una función `retirar()` al contrato
   - O enviar ETH del Kernel a otra dirección usando el ECDSA validator

### Confusión con direcciones

```
❌ INCORRECTO:
"Mi MetaMask (0xYourMetaMask...) tiene 1 ETH pero no puedo depositar"

✅ CORRECTO:
"Mi MetaMask (0xYourMetaMask...) tiene 1 ETH, pero mi KERNEL ACCOUNT 
(0xYourKernelAccount...) tiene 0 ETH.
Necesito transferir: 0xYourMetaMask → 0xYourKernelAccount primero."
```

### Session key no funciona
- Borra localStorage y recarga
- Se generará una nueva session key automáticamente
- El Kernel Account y sus fondos se mantienen (son independientes)

### "¿Por qué necesito dos direcciones?"

Es la naturaleza de Account Abstraction:
- **EOA (MetaMask)**: Firma y autoriza (gratis, solo firma)
- **Kernel (Smart Contract)**: Ejecuta transacciones (necesita ETH para value, no para gas)
- **Gas**: Lo pagamos nosotros via paymaster (gratis para ti)

Piensa en ello como:
- **MetaMask** = Tu llave maestra
- **Kernel** = Tu asistente que ejecuta tareas
- El asistente necesita su propia billetera para pagar cosas (aunque el gas lo cubrimos nosotros)

### Diferencia Gas vs Value

```typescript
// Al depositar:
await kernelClient.sendUserOperation({
  callData: await kernelClient.account.encodeCalls([{
    to: contract.address,
    value: BigInt(10),  // ← Esto REQUIERE que Kernel tenga ETH
    data: callData,
  }]),
});

// Gas de la transacción ← Lo paga el PAYMASTER (nosotros)
// Value (10 wei) ← Lo paga el KERNEL ACCOUNT
```

**Por eso necesitas fondear el Kernel: para poder enviar value, no para gas.**

---

**¡Disfruta explorando Account Abstraction! 🎵**

## 📌 Mejoras Sugeridas para Producción

### 1. Migrar a Base Sepolia (L2) en lugar de Sepolia

**Por qué:**
- ⚡ **Más rápido**: Las L2 procesan transacciones mucho más rápido que L1
- 💰 **Gas más barato**: Aunque usamos paymaster, las operaciones son más económicas
- 🚀 **Mejor UX**: Confirmaciones instantáneas mejoran la experiencia del usuario
- 📈 **Escalabilidad**: Soporta más transacciones por segundo

**Cambios necesarios:**

```typescript
// packages/nextjs/app/page.tsx
import { baseSepolia } from 'viem/chains'

const chain = baseSepolia // En lugar de sepolia
```

```typescript
// packages/hardhat/hardhat.config.ts
const config: HardhatUserConfig = {
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
      chainId: 84532,
    },
  },
};
```

**Desplegar contratos en Base Sepolia:**
```bash
yarn hardhat deploy --network baseSepolia
```

**Obtener ETH de testnet:**
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)

### 2. Mostrar Balance del Kernel Account

```typescript
// En packages/nextjs/app/page.tsx
const [kernelEthBalance, setKernelEthBalance] = useState<bigint>();

useEffect(() => {
  if (!kernelAddress) return;
  
  const loadKernelBalance = async () => {
    const publicClient = createPublicClient({
      transport: http(process.env.NEXT_PUBLIC_ZERODEV_RPC),
      chain: sepolia
    });
    
    const balance = await publicClient.getBalance({
      address: kernelAddress as `0x${string}`
    });
    
    setKernelEthBalance(balance);
  };
  
  loadKernelBalance();
  // Actualizar cada 10 segundos
  const interval = setInterval(loadKernelBalance, 10000);
  return () => clearInterval(interval);
}, [kernelAddress]);
```

### 2. Botón para Fondear Kernel Account

```typescript
const fondearKernel = async () => {
  if (!walletClient || !kernelAddress) return;
  
  try {
    const hash = await walletClient.sendTransaction({
      to: kernelAddress as `0x${string}`,
      value: parseEther('0.001'), // 0.001 ETH
    });
    
    alert(`Fondos enviados! Tx: ${hash}`);
    // Esperar confirmación y actualizar balance
  } catch (error) {
    console.error(error);
  }
};

// En el JSX:
<button onClick={fondearKernel}>
  💰 Enviar 0.001 ETH a Kernel Account
</button>
```

### 3. Tutorial/Onboarding Modal

```typescript
const [showOnboarding, setShowOnboarding] = useState(false);

useEffect(() => {
  // Mostrar si es primera vez y no tiene fondos
  if (kernelAddress && kernelEthBalance === 0n) {
    setShowOnboarding(true);
  }
}, [kernelAddress, kernelEthBalance]);

// Modal component explicando el flujo
```

### 4. Diagrama Visual en la UI

```tsx
<div className="my-4 p-4 bg-gray-50 rounded">
  <p className="text-sm font-semibold mb-2">Flujo de Fondos:</p>
  <div className="flex items-center gap-2 text-xs">
    <div className="border p-2 rounded">
      <p>MetaMask</p>
      <p className="font-mono">{address?.slice(0,6)}...</p>
    </div>
    <span>→</span>
    <div className="border p-2 rounded border-blue-500">
      <p>Kernel Account</p>
      <p className="font-mono">{kernelAddress?.slice(0,6)}...</p>
    </div>
    <span>→</span>
    <div className="border p-2 rounded">
      <p>BovedaMusical</p>
      <p>Saldo: {balance} wei</p>
    </div>
  </div>
</div>
```

### 5. Validación Antes de Depositar

```typescript
const depositar = async () => {
  // Validar que Kernel tenga fondos
  if (kernelEthBalance < BigInt(10)) {
    alert(
      `⚠️ Tu Kernel Account no tiene suficiente ETH.\n` +
      `Necesitas al menos 10 wei.\n` +
      `Balance actual: ${kernelEthBalance} wei\n\n` +
      `Envía ETH desde MetaMask a: ${kernelAddress}`
    );
    return;
  }
  
  // Continuar con el depósito...
};
```

### 6. Estado de Carga con Explicación

```tsx
{loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded">
      <p className="font-bold mb-2">Procesando...</p>
      <p className="text-sm">1. Firmando con session key ✓</p>
      <p className="text-sm">2. Enviando al bundler...</p>
      <p className="text-sm">3. Esperando confirmación...</p>
    </div>
  </div>
)}
```

### 7. Link Rápido a Fondear

```tsx
<a
  href={`https://sepolia.etherscan.io/address/${kernelAddress}`}
  target="_blank"
  className="text-blue-600 hover:underline"
>
  Ver Kernel Account en Etherscan →
</a>

{kernelEthBalance === 0n && (
  <p className="text-red-600 text-sm mt-2">
    ⚠️ Sin fondos. 
    <button
      onClick={() => {
        navigator.clipboard.writeText(kernelAddress || '');
        alert('Dirección copiada! Ábrela en MetaMask para enviar ETH');
      }}
      className="underline ml-1"
    >
      Copiar dirección para fondear
    </button>
  </p>
)}
```

Estas mejoras harán que la experiencia sea mucho más clara y evitarán confusión sobre las direcciones y fondos.

## 🐳 Docker y Deployment

### Standalone Next.js

Este proyecto usa **Next.js Standalone Output** para crear builds optimizados y ultra-ligeros:

```typescript
// next.config.ts
if (process.env.DOCKER_BUILD === "true") {
  nextConfig.output = "standalone";
}
```

**¿Qué hace standalone?**
- Genera solo los archivos necesarios en `.next/standalone`
- Incluye un `server.js` listo para producción
- Elimina `node_modules` innecesarios
- Reduce el tamaño de la imagen Docker ~70%

### Dockerfile

El proyecto incluye un Dockerfile multi-stage optimizado para monorepos con Yarn 3:

```dockerfile
# Stage 1: Builder - compila la app
FROM node:20-alpine AS builder
WORKDIR /app
# Copia configuración de Yarn 3
COPY .yarnrc.yml .yarn yarn.lock package.json ./
COPY packages/nextjs/package.json ./packages/nextjs/
RUN corepack enable && yarn install
COPY packages/nextjs ./packages/nextjs
RUN yarn build

# Stage 2: Runner - imagen final ligera
FROM node:20-alpine AS runner
WORKDIR /app
# Solo copia lo necesario del standalone
COPY --from=builder /app/packages/nextjs/.next/standalone ./
COPY --from=builder /app/packages/nextjs/.next/static ./packages/nextjs/.next/static
COPY --from=builder /app/packages/nextjs/public ./packages/nextjs/public
CMD ["node", "packages/nextjs/server.js"]
```

**Características:**
- ✅ Multi-stage build (builder + runner)
- ✅ Soporta Yarn 3 workspaces (monorepo)
- ✅ Variables de entorno en build-time (`ARG NEXT_PUBLIC_ZERODEV_RPC`)
- ✅ Ignora telemetría de Next.js
- ✅ Ignora errores de ESLint/TypeScript en build (solo para Docker)
- ✅ Imagen final ~200MB vs ~800MB sin standalone

### Docker Compose (Local)

```bash
# Iniciar en modo desarrollo
docker compose up -d

# Ver logs
docker compose logs -f frontend

# Rebuildir después de cambios
docker compose up --build -d

# Parar todo
docker compose down
```

El archivo `.env` en la raíz contiene las variables necesarias:
```env
NEXT_PUBLIC_ZERODEV_RPC=https://rpc.zerodev.app/api/v3/...
```

### Deployment en Render

**El proyecto está configurado para desplegarse automáticamente en Render:**

#### 🎯 Deploy Automático con GitHub Actions

Cada vez que hagas **push a main**, el proyecto se despliega automáticamente:

1. **GitHub Actions** detecta el push a main
2. Ejecuta el workflow `.github/workflows/deploy.yaml`
3. Notifica a Render mediante el **Deploy Hook URL**
4. Render **clona tu repositorio** desde GitHub
5. Render **buildea la imagen Docker** con tus cambios
6. Render **despliega** la nueva versión automáticamente

**Configuración del Deploy Hook:**

1. **En Render Dashboard**:
   - Ve a tu servicio → Settings
   - Busca la sección "Deploy Hook"
   - Copia la URL (se verá como `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

2. **En GitHub**:
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - **Name**: `RENDER_DEPLOY_HOOK_URL`
   - **Value**: Pega la URL del deploy hook de Render
   - Click "Add secret"

3. **¡Listo!** Ahora cada push a main despliega automáticamente 🚀

**El workflow está en** `.github/workflows/deploy.yaml`:
```yaml
name: Deploy to Render

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy Hook
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

#### 📋 Variables de Entorno en Render

**Se configuran en Render Dashboard:**

1. Ve a tu servicio en Render
2. Click en "Environment" en el menú lateral
3. Agrega las siguientes variables:
   - **`NEXT_PUBLIC_ZERODEV_RPC`** (obligatorio) - Tu RPC URL de ZeroDev
   - `DOCKER_BUILD=true` (opcional, lo detecta automático)

4. Click "Save Changes"

⚠️ **Importante**: 
- Las variables `NEXT_PUBLIC_*` se embeden en el bundle durante el build
- Render pasa las env vars como `ARG` al Dockerfile automáticamente
- Si cambias una variable, necesitas hacer un nuevo deploy (se puede hacer manual desde Render o push a main)

#### 🐳 Configuración Docker en Render

**Render detecta automáticamente:**
- ✅ **Dockerfile en la raíz** del proyecto
- ✅ **Puerto expuesto**: 3000
- ✅ **Comando**: `node packages/nextjs/server.js`

**Pasos para el primer deploy manual en Render:**

1. Conectar repositorio de GitHub a Render
2. Seleccionar "Web Service"
3. Render detecta Docker automáticamente
4. Agregar variable de entorno: `NEXT_PUBLIC_ZERODEV_RPC`
5. Click en "Create Web Service"
6. ¡Deploy automático! 🚀

**Después del primer deploy**, cada push a main despliega automáticamente gracias al workflow de GitHub Actions.

### .dockerignore

El proyecto ignora archivos innecesarios para optimizar el build:
```
**/node_modules
.git
.next
packages/hardhat    # No necesitamos el backend en el frontend
```

Esto reduce el tamaño del contexto de build de ~500MB a ~50MB.
