// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract SimpleGovernor {
    struct Proposal {
        address target;
        uint64 voteEnd;
        uint64 executableAt;
        uint128 forVotes;
        uint128 againstVotes;
        bool executed;
        bytes data;
    }

    uint256 public immutable votingPeriod;
    uint256 public immutable timelock;
    uint256 public immutable quorum;
    uint256 public proposalCount;
    mapping(address => uint256) public votingPower;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    error InvalidConfiguration();
    error NoVotingPower();
    error VotingClosed();
    error AlreadyVoted();
    error NotReady();
    error ProposalFailed();
    error ExecutionFailed();

    event Proposed(uint256 indexed id, address indexed proposer, address indexed target);
    event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event Executed(uint256 indexed id);

    constructor(
        address[] memory voters,
        uint256[] memory weights,
        uint256 requiredQuorum,
        uint256 period,
        uint256 delay
    ) {
        if (
            voters.length == 0 ||
            voters.length != weights.length ||
            requiredQuorum == 0 ||
            period == 0
        ) revert InvalidConfiguration();
        for (uint256 i; i < voters.length; ++i) {
            if (
                voters[i] == address(0) ||
                weights[i] == 0 ||
                weights[i] > type(uint128).max ||
                votingPower[voters[i]] != 0
            ) {
                revert InvalidConfiguration();
            }
            votingPower[voters[i]] = weights[i];
        }
        quorum = requiredQuorum;
        votingPeriod = period;
        timelock = delay;
    }

    function propose(address target, bytes calldata data) external returns (uint256 id) {
        if (votingPower[msg.sender] == 0) revert NoVotingPower();
        if (target == address(0)) revert InvalidConfiguration();
        id = ++proposalCount;
        uint64 voteEnd = uint64(block.timestamp + votingPeriod);
        proposals[id] = Proposal(target, voteEnd, uint64(voteEnd + timelock), 0, 0, false, data);
        emit Proposed(id, msg.sender, target);
    }

    function vote(uint256 id, bool support) external {
        Proposal storage proposal = proposals[id];
        uint256 weight = votingPower[msg.sender];
        if (weight == 0) revert NoVotingPower();
        if (block.timestamp >= proposal.voteEnd) revert VotingClosed();
        if (hasVoted[id][msg.sender]) revert AlreadyVoted();
        hasVoted[id][msg.sender] = true;
        if (support) proposal.forVotes += uint128(weight);
        else proposal.againstVotes += uint128(weight);
        emit Voted(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external {
        Proposal storage proposal = proposals[id];
        if (proposal.executed || block.timestamp < proposal.executableAt) revert NotReady();
        if (proposal.forVotes < quorum || proposal.forVotes <= proposal.againstVotes) {
            revert ProposalFailed();
        }
        proposal.executed = true;
        (bool success,) = proposal.target.call(proposal.data);
        if (!success) revert ExecutionFailed();
        emit Executed(id);
    }
}
