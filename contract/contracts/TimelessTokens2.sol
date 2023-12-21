// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "hardhat/console.sol";

contract TimelessTokens2 is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ERC721EnumerableUpgradeable
{
    using Strings for uint256;
    mapping(string => uint8) existingURIs;
    mapping(uint256 => address) public holderOf;

    address public artist; // will get royalityFee everytime a new NFT is minted
    uint256 public royalityFeeRate;
    uint256 public supply;
    uint256 public totalTx;
    uint256 public mintFee;
    uint256 public executionFee;

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

    enum TransactionType {
        Buy,
        Mint
    }
    struct TransactionStruct {
        uint256 id;
        TransactionType transactionType;
        address from;
        address to;
        uint256 cost;
        uint256 timestamp;
    }

    TransactionStruct[] transactions;
    NFTStruct[] minted;
    NFTStruct[] toBeReviewedLists;

    function initialize(
        string memory _name,
        string memory _symbol,
        uint256 _royalityFeeRate,
        address _artist,
        address _initialOwner
    ) public initializer {
        __Ownable_init(_initialOwner);
        __UUPSUpgradeable_init();
        __ERC721_init(_name, _symbol);
        royalityFeeRate = _royalityFeeRate;
        artist = _artist;

        supply = 0;
        totalTx = 0;
        mintFee = 0.01 ether;
        executionFee = 0.001 ether;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function submitTobeReviewedList(
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 salesPrice
    ) external payable {
        require(
            msg.value >= executionFee + mintFee,
            "Ether too low for mint and execution!"
        );
        require(existingURIs[metadataURI] == 0, "This NFT is already minted!");

        toBeReviewedLists.push(
            NFTStruct(
                toBeReviewedLists.length, // It may not be accurate, but it's not a key parameter for it.
                msg.sender,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp
            )
        );
    }

    function removeMultipleReviewedListByindices(
        uint256[] memory indices,
        string[] memory metadataURI
    ) public {
        require(indices.length <= toBeReviewedLists.length, "Too many indices");

        for (uint i = indices.length; i > 0; i--) {
            console.log(indices[i - 1], metadataURI[i - 1]);
            removeReviewedListByIndex(indices[i - 1], metadataURI[i - 1]);
        }
    }

    function removeReviewedListByIndex(
        uint256 index,
        string memory metadataURI
    ) public {
        address submitOwner = toBeReviewedLists[index].owner;
        require(
            msg.sender == owner() || msg.sender == submitOwner,
            "Not allowed!"
        );
        _removeReviewedListByIndex(index, metadataURI);
        payTo(submitOwner, mintFee + executionFee);
    }

    function _removeReviewedListByIndex(
        uint256 index,
        string memory metadataURI
    ) internal {
        console.log(toBeReviewedLists[index].metadataURI, metadataURI);
        require(
            keccak256(abi.encodePacked(toBeReviewedLists[index].metadataURI)) ==
                keccak256(abi.encodePacked(metadataURI)),
            "Wrong URI"
        );
        require(index < toBeReviewedLists.length, "Index out of bounds");
        toBeReviewedLists[index] = toBeReviewedLists[
            toBeReviewedLists.length - 1
        ];
        toBeReviewedLists.pop();
    }

    function executeMintByOwner(
        uint256[] memory id,
        string[] memory metadataURI
    ) external onlyOwner {
        require(id.length <= toBeReviewedLists.length, "Index out of bounds");

        uint fees = id.length * mintFee;
        uint256 royaltyFees = (fees * royalityFeeRate) / 100;
        uint256 mintFees = fees - royaltyFees;
        uint256 executeFees = id.length * executionFee;

        require(
            address(this).balance >= royaltyFees + mintFees,
            "Not enough ETH to execute mint!"
        );

        for (uint i = id.length; i > 0; i--) {
            require(
                id[i - 1] < toBeReviewedLists.length,
                "Index out of bounds"
            );
            NFTStruct memory nftData = toBeReviewedLists[id[i - 1]];
            require(
                keccak256(abi.encodePacked(metadataURI[i - 1])) ==
                    keccak256(abi.encodePacked(nftData.metadataURI)),
                "Invalid metadataURI!"
            );

            _payToMint(
                nftData.owner,
                nftData.title,
                nftData.description,
                nftData.metadataURI,
                nftData.cost
            );
            _removeReviewedListByIndex(id[i - 1], metadataURI[i - 1]);
        }

        payTo(artist, royaltyFees);
        payTo(owner(), mintFees + executeFees);
    }

    function mintByOwner(
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 salesPrice
    ) external payable onlyOwner {
        require(msg.value >= mintFee, "Ether too low for minting!");

        uint256 royality = (msg.value * royalityFeeRate) / 100;
        payTo(artist, royality);
        payTo(owner(), (msg.value - royality));

        _payToMint(owner(), title, description, metadataURI, salesPrice);
    }

    function _payToMint(
        address owner,
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 salesPrice
    ) internal {
        require(existingURIs[metadataURI] == 0, "This NFT is already minted!");

        supply++;
        totalTx++;

        minted.push(
            NFTStruct(
                supply,
                owner,
                salesPrice,
                title,
                description,
                metadataURI,
                block.timestamp
            )
        );

        transactions.push(
            TransactionStruct(
                totalTx,
                TransactionType.Mint,
                address(0), // from
                owner, // to
                executionFee,
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

        // record transaction
        totalTx++;
        transactions.push(
            TransactionStruct(
                totalTx,
                TransactionType.Buy,
                mintedItem.owner, // from
                msg.sender, // to
                msg.value,
                block.timestamp // transaction time
            )
        );

        // change state
        address oldOwner = mintedItem.owner;
        mintedItem.owner = msg.sender;

        // transfer ether
        uint256 royality = (msg.value * royalityFeeRate) / 100;
        payTo(artist, royality);
        payTo(oldOwner, (msg.value - royality));

        emit Sale(
            totalTx,
            msg.sender,
            msg.value,
            mintedItem.metadataURI,
            block.timestamp
        );
    }

    function changePrice(uint256 id, uint256 newPrice) external returns (bool) {
        require(newPrice > 0 ether, "Ether too low!");
        require(msg.sender == minted[id - 1].owner, "Operation Not Allowed!");

        minted[id - 1].cost = newPrice;
        return true;
    }

    function withdrawEth(uint amount) external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        require(amount > 0, "Amount must be greater than 0");
        require(balance >= amount, "Not enough ETH to withdraw");

        uint256 bufferAmount = toBeReviewedLists.length *
            (mintFee + executionFee); // need to reserve a guarantee to execute mint or return it to the user

        require(
            amount <= balance - bufferAmount,
            "There will be insufficient funds to review the list of transactions."
        );

        payTo(owner(), amount);
    }

    function payTo(address to, uint256 amount) internal {
        // send eth from address(this) to address(to)
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    // ------------- Getter -------------

    function getAllNFTs() external view returns (NFTStruct[] memory) {
        return minted;
    }

    function getNFT(uint256 id) external view returns (NFTStruct memory) {
        return minted[id - 1];
    }

    function getAllToBeReviewLists()
        external
        view
        returns (NFTStruct[] memory)
    {
        return toBeReviewedLists;
    }

    function getAllTransactions()
        external
        view
        returns (TransactionStruct[] memory)
    {
        return transactions;
    }
}
