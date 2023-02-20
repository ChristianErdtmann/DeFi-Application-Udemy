pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Usdc.sol";

contract DigitalBank {
    string public name = "Digital Bank";
    address public owner;
    Usdc public usdc;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Usdc _usdc) public {
        rwd = _rwd;
        usdc = _usdc;
        owner = msg.sender;
    }

    //Staking Function
    function depositTokens(uint256 _amount) public {
        //Staking amount must be greater than zero
        require(_amount > 0, "cannot add 0 amount of tokens");

        //Transfer USDC to this contract for staking
        usdc.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //issue rewards
    function issueRewardTokens() public {
        require(msg.sender == owner, "caller must be the owner");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient] / 8;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "staking balance cannot be less than zero");

        //unstake tokens
        usdc.transfer(msg.sender, balance);

        //reset balance of staking
        stakingBalance[msg.sender] = 0;

        //update status of staking
        isStaking[msg.sender] = false;
    }
}
