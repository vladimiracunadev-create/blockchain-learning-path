// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {WholesaleCash} from "./WholesaleCash.sol";
import {TokenizedBond} from "./TokenizedBond.sol";

/// @title DvPSettlement — entrega contra pago atómica (modelo 1 de DvP)
/// @notice USO EDUCATIVO EXCLUSIVAMENTE.
/// @dev Implementa el modelo 1 de DvP en su forma pura: ambas patas, operación a
///      operación, simultáneas. Si cualquiera falla, la transacción entera revierte y
///      NINGUNA parte queda expuesta al principal. Ese es el argumento del módulo 25 —
///      y su coste, también del módulo 25, es que no hay neteo: hace falta el importe
///      íntegro en cada momento.
contract DvPSettlement {
    enum Status {
        None,
        Proposed,
        Settled,
        Cancelled
    }

    struct Trade {
        address seller;
        address buyer;
        uint256 titles;
        uint256 pricePerTitle;
        uint64 expiry;
        Status status;
    }

    WholesaleCash public immutable cash;
    TokenizedBond public immutable bond;

    uint256 public tradeCount;
    mapping(uint256 => Trade) public trades;

    error NotCounterparty();
    error WrongStatus();
    error Expired();
    error NotExpired();
    error InvalidTrade();

    event TradeProposed(
        uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 titles, uint256 amount
    );
    event TradeSettled(uint256 indexed tradeId, uint256 titles, uint256 amount);
    event TradeCancelled(uint256 indexed tradeId);

    constructor(WholesaleCash cash_, TokenizedBond bond_) {
        cash = cash_;
        bond = bond_;
    }

    /// @notice El vendedor propone la operación. Nada se mueve todavía.
    function propose(address buyer, uint256 titles, uint256 pricePerTitle, uint64 expiry)
        external
        returns (uint256 tradeId)
    {
        if (buyer == address(0) || titles == 0 || pricePerTitle == 0) revert InvalidTrade();
        if (expiry <= block.timestamp) revert Expired();
        tradeId = ++tradeCount;
        trades[tradeId] = Trade({
            seller: msg.sender,
            buyer: buyer,
            titles: titles,
            pricePerTitle: pricePerTitle,
            expiry: expiry,
            status: Status.Proposed
        });
        emit TradeProposed(tradeId, msg.sender, buyer, titles, titles * pricePerTitle);
    }

    /// @notice El comprador liquida. Las dos patas ocurren aquí, o no ocurre ninguna.
    /// @dev No hay estado intermedio observable: si la transferencia de dinero revierte,
    ///      la de títulos se deshace con ella. Es lo que elimina el riesgo de principal.
    function settle(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        if (trade.status != Status.Proposed) revert WrongStatus();
        if (msg.sender != trade.buyer) revert NotCounterparty();
        if (block.timestamp > trade.expiry) revert Expired();

        trade.status = Status.Settled;
        uint256 amount = trade.titles * trade.pricePerTitle;

        // Pata de valores y pata de dinero en la misma transacción.
        bond.transferFrom(trade.seller, trade.buyer, trade.titles);
        cash.transferFrom(trade.buyer, trade.seller, amount);

        emit TradeSettled(tradeId, trade.titles, amount);
    }

    /// @notice Cancelación: por el vendedor en cualquier momento, o por cualquiera una vez
    ///         vencido el plazo. Como nada se depositó, no hay nada que devolver.
    function cancel(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        if (trade.status != Status.Proposed) revert WrongStatus();
        if (msg.sender != trade.seller && block.timestamp <= trade.expiry) revert NotExpired();
        trade.status = Status.Cancelled;
        emit TradeCancelled(tradeId);
    }
}
