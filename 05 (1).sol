// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract CharityFundraiser {
    address private owner = msg.sender;
    uint[] public ids;
    struct Campaign {
        address payable creator;
        string description;
        uint goalAmount;
        uint deadline;
        uint balance;
        bool isGoalReached;
    }

    uint public numCampaigns;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public contributions;
    uint256 public feePercentage = 1; // 1% fee
    
    modifier only_owner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    event CampaignCreated(uint campaignId, address creator, uint goalAmount, uint deadline);
    event DonationReceived(uint campaignId, address donor, uint amount, uint fee);
    event GoalReached(uint campaignId);
    event FundsReturned(uint campaignId, address donor, uint amount);
    event FundsTransferred(uint campaignId, address recipient, uint amount);

    function createCampaign(string memory _description, uint _goalAmount, uint _durationDays) public {
        require(_durationDays > 0, "Duration must be greater than 0");
        require(_goalAmount > 0, "Goal must be greater than 0");
        
        uint deadline = block.timestamp + (_durationDays * 1 days);
        Campaign memory newCampaign = Campaign({
            creator: payable(msg.sender),
            description: _description,
            goalAmount: _goalAmount,
            deadline: deadline,
            balance: 0,
            isGoalReached: false
        });

        campaigns[numCampaigns] = newCampaign;
        emit CampaignCreated(numCampaigns, msg.sender, _goalAmount, deadline);
        numCampaigns++;
    }

    function donate(uint _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Donation must be greater than 0");

        uint256 fee = (msg.value * feePercentage) / 100;
        uint256 amountAfterFee = msg.value - fee;

        campaign.balance += amountAfterFee;
        contributions[_campaignId][msg.sender] += amountAfterFee;
        emit DonationReceived(_campaignId, msg.sender, amountAfterFee, fee);

        if (campaign.balance >= campaign.goalAmount) {
            campaign.isGoalReached = true;
            emit GoalReached(_campaignId);
        }
    }

    function withdrawFunds(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        if (campaign.isGoalReached == true) {
            require(msg.sender == campaign.creator, "Only campaign creator can withdraw funds");
        }
        else{
        require(msg.sender == campaign.creator, "Only campaign creator can withdraw funds");
        require(block.timestamp >= campaign.deadline, "Campaign has not ended yet");
        require(campaign.isGoalReached, "Goal not reached");
        }

        uint amount = campaign.balance;
        campaign.balance = 0;
        campaign.creator.transfer(amount);
        emit FundsTransferred(_campaignId, campaign.creator, amount);
    }

    function refundDonors(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign has not ended yet");
        require(!campaign.isGoalReached, "Goal has been reached, no refunds");

        uint256 donation = contributions[_campaignId][msg.sender];
        require(donation > 0, "No donation to refund");

        campaign.balance -= donation;
        contributions[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(donation);
        emit FundsReturned(_campaignId, msg.sender, donation);
    }

        function getCampaignInfo(uint _campaignId) public view returns (address, string memory, uint, uint, uint, bool) {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.description,
            campaign.goalAmount,
            campaign.deadline,
            campaign.balance,
            campaign.isGoalReached
        );
    }

    function getAllCampaignsDescriptions() public view returns (string[] memory) {
        string[] memory campaignsDescriptions = new string[](numCampaigns);

        for (uint i = 0; i < numCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            campaignsDescriptions[i] = string(abi.encodePacked(
                "ID: ", i,
                ", Description: ", campaign.description
            ));
        }

        return campaignsDescriptions;
    }

    receive() external payable {} // This function allows the contract to accept ETH
}