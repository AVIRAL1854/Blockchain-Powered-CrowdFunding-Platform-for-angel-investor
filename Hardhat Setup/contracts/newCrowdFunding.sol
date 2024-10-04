// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract NewCrowdFunding {
    struct Campaign{
        address owner;
        string title;
        string descrption;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256=> Campaign) public Campaigns;
    uint256 public numberOfCampaigns=0;

    function createCampaigns(address _owner ,string memory _title, string memory _description ,uint256 _target, uint _deadline, string memory _image)public returns(uint256){

        Campaign storage campaign =Campaigns[numberOfCampaigns];

        // this is to test whether everything is ok or not
        require(campaign.deadline < block.timestamp, "the deadline should be date in future");
        campaign.owner=_owner;
        campaign.title=_title;
        campaign.descrption=_description;
        campaign.target=_target;
        campaign.deadline=_deadline;  
        campaign.amountCollected=0;
        campaign.image=_image;


        numberOfCampaigns++;
        return numberOfCampaigns-1;  
        // returns the latest index of the campaign created
        
    }

    function donateToCampaign(uint256 _id)public payable{
        uint256 amount=msg.value;

        Campaign storage campaign= Campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,)=payable(campaign.owner).call{value:amount}("");

        if(sent){
            campaign.amountCollected =campaign.amountCollected+amount;
        }

    }

    function getDonators(uint256 _id) view public returns (address[] memory , uint256[] memory){
           
            return (Campaigns[_id].donators, Campaigns[_id].donations);
    }
   function getCampaigns() public view returns(Campaign[] memory) {
    Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

    for(uint256 i = 0; i < numberOfCampaigns; i++) {
        Campaign storage item = Campaigns[i];
        allCampaigns[i] = Campaign({
            owner: item.owner,
            title: item.title,
            descrption: item.descrption,
            target: item.target,
            deadline: item.deadline,
            amountCollected: item.amountCollected,
            image: item.image,
            donators: item.donators,
            donations: item.donations
        });
    }

    return allCampaigns;
}
}