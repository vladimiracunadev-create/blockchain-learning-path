// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract CommunityFunding {
    struct Campaign {
        address payable creator;
        uint64 deadline;
        uint128 goal;
        uint128 pledged;
        bool claimed;
    }

    uint256 public campaignCount;
    bool private entered;
    mapping(uint256 id => Campaign) public campaigns;
    mapping(uint256 id => mapping(address contributor => uint256 amount)) public contributions;

    error InvalidGoal();
    error InvalidDeadline();
    error UnknownCampaign();
    error CampaignEnded();
    error CampaignActive();
    error GoalNotReached();
    error GoalReached();
    error ContributionTooLarge();
    error NotCreator();
    error AlreadyClaimed();
    error NothingToRefund();
    error TransferFailed();
    error Reentrancy();

    event CampaignCreated(uint256 indexed id, address indexed creator, uint256 goal, uint256 deadline);
    event Contributed(uint256 indexed id, address indexed contributor, uint256 amount);
    event Claimed(uint256 indexed id, uint256 amount);
    event Refunded(uint256 indexed id, address indexed contributor, uint256 amount);

    modifier nonReentrant() {
        if (entered) revert Reentrancy();
        entered = true;
        _;
        entered = false;
    }

    function createCampaign(uint128 goal, uint64 deadline) external returns (uint256 id) {
        if (goal == 0) revert InvalidGoal();
        if (deadline <= block.timestamp) revert InvalidDeadline();
        id = ++campaignCount;
        campaigns[id] = Campaign(payable(msg.sender), deadline, goal, 0, false);
        emit CampaignCreated(id, msg.sender, goal, deadline);
    }

    function contribute(uint256 id) external payable {
        Campaign storage campaign = _campaign(id);
        if (block.timestamp >= campaign.deadline) revert CampaignEnded();
        if (msg.value == 0) revert InvalidGoal();
        if (msg.value > type(uint128).max) revert ContributionTooLarge();
        campaign.pledged += uint128(msg.value);
        contributions[id][msg.sender] += msg.value;
        emit Contributed(id, msg.sender, msg.value);
    }

    function claim(uint256 id) external nonReentrant {
        Campaign storage campaign = _campaign(id);
        if (msg.sender != campaign.creator) revert NotCreator();
        if (block.timestamp < campaign.deadline) revert CampaignActive();
        if (campaign.pledged < campaign.goal) revert GoalNotReached();
        if (campaign.claimed) revert AlreadyClaimed();
        campaign.claimed = true;
        uint256 amount = campaign.pledged;
        (bool success,) = campaign.creator.call{value: amount}("");
        if (!success) revert TransferFailed();
        emit Claimed(id, amount);
    }

    function refund(uint256 id) external nonReentrant {
        Campaign storage campaign = _campaign(id);
        if (block.timestamp < campaign.deadline) revert CampaignActive();
        if (campaign.pledged >= campaign.goal) revert GoalReached();
        uint256 amount = contributions[id][msg.sender];
        if (amount == 0) revert NothingToRefund();
        contributions[id][msg.sender] = 0;
        (bool success,) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        emit Refunded(id, msg.sender, amount);
    }

    function _campaign(uint256 id) private view returns (Campaign storage campaign) {
        campaign = campaigns[id];
        if (campaign.creator == address(0)) revert UnknownCampaign();
    }
}
