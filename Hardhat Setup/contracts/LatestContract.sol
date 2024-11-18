<<<<<<< HEAD
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OptimizedCrowdFunding is ReentrancyGuard, Ownable {
    error DeadlinePassed();
    error InvalidTarget();
    error InvalidTokens();
    error CampaignNotActive();  // Renamed from CampaignClosed
    error InsufficientTokens();
    error TransferFailed();
    error TargetNotReached();
    error UnauthorizedWithdrawal();
    error RefundAlreadyProcessed();
    error InvalidDonationAmount();

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        uint256 equityTokens;
        uint256 totalTokens;
        address equityAddress;
        bool isClosed;
        bool isRefunded;
        mapping(address => bool) hasClaimedTokens;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 target,
        uint256 deadline
    );
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event TokensDistributed(
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount
    );
    event RefundProcessed(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event CampaignStatusChanged(
        uint256 indexed campaignId,
        bool isClosed
    );

    constructor() Ownable(msg.sender) {}

    function createCampaign(
        string calldata _title,
        string calldata _description,
        uint256 _target,
        uint256 _deadline,
        string calldata _image,
        uint256 _equityTokens,
        address _equityAddress
    ) external returns (uint256) {
        if (_deadline <= block.timestamp) revert DeadlinePassed();
        if (_target == 0) revert InvalidTarget();
        if (_equityTokens == 0 || _equityAddress == address(0)) revert InvalidTokens();

        uint256 campaignId = campaignCount++;
        Campaign storage campaign = campaigns[campaignId];

        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.equityTokens = _equityTokens;
        campaign.equityAddress = _equityAddress;

        IERC20 token = IERC20(_equityAddress);
        require(
            token.transferFrom(msg.sender, address(this), _equityTokens),
            "Token transfer failed"
        );
        campaign.totalTokens = _equityTokens;

        emit CampaignCreated(campaignId, msg.sender, _target, _deadline);
        return campaignId;
    }

    function donateToCampaign(uint256 _campaignId) 
        external 
        payable 
        nonReentrant 
    {
        Campaign storage campaign = campaigns[_campaignId];

        if (campaign.isClosed) revert CampaignNotActive();
        if (block.timestamp > campaign.deadline) revert DeadlinePassed();
        if (msg.value == 0) revert InvalidDonationAmount();
        
        uint256 remainingTarget = campaign.target - campaign.amountCollected;
        uint256 donationAmount = msg.value > remainingTarget ? remainingTarget : msg.value;
        
        if (msg.value > remainingTarget) {
            // Refund excess amount
            (bool refundSuccess,) = payable(msg.sender).call{value: msg.value - donationAmount}("");
            require(refundSuccess, "Refund failed");
        }

        campaign.amountCollected += donationAmount;
        
        uint256 donatorIndex = getDonatorIndex(campaign.donators, msg.sender);
        if (donatorIndex == type(uint256).max) {
            campaign.donators.push(msg.sender);
            campaign.donations.push(donationAmount);
        } else {
            campaign.donations[donatorIndex] += donationAmount;
        }

        emit DonationReceived(_campaignId, msg.sender, donationAmount);

        if (campaign.amountCollected == campaign.target) {
            campaign.isClosed = true;
            emit CampaignStatusChanged(_campaignId, true);
        }
    }

    function claimEquityTokens(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.hasClaimedTokens[msg.sender]) revert UnauthorizedWithdrawal();
        if (campaign.amountCollected < campaign.target && block.timestamp <= campaign.deadline) {
            revert TargetNotReached();
        }

        uint256 donatorIndex = getDonatorIndex(campaign.donators, msg.sender);
        if (donatorIndex == type(uint256).max) revert UnauthorizedWithdrawal();

        uint256 donationAmount = campaign.donations[donatorIndex];
        uint256 tokenShare = (donationAmount * campaign.totalTokens) / campaign.target;

        campaign.hasClaimedTokens[msg.sender] = true;

        IERC20 token = IERC20(campaign.equityAddress);
        require(token.transfer(msg.sender, tokenShare), "Token transfer failed");

        emit TokensDistributed(_campaignId, msg.sender, tokenShare);
    }

    function claimRefund(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.amountCollected >= campaign.target) revert UnauthorizedWithdrawal();
        if (block.timestamp <= campaign.deadline) revert DeadlinePassed();
        if (campaign.hasClaimedTokens[msg.sender]) revert RefundAlreadyProcessed();

        uint256 donatorIndex = getDonatorIndex(campaign.donators, msg.sender);
        if (donatorIndex == type(uint256).max) revert UnauthorizedWithdrawal();

        uint256 refundAmount = campaign.donations[donatorIndex];
        campaign.hasClaimedTokens[msg.sender] = true;

        (bool success,) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundProcessed(_campaignId, msg.sender, refundAmount);
    }

    function emergencyWithdraw(uint256 _campaignId) external onlyOwner nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (!campaign.isClosed && block.timestamp <= campaign.deadline) {
            revert UnauthorizedWithdrawal();
        }

        uint256 contractBalance = address(this).balance;
        if (contractBalance > 0) {
            (bool success,) = payable(campaign.owner).call{value: contractBalance}("");
            require(success, "Transfer failed");
        }

        IERC20 token = IERC20(campaign.equityAddress);
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance > 0) {
            require(token.transfer(campaign.owner, tokenBalance), "Token transfer failed");
        }

        campaign.isClosed = true;
        emit CampaignStatusChanged(_campaignId, true);
    }

    function getCampaignDetails(uint256 _campaignId)
        external
        view
        returns (
            address owner,
            string memory title,
            string memory description,
            uint256 target,
            uint256 deadline,
            uint256 amountCollected,
            string memory image,
            address[] memory donators,
            uint256[] memory donations,
            bool isClosed
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.deadline,
            campaign.amountCollected,
            campaign.image,
            campaign.donators,
            campaign.donations,
            campaign.isClosed
        );
    }

    function getDonatorIndex(address[] storage donators, address donor)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < donators.length; i++) {
            if (donators[i] == donor) {
                return i;
            }
        }
        return type(uint256).max;
    }

    function getAllCampaigns() 
        external 
        view 
        returns (
            address[] memory owners,
            string[] memory titles,
            string[] memory descriptions,
            uint256[] memory targets,
            uint256[] memory deadlines,
            uint256[] memory amountsCollected,
            string[] memory images,
            bool[] memory isClosedArray
        ) 
    {
        owners = new address[](campaignCount);
        titles = new string[](campaignCount);
        descriptions = new string[](campaignCount);
        targets = new uint256[](campaignCount);
        deadlines = new uint256[](campaignCount);
        amountsCollected = new uint256[](campaignCount);
        images = new string[](campaignCount);
        isClosedArray = new bool[](campaignCount);

        for (uint256 i = 0; i < campaignCount; i++) {
            Campaign storage campaign = campaigns[i];
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            targets[i] = campaign.target;
            deadlines[i] = campaign.deadline;
            amountsCollected[i] = campaign.amountCollected;
            images[i] = campaign.image;
            isClosedArray[i] = campaign.isClosed;
        }

        return (
            owners,
            titles,
            descriptions,
            targets,
            deadlines,
            amountsCollected,
            images,
            isClosedArray
        );
    }

    // New function to get campaign donators and their donations
    function getCampaignDonators(uint256 _campaignId)
        external
        view
        returns (
            address[] memory donators,
            uint256[] memory donations,
            uint256 totalDonators,
            uint256 totalDonations
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        donators = campaign.donators;
        donations = campaign.donations;
        totalDonators = campaign.donators.length;
        totalDonations = campaign.amountCollected;

        return (donators, donations, totalDonators, totalDonations);
    }

    // Optional helper function to get campaigns by status (active/closed)
    function getCampaignsByStatus(bool _isClosed) 
        external 
        view 
        returns (uint256[] memory campaignIds) 
    {
        // First, count matching campaigns
        uint256 count = 0;
        for (uint256 i = 0; i < campaignCount; i++) {
            if (campaigns[i].isClosed == _isClosed) {
                count++;
            }
        }

        // Create array with exact size needed
        campaignIds = new uint256[](count);
        uint256 currentIndex = 0;

        // Fill array with matching campaign IDs
        for (uint256 i = 0; i < campaignCount; i++) {
            if (campaigns[i].isClosed == _isClosed) {
                campaignIds[currentIndex] = i;
                currentIndex++;
            }
        }

        return campaignIds;
    }


    receive() external payable {}
    fallback() external payable {}
