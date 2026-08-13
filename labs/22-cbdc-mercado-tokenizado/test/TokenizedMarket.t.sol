// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {WholesaleCash} from "../src/WholesaleCash.sol";
import {TokenizedBond} from "../src/TokenizedBond.sol";
import {DvPSettlement} from "../src/DvPSettlement.sol";

/// @dev Mercado tokenizado educativo: dinero mayorista simulado, bono con transferencia
///      restringida y liquidación atómica. Cada prueba comprueba una afirmación concreta
///      de los módulos 22, 24 y 25.
contract TokenizedMarketTest is Test {
    WholesaleCash private cash;
    TokenizedBond private bond;
    DvPSettlement private dvp;

    address private issuer = address(this); // banco central + emisor simulados
    address private bankA = makeAddr("bankA");
    address private bankB = makeAddr("bankB");
    address private outsider = makeAddr("outsider");

    uint256 private constant FACE = 1_000_00; // 1 000,00 con 2 decimales
    uint256 private constant COUPON = 20_00; // 20,00 por título y periodo
    uint64 private constant MATURITY = 365 days;

    function setUp() public {
        cash = new WholesaleCash();
        bond = new TokenizedBond(cash, FACE, COUPON, MATURITY);
        dvp = new DvPSettlement(cash, bond);

        cash.admit(bankA);
        cash.admit(bankB);
        cash.admit(address(bond));
        cash.issue(bankA, 10_000_000_00);
        cash.issue(bankB, 10_000_000_00);
        cash.issue(issuer, 10_000_000_00);

        bond.setEligibility(bankA, true);
        bond.setEligibility(bankB, true);
        bond.issue(bankA, 1_000);
    }

    // --- Dinero mayorista: acceso restringido ---------------------------------

    function testWholesaleCashOnlyCirculatesAmongParticipants() public {
        vm.prank(bankA);
        vm.expectRevert(abi.encodeWithSelector(WholesaleCash.NotParticipant.selector, outsider));
        cash.transfer(outsider, 100_00);
    }

    function testOnlyIssuerCanIssueWholesaleCash() public {
        vm.prank(bankA);
        vm.expectRevert(WholesaleCash.OnlyIssuer.selector);
        cash.issue(bankA, 1);
    }

    function testRemovedParticipantCannotSendOrReceive() public {
        cash.remove(bankB);
        vm.prank(bankA);
        vm.expectRevert(abi.encodeWithSelector(WholesaleCash.NotParticipant.selector, bankB));
        cash.transfer(bankB, 100_00);
    }

    function testRedemptionDestroysSupply() public {
        uint256 before = cash.totalSupply();
        cash.redeem(bankA, 1_000_00);
        assertEq(cash.totalSupply(), before - 1_000_00);
        assertEq(cash.balanceOf(bankA), 10_000_000_00 - 1_000_00);
    }

    // --- Bono: transferencia restringida --------------------------------------

    function testBondRejectsTransferToNonEligibleInvestor() public {
        vm.prank(bankA);
        vm.expectRevert(abi.encodeWithSelector(TokenizedBond.NotEligible.selector, outsider));
        bond.transfer(outsider, 10);
    }

    function testBondAllowsTransferBetweenEligibleInvestors() public {
        vm.prank(bankA);
        bond.transfer(bankB, 400);
        assertEq(bond.balanceOf(bankA), 600);
        assertEq(bond.balanceOf(bankB), 400);
    }

    // --- DvP: atomicidad -------------------------------------------------------

    function testDvPSettlesBothLegsAtomically() public {
        uint256 titles = 100;
        uint256 price = 985_00;
        uint256 amount = titles * price;

        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, titles, price, uint64(block.timestamp + 1 days));
        vm.prank(bankA);
        bond.approve(address(dvp), titles);
        vm.prank(bankB);
        cash.approve(address(dvp), amount);

        uint256 cashA = cash.balanceOf(bankA);
        uint256 cashB = cash.balanceOf(bankB);

        vm.prank(bankB);
        dvp.settle(tradeId);

        assertEq(bond.balanceOf(bankA), 900);
        assertEq(bond.balanceOf(bankB), 100);
        assertEq(cash.balanceOf(bankA), cashA + amount);
        assertEq(cash.balanceOf(bankB), cashB - amount);
    }

    /// @dev El corazón del módulo 25: si falta la pata de dinero, la de valores NO ocurre.
    function testDvPRevertsEntirelyWhenCashLegFails() public {
        uint256 titles = 100;
        uint256 price = 985_00;

        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, titles, price, uint64(block.timestamp + 1 days));
        vm.prank(bankA);
        bond.approve(address(dvp), titles);
        // El comprador NO autoriza el efectivo: la pata de dinero no puede ejecutarse.

        vm.prank(bankB);
        vm.expectRevert(WholesaleCash.InsufficientAllowance.selector);
        dvp.settle(tradeId);

        // Estado intacto: nadie entregó nada.
        assertEq(bond.balanceOf(bankA), 1_000);
        assertEq(bond.balanceOf(bankB), 0);
    }

    function testDvPRevertsEntirelyWhenSecuritiesLegFails() public {
        uint256 titles = 100;
        uint256 price = 985_00;

        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, titles, price, uint64(block.timestamp + 1 days));
        vm.prank(bankB);
        cash.approve(address(dvp), titles * price);
        // El vendedor NO autoriza los títulos: fallo de entrega.

        vm.prank(bankB);
        vm.expectRevert(TokenizedBond.InsufficientAllowance.selector);
        dvp.settle(tradeId);

        assertEq(cash.balanceOf(bankB), 10_000_000_00);
    }

    function testDvPCannotSettleAfterExpiry() public {
        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, 10, 985_00, uint64(block.timestamp + 1 days));
        vm.warp(block.timestamp + 2 days);
        vm.prank(bankB);
        vm.expectRevert(DvPSettlement.Expired.selector);
        dvp.settle(tradeId);
    }

    function testOnlyBuyerCanSettle() public {
        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, 10, 985_00, uint64(block.timestamp + 1 days));
        vm.prank(outsider);
        vm.expectRevert(DvPSettlement.NotCounterparty.selector);
        dvp.settle(tradeId);
    }

    function testCancelledTradeCannotSettle() public {
        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, 10, 985_00, uint64(block.timestamp + 1 days));
        vm.prank(bankA);
        dvp.cancel(tradeId);
        vm.prank(bankB);
        vm.expectRevert(DvPSettlement.WrongStatus.selector);
        dvp.settle(tradeId);
    }

    // --- Eventos corporativos --------------------------------------------------

    function testCouponUsesClaimPatternAndPaysRecordHolders() public {
        vm.prank(bankA);
        bond.transfer(bankB, 400);

        address[] memory holders = new address[](2);
        holders[0] = bankA;
        holders[1] = bankB;

        cash.approve(address(bond), type(uint256).max);
        uint256 couponId = bond.announceCoupon(holders);

        vm.prank(bankA);
        uint256 paidA = bond.claimCoupon(couponId);
        vm.prank(bankB);
        uint256 paidB = bond.claimCoupon(couponId);

        assertEq(paidA, 600 * COUPON);
        assertEq(paidB, 400 * COUPON);
    }

    function testCouponCannotBeClaimedTwice() public {
        address[] memory holders = new address[](1);
        holders[0] = bankA;
        cash.approve(address(bond), type(uint256).max);
        uint256 couponId = bond.announceCoupon(holders);

        vm.prank(bankA);
        bond.claimCoupon(couponId);
        vm.prank(bankA);
        vm.expectRevert(abi.encodeWithSelector(TokenizedBond.AlreadyClaimed.selector, couponId, bankA));
        bond.claimCoupon(couponId);
    }

    /// @dev La fecha de registro fija quién cobra: vender después no quita el derecho.
    function testCouponFollowsRecordDateNotCurrentHolding() public {
        address[] memory holders = new address[](2);
        holders[0] = bankA;
        holders[1] = bankB;
        cash.approve(address(bond), type(uint256).max);
        uint256 couponId = bond.announceCoupon(holders);

        // bankA vende TODO después de la fecha de registro.
        vm.prank(bankA);
        bond.transfer(bankB, 1_000);

        vm.prank(bankA);
        uint256 paidA = bond.claimCoupon(couponId);
        assertEq(paidA, 1_000 * COUPON);

        vm.prank(bankB);
        vm.expectRevert(TokenizedBond.NothingToClaim.selector);
        bond.claimCoupon(couponId);
    }

    function testRedemptionOnlyAfterMaturity() public {
        vm.prank(bankA);
        vm.expectRevert(TokenizedBond.NotYetMatured.selector);
        bond.redeem(10);

        vm.expectRevert(TokenizedBond.NotYetMatured.selector);
        bond.markMatured();

        vm.warp(MATURITY + 1);
        bond.markMatured();
        cash.transfer(address(bond), 1_000 * FACE);

        vm.prank(bankA);
        uint256 amount = bond.redeem(1_000);
        assertEq(amount, 1_000 * FACE);
        assertEq(bond.totalSupply(), 0);
    }

    function testNoIssuanceAfterMaturity() public {
        vm.warp(MATURITY + 1);
        bond.markMatured();
        vm.expectRevert(TokenizedBond.AlreadyMatured.selector);
        bond.issue(bankA, 1);
    }

    // --- Invariante -------------------------------------------------------------

    /// @dev Conservación: la liquidación atómica no crea ni destruye títulos ni dinero,
    ///      solo los reasigna. Con cualquier tamaño de operación.
    function testFuzzSettlementConservesTotals(uint96 titlesRaw, uint96 priceRaw) public {
        uint256 titles = bound(uint256(titlesRaw), 1, 1_000);
        uint256 price = bound(uint256(priceRaw), 1, 10_000_00);
        uint256 amount = titles * price;
        vm.assume(amount <= cash.balanceOf(bankB));

        uint256 bondTotal = bond.totalSupply();
        uint256 cashTotal = cash.totalSupply();

        vm.prank(bankA);
        uint256 tradeId = dvp.propose(bankB, titles, price, uint64(block.timestamp + 1 days));
        vm.prank(bankA);
        bond.approve(address(dvp), titles);
        vm.prank(bankB);
        cash.approve(address(dvp), amount);
        vm.prank(bankB);
        dvp.settle(tradeId);

        assertEq(bond.totalSupply(), bondTotal);
        assertEq(cash.totalSupply(), cashTotal);
        assertEq(bond.balanceOf(bankA) + bond.balanceOf(bankB), bondTotal);
    }
}
