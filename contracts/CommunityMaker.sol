// pragma solidity ^0.8.0;

// import "./Community.sol";
// import "./Libra.sol";

// contract Communi3 {
//     mapping(address => address) private communitysCreated;

//     Libra public mainContract;

//     event communityCreated(address indexed community, address indexed admin);

//     constructor(address _mainContractAddress) {
//         mainContract = Libra(_mainContractAddress);
//     }

//     function createcommunity() external {
//         Community newCommunity = new Community(msg.sender);
//         communitysCreated[msg.sender] = address(newcommunity);

//         emit communityCreated(address(newcommunity), msg.sender);
//     }
//  }
