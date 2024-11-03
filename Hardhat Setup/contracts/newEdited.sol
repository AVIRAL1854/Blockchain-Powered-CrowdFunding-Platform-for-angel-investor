// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EditedVeryCrowdFunding is Ownable(msg.sender) {
    // constructor(address initialOwner) {

    // }

    struct Campaign {
        address owner;
        string title;
        string descrption;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        uint256 equityTokens;
        uint256 totalTokens;
        address equityAddress;
        bool CampaignClose;
        bool refunded;
    }

    mapping(uint256 => Campaign) public Campaigns;
    uint256 public numberOfCampaigns = 0;

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function createCampaigns(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        uint256 _equityTokens,
        address _equityAddress
    ) public returns (uint256) {
        Campaign storage campaign = Campaigns[numberOfCampaigns];

        // this is to test whether everything is ok or not
        // ISSUE here we have to convert the deadline into seconds according to 1 january 1970 then compare it
        require(
            campaign.deadline < block.timestamp,
            "the deadline should be date in future"
        );
        require(
            shareEquityTokens(_equityTokens, _equityAddress) == true,
            "the amount sent is either 0 or tokens address are wrong"
        );

        campaign.CampaignClose = false;
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.descrption = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        IERC20 token = IERC20(_equityAddress);
        campaign.totalTokens = token.balanceOf(address(campaign.equityAddress));
        campaign.equityTokens = _equityTokens;
        campaign.refunded = false;
        //convert this into decimal values or floating value
        campaign.equityAddress = _equityAddress;

        numberOfCampaigns++;
        return numberOfCampaigns - 1;
        // returns the latest index of the campaign created
    }

    function shareEquityTokens(uint256 _equityTokens, address _equityAddress)
        public
        payable
        returns (bool)
    {
        if (msg.value == 0) {
            return false;
        }
        // check the tokens address and the address of the stored address inside the database
        // this have to be implemented

        // here the transactions is done
        // Deposit function to accept any ERC20 token

        // function deposit(address token, uint256 amount) public {
        //     require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        //     // Track user balances
        //     userBalances[msg.sender][token] += amount;

        //     emit Deposit(msg.sender, token, amount);
        // }

        require(
            IERC20(_equityAddress).transferFrom(
                msg.sender,
                address(this),
                _equityTokens
            ),
            "Transfer failed"
        );

        // uint256 _equityTokens=msg.value;
        return true;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = Campaigns[_id];

        require(
            campaign.deadline >= block.timestamp,
            " the deadline of this is reached and you cannot donate to this "
        );
        require(
            campaign.CampaignClose == false,
            " the deadline of this is reached and you cannot donate to this "
        );
        // require( msg.value<=(campaign.target-campaign.amountCollected),"you are sending more money than target and you can send max limit of "+campaign.target-campaign.amountCollected );
        require(
            msg.value <= (campaign.target - campaign.amountCollected),
            string(
                abi.encodePacked(
                    "You are sending more money than target. Max allowed: ",
                    uint2str(campaign.target - campaign.amountCollected)
                )
            )
        );

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "payment failed");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;

            uint256 index = checkDonatorsList(msg.sender, _id);
            if (index == type(uint256).max) {
                campaign.donators.push(msg.sender);
                campaign.donations.push(amount);
            } else {
                campaign.donators[index] = msg.sender;
                campaign.donations[index] += amount;
            }
        }
    }

    function getDonators(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (Campaigns[_id].donators, Campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        // right side=> this will create the empty structs of the numberOfCampaigns size
        // Campaign[] is the array of the struct (Campaign)

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = Campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function withdrawEquityToken(uint256 _campaignId)
        public
        payable
        returns (string memory)
    {
        Campaign storage campaign = Campaigns[_campaignId];

        address senderAddress = msg.sender;
        uint256 index = checkDonatorsList(senderAddress, _campaignId);

        uint256 amountDonated = (campaign).donations[index];
        uint256 equityPercentage = amountDonated / campaign.target;
        IERC20 token = IERC20(campaign.equityAddress);
        uint256 tokenQuantity = campaign.totalTokens * (equityPercentage);

        require(
            token.balanceOf(address(campaign.equityAddress)) >= tokenQuantity,
            "insufficient Tokens"
        );

        // require(campaign.amountCollected==campaign.target,"no the minimum target is not reached");
        // bool success= token.transfer( senderAddress,tokenQuantity);
        // require(success, "Token transfer failed");

        require(
            campaign.amountCollected == campaign.target,
            "no the minimum target is not reached"
        );
        if (campaign.amountCollected == campaign.target) {
            bool success = (token).transfer(senderAddress, tokenQuantity);
            require(success, "Token transfer failed");
            // require(sent,"failed to send money");
            campaign.CampaignClose = true;
            return "amount sent successfully";
        } else if (
            campaign.deadline < block.timestamp &&
            campaign.amountCollected == campaign.target
        ) {
            bool success = (token).transfer(senderAddress, tokenQuantity);
            require(success, "Token transfer failed");
            campaign.CampaignClose = true;
            return "amount sent successfully";
        } else if (
            campaign.deadline < block.timestamp &&
            campaign.amountCollected < campaign.target
        ) {
            // refund amount process  to be implemented here
            campaign.CampaignClose = true;
            //    campaign.CampaignClose = true;
            if (campaign.refunded == true) {
                refundMoney(_campaignId);
                return
                    "minimum target  is not reached before deadline therefore you get your tokens back";
            } else {
                return " amount is already refunded check you profile";
            }
        } else if (
            campaign.deadline >= block.timestamp &&
            campaign.amountCollected < campaign.target
        ) {
            return "there is time to reach the deadline ";
        }
        return "failed";
    }

    function withdrawCollectMoney(uint256 _campaignId)
        public
        payable
        returns (string memory)
    {
        Campaign storage campaign = Campaigns[_campaignId];
        require(
            msg.sender == campaign.owner,
            " you are not the owner of the campaign or Select the wallet by which you have created the campaign"
        );

        require(
            campaign.amountCollected == campaign.target,
            "no the minimum target is not reached"
        );
        if (campaign.amountCollected == campaign.target) {
            (bool sent, ) = payable(campaign.owner).call{
                value: campaign.amountCollected
            }("");
            require(sent, "failed to send money");
            campaign.CampaignClose = true;
            return "amount sent successfully";
        } else if (
            campaign.deadline < block.timestamp &&
            campaign.amountCollected == campaign.target
        ) {
            (bool sent, ) = payable(campaign.owner).call{
                value: campaign.amountCollected
            }("");
            require(sent, "failed to send money");
            campaign.CampaignClose = true;
            return "amount sent successfully";
        } else if (
            campaign.deadline < block.timestamp &&
            campaign.amountCollected < campaign.target
        ) {
            // refund amount process  to be implemented here

            campaign.CampaignClose = true;
            if (campaign.refunded == true) {
                refundMoney(_campaignId);
                return
                    "minimum target  is not reached before deadline therefore you get your tokens back";
            } else {
                return " amount is already refunded check you profile";
            }
        } else if (
            campaign.deadline >= block.timestamp &&
            campaign.amountCollected < campaign.target
        ) {
            return "there is time to reach the deadline ";
        }

        return "there is some error";
    }

    function checkDonatorsList(address _investorAddress, uint256 _campaignId)
        public
        view
        returns (uint256)
    {
        Campaign storage campaign = Campaigns[_campaignId];

        for (uint256 i = 0; i < campaign.donators.length; i++) {
            if (campaign.donators[i] == _investorAddress) {
                return i;
            }
        }
        return type(uint256).max;
    }

    function refundMoney(uint256 _campaignId) public payable {
        Campaign storage campaign = Campaigns[_campaignId];
        address payable owner = payable(campaign.owner);
        require(campaign.CampaignClose == true, "campaign is not close yet");
        require(campaign.refunded == false, "campaign is already refunded ");
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            address payable donators = payable(campaign.donators[i]);
            (bool sent, ) = donators.call{value: campaign.donations[i]}("");
            require(sent, "refund back to investors failed");
        }

        require(
            IERC20(campaign.equityAddress).transfer(
                owner,
                campaign.totalTokens
            ),
            "Transfer failed"
        );
        campaign.refunded = true;
    }

    function forceWithdrawAmount(uint256 _campaignId, address ownerAddress)
        public
        payable
        onlyOwner
    {
        Campaign storage campaign = Campaigns[_campaignId];

        (bool sent, ) = ownerAddress.call{value: campaign.amountCollected}("");
        require(sent, "amount not withdrawed");
        require(
            IERC20(campaign.equityAddress).transfer(
                ownerAddress,
                campaign.totalTokens
            ),
            "Transfer failed"
        );
    }
}

// yet to implement:

// force equity and ethereum withdrawl onlyOwner
// refund internal function
// Deadline conversion and proper implementation
// backend authentication for token address before reaching the contract
