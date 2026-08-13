// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title WholesaleCash — dinero mayorista SIMULADO para un mercado tokenizado educativo
/// @notice USO EDUCATIVO EXCLUSIVAMENTE. Este contrato NO es, ni reproduce, ni pretende
///         reproducir ninguna moneda digital de banco central real, de Chile ni de ningún
///         otro país. Es una simulación docente para estudiar la mecánica de liquidación.
/// @dev Modela las tres propiedades que distinguen al dinero mayorista de un token
///      cualquiera y que importan para entender el módulo 22:
///      1. Solo el emisor (un "banco central" simulado) crea y destruye saldo.
///      2. Solo participantes ADMITIDOS pueden tenerlo: no circula al público.
///      3. La transferencia comprueba la admisión en AMBOS extremos.
contract WholesaleCash {
    string public constant name = "Simulated Wholesale Cash";
    string public constant symbol = "sWCASH";
    uint8 public constant decimals = 2;

    address public immutable issuer;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public isParticipant;
    mapping(address => mapping(address => uint256)) public allowance;

    error OnlyIssuer();
    error NotParticipant(address account);
    error InsufficientBalance();
    error InsufficientAllowance();
    error ZeroAddress();

    event ParticipantAdmitted(address indexed account);
    event ParticipantRemoved(address indexed account);
    event Issued(address indexed to, uint256 amount);
    event Redeemed(address indexed from, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyIssuer() {
        if (msg.sender != issuer) revert OnlyIssuer();
        _;
    }

    constructor() {
        issuer = msg.sender;
        isParticipant[msg.sender] = true;
        emit ParticipantAdmitted(msg.sender);
    }

    /// @notice Admite a una entidad con cuenta. Equivale a abrir cuenta en el banco central.
    function admit(address account) external onlyIssuer {
        if (account == address(0)) revert ZeroAddress();
        isParticipant[account] = true;
        emit ParticipantAdmitted(account);
    }

    /// @notice Excluye a un participante. Su saldo queda inmovilizado: no puede enviar ni
    ///         recibir. Es deliberado — refleja que el acceso es una decisión del emisor.
    function remove(address account) external onlyIssuer {
        isParticipant[account] = false;
        emit ParticipantRemoved(account);
    }

    /// @notice Emisión contra reservas. Solo el emisor, solo a participantes.
    function issue(address to, uint256 amount) external onlyIssuer {
        if (!isParticipant[to]) revert NotParticipant(to);
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Issued(to, amount);
        emit Transfer(address(0), to, amount);
    }

    /// @notice Redención: el participante devuelve el saldo y el emisor lo destruye.
    function redeem(address from, uint256 amount) external onlyIssuer {
        if (balanceOf[from] < amount) revert InsufficientBalance();
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Redeemed(from, amount);
        emit Transfer(from, address(0), amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        if (spender == address(0)) revert ZeroAddress();
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 permitted = allowance[from][msg.sender];
        if (permitted < amount) revert InsufficientAllowance();
        if (permitted != type(uint256).max) allowance[from][msg.sender] = permitted - amount;
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) private {
        // La comprobación en AMBOS extremos es lo que hace "mayorista" a este dinero.
        if (!isParticipant[from]) revert NotParticipant(from);
        if (!isParticipant[to]) revert NotParticipant(to);
        if (balanceOf[from] < amount) revert InsufficientBalance();
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }
}
