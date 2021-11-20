// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
        // truffle console
        // const instance = await Faucet.deployed()
        // instance.addFunds({from: accounts[0], value: "200000000"})
        //instance.addFunds({from: accounts[1], value: "200000000"})
        // instance.getFunderAtIndex(0)
        // instance.getAllFunders()

contract Faucet {
    uint public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;
    // private -> can be accesible only within the smart contract
    // internal -> can be accesible within smart contract and also derived smart contract
    receive() external payable {}
    
    function addFunds() external payable {
        // uint index = numOfFunders++;
        // funders[index] = msg.sender;
        address funder = msg.sender;
        // not in funders mapping, no key
        if (!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[numOfFunders] = funder;
        }
    }

    function withdraw(uint withdrawAmount) external {
        // check withdraw amount
        if(withdrawAmount < 1000000000000000000) {
            payable(msg.sender).transfer(withdrawAmount);
        }
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        // loop to iterate numOfFunders
        for (uint i = 0; i < numOfFunders; i++){
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }
    
    // function getAllFunders() public view returns(address[] memory) {
    //     return funders;
    // }

    // function to get funder at a specific index
    function getFunderAtIndex(uint8 index) external view returns(address) {
        // address[] memory _funders = getAllFunders();
        // return _funders[index];
        return lutFunders[index];
    } 
}
    // recieve function called when you make a transaction tx without a specified name
    // External function are part of the ccontract interface, i.e can be called via contracts and other tx
    // Block info
        // Nonce - a hash that when combined with the minHash proofs that
        // the block has gone through proof of work(POW)
        // 8 bytes => 64 bits

        

    // view - function will not alter the storage state
    // pure - wont even read the storage state

    // Transactions(generate state changes) and require gas fee
    // read only call, no gas fee
    
    // JSON-RPC http calls to talk to node on the network 
    
    
