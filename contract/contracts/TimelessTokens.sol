// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimelessTokens is ERC721Enumerable, Ownable {
    using Strings for uint256;
    mapping(string => uint8) existingURIs;
    mapping(uint256 => address) public holderOf;

    address public artist;
    uint256 public royalityFee;
    uint256 public supply = 0;
    uint256 public totalTx = 0;
    uint256 public cost = 0.001 ether;

    event Sale(
        uint256 id,
        address indexed owner,
        uint256 cost,
        string metadataURI,
        uint256 timestamp
    );

    struct NFTStruct {
        uint256 id;
        address owner;
        uint256 cost;
        string title;
        string description;
        string metadataURI;
        uint256 timestamp;
    }

    struct TransactionStruct {
        uint256 id;
        address from;
        address to;
        uint256 cost;
        string title;
        string metadataURI;
        uint256 timestamp;
    }

    TransactionStruct[] transactions;
    NFTStruct[] minted;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _royalityFee,
        address _artist,
        address _initialOwner
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        royalityFee = _royalityFee;
        artist = _artist;
    }

    function payToMint(
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 salesPrice
    ) external payable {
        require(msg.value >= cost, "Ether too low for minting!");
        require(existingURIs[metadataURI] == 0, "This NFT is already minted!");

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(artist, royality);
        payTo(owner(), (msg.value - royality));

        supply++;

        minted.push(
            NFTStruct(
                supply,
                msg.sender,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp
            )
        );

        emit Sale(supply, msg.sender, msg.value, metadataURI, block.timestamp);

        _safeMint(msg.sender, supply);
        existingURIs[metadataURI] = 1;
        holderOf[supply] = msg.sender;
    }

    function payToBuy(uint256 id) external payable {
        NFTStruct storage mintedItem = minted[id - 1];
        require(msg.value >= mintedItem.cost, "Ether too low for purchase!");
        require(msg.sender != mintedItem.owner, "Operation Not Allowed!");

        uint256 royality = (msg.value * royalityFee) / 100;
        payTo(artist, royality);
        payTo(mintedItem.owner, (msg.value - royality));

        totalTx++;

        transactions.push(
            TransactionStruct(
                totalTx,
                mintedItem.owner, // from
                msg.sender, // to
                msg.value,
                mintedItem.title,
                mintedItem.metadataURI,
                block.timestamp // transaction time
            )
        );

        emit Sale(
            totalTx,
            msg.sender,
            msg.value,
            mintedItem.metadataURI,
            block.timestamp
        );

        mintedItem.owner = msg.sender;
    }

    function changePrice(uint256 id, uint256 newPrice) external returns (bool) {
        require(newPrice > 0 ether, "Ether too low!");
        require(msg.sender == minted[id - 1].owner, "Operation Not Allowed!");

        minted[id - 1].cost = newPrice;
        return true;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getAllNFTs() external view returns (NFTStruct[] memory) {
        return minted;
    }

    function getNFT(uint256 id) external view returns (NFTStruct memory) {
        return minted[id - 1];
    }

    function getAllTransactions()
        external
        view
        returns (TransactionStruct[] memory)
    {
        return transactions;
    }
}
