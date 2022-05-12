 //SPDX-License-Identifier: MIT
 pragma solidity ^0.8.4;

 import '@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol';



contract VerseToken is ERC20PresetMinterPauser {
    
    constructor(string memory _name,string memory _symbol,address ) ERC20PresetMinterPauser(_name,_symbol){
        
    }
}
