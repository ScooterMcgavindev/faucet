pragma solidity >=0.4.22 <0.9.0;
// interface 
// restrictions:
// - They cannot inherit from other smart contracts
// - They can only inherit from other interfaces

// - They cannot declare a constructor 
// - They cannot declare state variables
// - all declared functions have to be external 
interface IFaucet {

  function addFunds() external payable;
  function withdraw(uint withdrawAmount) external;
}