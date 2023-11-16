// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourToken is ERC20Capped {
    address  public owner;
    struct Project {
        address creator;
        uint256 goalAmount;
        uint256 raisedAmount;
        uint256 requiredVotes;
        uint256 currentVotes;
        bool funded;
        bool verified;
        uint256 deadline;
        mapping(address => uint256) contributions;
        mapping(address => bool) voters;
    }
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }



    Project[] public projects;
      constructor()
        ERC20("YourToken", "YT")
        ERC20Capped(1000000000000000000000000)
    {
        // //1,000,000 YT tokens with 18 decimal places (1e18)
        // '//_mint(msg.sender, 100000 * 1e18);
      owner = msg.sender;
    }


   

    function createProject(uint256 _goalAmount, uint256 _durationInDays)payable external {
           require(
            balanceOf(msg.sender) >= 50* 1e18,
            "Insufficient tokens to create"
        );
         _transfer(msg.sender,address(this),50* 1e18);
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);
        Project storage newProject = projects.push();
        newProject.creator = msg.sender;
        newProject.goalAmount = _goalAmount*1e18;
        newProject.raisedAmount = 0;
        newProject.funded = false;
        newProject.verified = false;
        newProject.currentVotes = 0;
        newProject.requiredVotes = 2;
        newProject.deadline = deadline;
    }

    function contribute(uint256 _projectId, uint256 _amount) payable external {
        Project storage project = projects[_projectId];
        require(!project.funded, "Project already funded");
        require(_amount > 0, "Contribution amount must be greater than 0");
        require(block.timestamp <= project.deadline, "Project deadline has passed");

        // Transfer tokens from the sender to the contract
        //require(transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        require(balanceOf(msg.sender)>=_amount,"Insufficient balance");
        _transfer(msg.sender,project.creator,_amount*1e18);
        // Update project data
        project.contributions[msg.sender] += _amount;
        project.raisedAmount += _amount*1e18;

        if (!project.funded && project.verified && project.currentVotes >= project.requiredVotes && project.raisedAmount >= project.goalAmount) {
            project.funded = true;
        }
    }

    function voteForProject(uint256 _projectId) payable external {
    
        Project storage project = projects[_projectId];
         require(
            balanceOf(msg.sender) >= 50* 1e18,
            "Insufficient tokens to create"
        );
            require(!project.voters[msg.sender], "You have already voted for this project");
        require(block.timestamp <= project.deadline, "Project deadline has passed");
         _transfer(msg.sender,address(this),50* 1e18);
     

        project.voters[msg.sender] = true;
        project.currentVotes++;

        if (!project.funded && project.currentVotes >= project.requiredVotes) {
            project.verified = true;
        }
    }

    function releaseFunds(uint256 _projectId) external onlyOwner() {
        Project storage project = projects[_projectId];
        require(project.funded, "Project not funded");
        require(block.timestamp <= project.deadline, "Project deadline has passed");

        transfer(project.creator, project.raisedAmount);
    }

    function getProjectsCount() external view returns (uint256) {
        return projects.length;
    }

  function getProjectDetails(uint256 _projectId)
    external
    view
    returns (
        address,
        uint256,
        uint256,
        uint256,
        uint256,
        bool,
        bool,
        uint256
    )
{
    Project storage project = projects[_projectId];
    uint256 daysRemaining = 0;

    if (block.timestamp < project.deadline) {
        daysRemaining = (project.deadline - block.timestamp) / 1 days + 1;
    }

    return (
        project.creator,
        project.goalAmount,
        project.raisedAmount,
        project.requiredVotes,
        project.currentVotes,
        project.funded,
        project.verified,
        daysRemaining
    );
}

      function receiveTokens() public payable {
        require(
            msg.value >= 0.00000001 ether,
            "Send exactly 0.01 ETH to receive tokens"
        );
        uint256 tokensToMint = 500 * 1e18; // 500 tokens with 18 decimal places
        require(totalSupply() + tokensToMint <= cap(), "Token cap exceeded");
        _mint(msg.sender, tokensToMint);
    }
    function withdrawEther() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    function getBalance() external view returns (uint256){
          return balanceOf(msg.sender);
    }
}
