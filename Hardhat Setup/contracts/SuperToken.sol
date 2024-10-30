// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SuperToken is ERC20 {

// set the intial supply in constructor

constructor(uint256 initialSupply, string memory name, string memory symbol ,uint8 decimals_) ERC20(name,symbol){
    _mint(msg.sender, initialSupply*(10**decimals_));
}



// now we have to make a database call to store the amount of the shares/erc20 token that 
}