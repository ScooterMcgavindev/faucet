// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // storage variables
    uint256 public funds = 1000; // 1000 eth
    int256 public counter = -10;
    uint32 public test = 4294967295; //uint32 = 2**32
}