=======
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OptimizedCrowdFunding is ReentrancyGuard, Ownable {
    error DeadlinePassed();
    error InvalidTarget();
    error InvalidTokens();
    error CampaignNotActive();  // Renamed from CampaignClosed
    error InsufficientTokens();
    error TransferFailed();
    error TargetNotReached();
    error UnauthorizedWithdrawal();
    error RefundAlreadyProcessed();
    error InvalidDonationAmount();

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        uint256 equityTokens;
        uint256 totalTokens;
        address equityAddress;
        bool isClosed;
        bool isRefunded;
        mapping(address => bool) hasClaimedTokens;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 target,
        uint256 deadline
    );
    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event TokensDistributed(
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount
    );
    event RefundProcessed(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );
    event CampaignStatusChanged(
        uint256 indexed campaignId,
        bool isClosed
    );

    constructor() Ownable(msg.sender) {}

    function createCampaign(
        string calldata _title,
        string calldata _description,
        uint256 _target,
        uint256 _deadline,
        string calldata _image,
        uint256 _equityTokens,
        address _equityAddress
    ) external returns (uint256) {
        if (_deadline <= block.timestamp) revert DeadlinePassed();
        if (_target == 0) revert InvalidTarget();
        if (_equityTokens == 0 || _equityAddress == address(0)) revert InvalidTokens();

        uint256 campaignId = campaignCount++;
        Campaign storage campaign = campaigns[campaignId];

        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.equityTokens = _equityTokens;
        campaign.equityAddress = _equityAddress;

        IERC20 token = IERC20(_equityAddress);
        require(
            token.transferFrom(msg.sender, address(this), _equityTokens),
            "Token transfer failed"
        );
        campaign.totalTokens = _equityTokens;

        emit CampaignCreated(campaignId, msg.sender, _target, _deadline);
        return campaignId;
    }

    function donateToCampaign(uint256 _campaignId) 
        external 
        payable 
        nonReentrant 
    {
        Campaign storage campaign = campaigns[_campaignId];

        if (campaign.isClosed) revert CampaignNotActive();
        if (block.timestamp > campaign.deadline) revert DeadlinePassed();
        if (msg.value == 0) revert InvalidDonationAmount();
        
        uint256 remainingTarget = campaign.target - campaign.amountCollected;
        uint256 donationAmount = msg.value > remainingTarget ? remainingTarget : msg.value;
        
        if (msg.value > remainingTarget) {
            // Refund excess amount
            (bool refundSuccess,) = payable(msg.sender).call{value: msg.value - donationAmount}("");
            require(refundSuccess, "Refund failed");
        }

        campaign.amountCollected += donationAmount;
        
        uint256 donatorIndex = getDonatorIndex(campaign.donators, msg.sender);
        if (donatorIndex == type(uint256).max) {
            campaign.donators.push(msg.sender);
            campaign.donations.push(donationAmount);
        } else {
            campaign.donations[donatorIndex] += donationAmount;
        }

        emit DonationReceived(_campaignId, msg.sender, donationAmount);

        if (campaign.amountCollected == campaign.target) {
            campaign.isClosed = true;
            emit CampaignStatusChanged(_campaignId, true);
        }
    }

    function claimEquityTokens(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.hasClaimedTokens[msg.sender]) revert UnauthorizedWithdrawal();
        if (campaign.amountCollected < campaign.target && block.timestamp <= campaign.deadline) {
            revert TargetNotReached();
        }

        uint256 donatorIndex = getDonatorIndex(campaign.donators, msg.sender);
        if (donatorIndex == type(uint256).max) revert UnauthorizedWithdrawal();

        uint256 donationAmount = campaign.donations[donatorIndex];
        uint256 tokenShare = (donationAmount * campaign.totalTokens) / campaign.target;

        campaign.hasClaimedTokens[msg.sender] = true;

        IERC20 token = IERC20(campaign.equityAddress);
        require(token.transfer(msg.sender, tokenShare), "Token transfer failed");

        emit TokensDistributed(_campaignId, msg.sender, tokenShare);
    }

    function claimRefund(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.amountCollected >= campaign.target) revert UnauthorizedWithdrawal();
        if (block.timestamp <= campaign.deadline) revert DeadlinePassed();
        if (campaign.hasClaimedTokens[msg.sender]) revert RefundAlreadyProcessed();

        uint256 donatorIndex = getDonatorIndex(campaign.donators, msg.sender);
        if (donatorIndex == type(uint256).max) revert UnauthorizedWithdrawal();

        uint256 refundAmount = campaign.donations[donatorIndex];
        campaign.hasClaimedTokens[msg.sender] = true;

        (bool success,) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundProcessed(_campaignId, msg.sender, refundAmount);
    }

    function emergencyWithdraw(uint256 _campaignId) external onlyOwner nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (!campaign.isClosed && block.timestamp <= campaign.deadline) {
            revert UnauthorizedWithdrawal();
        }

        uint256 contractBalance = address(this).balance;
        if (contractBalance > 0) {
            (bool success,) = payable(campaign.owner).call{value: contractBalance}("");
            require(success, "Transfer failed");
        }

        IERC20 token = IERC20(campaign.equityAddress);
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance > 0) {
            require(token.transfer(campaign.owner, tokenBalance), "Token transfer failed");
        }

        campaign.isClosed = true;
        emit CampaignStatusChanged(_campaignId, true);
    }

    function getCampaignDetails(uint256 _campaignId)
        external
        view
        returns (
            address owner,
            string memory title,
            string memory description,
            uint256 target,
            uint256 deadline,
            uint256 amountCollected,
            string memory image,
            address[] memory donators,
            uint256[] memory donations,
            bool isClosed
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.deadline,
            campaign.amountCollected,
            campaign.image,
            campaign.donators,
            campaign.donations,
            campaign.isClosed
        );
    }

    function getDonatorIndex(address[] storage donators, address donor)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < donators.length; i++) {
            if (donators[i] == donor) {
                return i;
            }
        }
        return type(uint256).max;
    }

    function getAllCampaigns() 
        external 
        view 
        returns (
            address[] memory owners,
            string[] memory titles,
            string[] memory descriptions,
            uint256[] memory targets,
            uint256[] memory deadlines,
            uint256[] memory amountsCollected,
            string[] memory images,
            bool[] memory isClosedArray
        ) 
    {
        owners = new address[](campaignCount);
        titles = new string[](campaignCount);
        descriptions = new string[](campaignCount);
        targets = new uint256[](campaignCount);
        deadlines = new uint256[](campaignCount);
        amountsCollected = new uint256[](campaignCount);
        images = new string[](campaignCount);
        isClosedArray = new bool[](campaignCount);

        for (uint256 i = 0; i < campaignCount; i++) {
            Campaign storage campaign = campaigns[i];
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            targets[i] = campaign.target;
            deadlines[i] = campaign.deadline;
            amountsCollected[i] = campaign.amountCollected;
            images[i] = campaign.image;
            isClosedArray[i] = campaign.isClosed;
        }

        return (
            owners,
            titles,
            descriptions,
            targets,
            deadlines,
            amountsCollected,
            images,
            isClosedArray
        );
    }

    // New function to get campaign donators and their donations
    function getCampaignDonators(uint256 _campaignId)
        external
        view
        returns (
            address[] memory donators,
            uint256[] memory donations,
            uint256 totalDonators,
            uint256 totalDonations
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        donators = campaign.donators;
        donations = campaign.donations;
        totalDonators = campaign.donators.length;
        totalDonations = campaign.amountCollected;

        return (donators, donations, totalDonators, totalDonations);
    }

    // Optional helper function to get campaigns by status (active/closed)
    function getCampaignsByStatus(bool _isClosed) 
        external 
        view 
        returns (uint256[] memory campaignIds) 
    {
        // First, count matching campaigns
        uint256 count = 0;
        for (uint256 i = 0; i < campaignCount; i++) {
            if (campaigns[i].isClosed == _isClosed) {
                count++;
            }
        }

        // Create array with exact size needed
        campaignIds = new uint256[](count);
        uint256 currentIndex = 0;

        // Fill array with matching campaign IDs
        for (uint256 i = 0; i < campaignCount; i++) {
            if (campaigns[i].isClosed == _isClosed) {
                campaignIds[currentIndex] = i;
                currentIndex++;
            }
        }

        return campaignIds;
    }


    receive() external payable {}
    fallback() external payable {}
>>>>>>> 0719ad64544f7d5ed7d1f3d63b12c1e662e54ce6
}