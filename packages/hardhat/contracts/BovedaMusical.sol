//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract BovedaMusical {
    uint256 public constant valorPorCancion = 1 wei;
    mapping(address => uint) public saldoPorUsuario;

    event CancionReproducida(address indexed usuario, uint256 nuevoSaldo);

    function depositar() public payable {
        require(msg.value >= valorPorCancion, "Debe depositar al menos 1 wei por cancion");
        saldoPorUsuario[msg.sender] += msg.value;
    }

    function reproducirCancion() public {
        require(saldoPorUsuario[msg.sender] >= valorPorCancion, "Saldo insuficiente para reproducir la cancion");
        saldoPorUsuario[msg.sender] -= valorPorCancion;
    }
}
