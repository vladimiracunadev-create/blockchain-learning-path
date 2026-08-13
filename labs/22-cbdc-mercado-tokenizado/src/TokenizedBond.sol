// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {WholesaleCash} from "./WholesaleCash.sol";

/// @title TokenizedBond — bono tokenizado educativo con transferencia restringida
/// @notice USO EDUCATIVO EXCLUSIVAMENTE. No es una emisión de valores ni una oferta.
/// @dev Implementa las tres piezas que un ERC-20 corriente NO tiene y que el módulo 24
///      explica por qué son obligatorias cuando el instrumento es un valor:
///      1. Transferencia restringida a inversores elegibles (con motivo de rechazo legible).
///      2. Pago de cupón por PATRÓN DE RECLAMACIÓN, no iterando sobre los titulares — con
///         miles de titulares, iterar no cabe en un bloque.
///      3. Amortización al vencimiento contra entrega del título.
contract TokenizedBond {
    string public constant name = "Educational Tokenized Bond";
    string public constant symbol = "eBOND";
    uint8 public constant decimals = 0; // títulos enteros, como un bono real

    /// @notice Valor nominal por título, en las mismas unidades que WholesaleCash.
    uint256 public immutable faceValue;
    /// @notice Cupón por título y periodo, en unidades de WholesaleCash.
    uint256 public immutable couponPerPeriod;
    uint256 public immutable maturity;

    address public immutable issuer;
    WholesaleCash public immutable cash;

    uint256 public totalSupply;
    uint256 public couponsPaid;
    bool public matured;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public isEligible;
    mapping(address => mapping(address => uint256)) public allowance;
    /// @dev couponId => titular => reclamado
    mapping(uint256 => mapping(address => bool)) public hasClaimed;
    /// @dev couponId => títulos del titular en la fecha de registro
    mapping(uint256 => mapping(address => uint256)) private recordHolding;
    mapping(uint256 => bool) public couponAnnounced;

    error OnlyIssuer();
    error NotEligible(address account);
    error InsufficientBalance();
    error InsufficientAllowance();
    error AlreadyMatured();
    error NotYetMatured();
    error CouponNotAnnounced(uint256 couponId);
    error AlreadyClaimed(uint256 couponId, address holder);
    error NothingToClaim();

    event EligibilityUpdated(address indexed account, bool eligible);
    event Issued(address indexed to, uint256 titles);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event CouponAnnounced(uint256 indexed couponId, uint256 amountFunded);
    event CouponClaimed(uint256 indexed couponId, address indexed holder, uint256 amount);
    event Redeemed(address indexed holder, uint256 titles, uint256 amount);

    modifier onlyIssuer() {
        if (msg.sender != issuer) revert OnlyIssuer();
        _;
    }

    constructor(WholesaleCash cash_, uint256 faceValue_, uint256 couponPerPeriod_, uint256 maturity_) {
        issuer = msg.sender;
        cash = cash_;
        faceValue = faceValue_;
        couponPerPeriod = couponPerPeriod_;
        maturity = maturity_;
        isEligible[msg.sender] = true;
        emit EligibilityUpdated(msg.sender, true);
    }

    /// @notice Alta o baja de un inversor elegible. En un sistema real, esta comprobación
    ///         se apoyaría en una credencial verificable (módulo 26), no en una lista.
    function setEligibility(address account, bool eligible) external onlyIssuer {
        isEligible[account] = eligible;
        emit EligibilityUpdated(account, eligible);
    }

    function issue(address to, uint256 titles) external onlyIssuer {
        if (matured) revert AlreadyMatured();
        if (!isEligible[to]) revert NotEligible(to);
        totalSupply += titles;
        balanceOf[to] += titles;
        emit Issued(to, titles);
        emit Transfer(address(0), to, titles);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 titles) external returns (bool) {
        _transfer(msg.sender, to, titles);
        return true;
    }

    function transferFrom(address from, address to, uint256 titles) external returns (bool) {
        uint256 permitted = allowance[from][msg.sender];
        if (permitted < titles) revert InsufficientAllowance();
        if (permitted != type(uint256).max) allowance[from][msg.sender] = permitted - titles;
        _transfer(from, to, titles);
        return true;
    }

    /// @notice El emisor anuncia y FONDEA un cupón. La fecha de registro es este bloque.
    /// @dev Se fondea por adelantado: un cupón anunciado y no fondeado no es un cupón.
    function announceCoupon(address[] calldata holders) external onlyIssuer returns (uint256 couponId) {
        if (matured) revert AlreadyMatured();
        couponId = ++couponsPaid;
        uint256 funded;
        for (uint256 i = 0; i < holders.length; ++i) {
            uint256 held = balanceOf[holders[i]];
            recordHolding[couponId][holders[i]] = held;
            funded += held * couponPerPeriod;
        }
        couponAnnounced[couponId] = true;
        // El emisor deposita el importe íntegro del cupón en este contrato.
        cash.transferFrom(msg.sender, address(this), funded);
        emit CouponAnnounced(couponId, funded);
    }

    /// @notice Cada titular RECLAMA su cupón. Coste constante por titular: es el patrón que
    ///         hace viable un reparto entre miles de tenedores.
    function claimCoupon(uint256 couponId) external returns (uint256 amount) {
        if (!couponAnnounced[couponId]) revert CouponNotAnnounced(couponId);
        if (hasClaimed[couponId][msg.sender]) revert AlreadyClaimed(couponId, msg.sender);
        amount = recordHolding[couponId][msg.sender] * couponPerPeriod;
        if (amount == 0) revert NothingToClaim();
        hasClaimed[couponId][msg.sender] = true;
        cash.transfer(msg.sender, amount);
        emit CouponClaimed(couponId, msg.sender, amount);
    }

    /// @notice Vencimiento. A partir de aquí no se emite ni se anuncian cupones.
    function markMatured() external onlyIssuer {
        if (block.timestamp < maturity) revert NotYetMatured();
        matured = true;
    }

    /// @notice Amortización: el titular entrega los títulos y recibe el nominal.
    /// @dev El emisor debe haber fondeado el contrato antes de que nadie amortice.
    function redeem(uint256 titles) external returns (uint256 amount) {
        if (!matured) revert NotYetMatured();
        if (balanceOf[msg.sender] < titles) revert InsufficientBalance();
        balanceOf[msg.sender] -= titles;
        totalSupply -= titles;
        amount = titles * faceValue;
        cash.transfer(msg.sender, amount);
        emit Redeemed(msg.sender, titles, amount);
        emit Transfer(msg.sender, address(0), titles);
    }

    /// @dev La restricción vive en la propia transferencia: un valor con inversores
    ///      elegibles no puede usar una transferencia libre. Es incumplimiento por diseño.
    function _transfer(address from, address to, uint256 titles) private {
        if (!isEligible[from]) revert NotEligible(from);
        if (!isEligible[to]) revert NotEligible(to);
        if (balanceOf[from] < titles) revert InsufficientBalance();
        balanceOf[from] -= titles;
        balanceOf[to] += titles;
        emit Transfer(from, to, titles);
    }
}
