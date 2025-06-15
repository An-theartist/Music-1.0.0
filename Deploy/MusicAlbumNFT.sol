// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicCIDNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    string public baseURI = "https://gateway.pinata.cloud/ipfs/";
    receive() external payable {}
    fallback() external payable {}


    constructor(address initialOwner)
        ERC721("MusicCIDNFT", "MUSIC")
        Ownable(initialOwner)
    {
        tokenCounter = 0;
    }

    function mintCID(address recipient, string memory cid)
        public
        onlyOwner
        returns (uint256)
    {
        string memory fullURI = string(abi.encodePacked(baseURI, cid));
        uint256 newItemId = tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, fullURI);
        tokenCounter++;
        return newItemId;
    }

    function mintBatchCID(address recipient, string[] memory cids)
        public
        onlyOwner
        returns (uint256[] memory)
    {
        uint256[] memory mintedIds = new uint256[](cids.length);

        for (uint256 i = 0; i < cids.length; i++) {
            string memory fullURI = string(abi.encodePacked(baseURI, cids[i]));
            uint256 newItemId = tokenCounter;
            _safeMint(recipient, newItemId);
            _setTokenURI(newItemId, fullURI);
            mintedIds[i] = newItemId;
            tokenCounter++;
        }

        return mintedIds;
    }

    function totalMinted() public view returns (uint256) {
        return tokenCounter;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }
}
