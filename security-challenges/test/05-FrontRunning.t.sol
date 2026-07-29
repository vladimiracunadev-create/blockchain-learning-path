// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "forge-std/Test.sol";
import {VulnerableQuiz, CommitRevealQuiz} from "../contracts/05-FrontRunning.sol";

contract FrontRunningTest is Test {
    address internal attacker = address(0xBAD);
    address internal bob = address(0xB0B);

    function test_exploit_respuestaEnTextoPlanoEsRobable() public {
        vm.deal(address(this), 100 ether);
        string memory secret = "satoshi";
        VulnerableQuiz quiz = new VulnerableQuiz{value: 5 ether}(keccak256(bytes(secret)));

        // El atacante ve el texto plano en el mempool y adelanta la transaccion.
        vm.prank(attacker);
        quiz.answer(secret);

        assertEq(attacker.balance, 5 ether, "cualquiera con el texto plano cobra la recompensa");
        assertEq(quiz.reward(), 0);
    }

    function test_commitReveal_ataElRevealAlRemitente() public {
        CommitRevealQuiz quiz = new CommitRevealQuiz();
        string memory secret = "satoshi";
        bytes32 salt = keccak256("sal");
        bytes32 commitment = keccak256(abi.encode(bob, secret, salt));

        vm.prank(bob);
        quiz.commit(commitment);
        vm.prank(bob);
        assertTrue(quiz.reveal(secret, salt), "el dueno legitimo revela y coincide");

        // El atacante copia el mismo commitment, pero el reveal esta atado a msg.sender.
        vm.prank(attacker);
        quiz.commit(commitment);
        vm.prank(attacker);
        assertFalse(quiz.reveal(secret, salt), "copiar el commitment no sirve a otro remitente");
    }
}
