// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/// @title GameAsset — ERC-721 educativo mínimo para Andes Quest
/// @notice Solo para Anvil y pruebas locales. No está auditado ni destinado a producción.
contract GameAsset {
    string public constant name = "Andes Quest Assets";
    string public constant symbol = "AQA";

    address public immutable mintAuthority;
    uint256 public immutable maxSupply;
    uint256 public totalSupply;
    string public baseURI;

    mapping(uint256 tokenId => address owner) private _ownerOf;
    mapping(address owner => uint256 balance) public balanceOf;
    mapping(uint256 tokenId => address approved) public getApproved;
    mapping(address owner => mapping(address operator => bool approved)) public isApprovedForAll;

    error Unauthorized();
    error ZeroAddress();
    error TokenNotFound();
    error TokenAlreadyMinted();
    error SupplyCapExceeded();
    error WrongFrom();

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    constructor(address authority, uint256 supplyCap, string memory metadataBaseURI) {
        if (authority == address(0)) revert ZeroAddress();
        if (supplyCap == 0) revert SupplyCapExceeded();
        mintAuthority = authority;
        maxSupply = supplyCap;
        baseURI = metadataBaseURI;
    }

    function ownerOf(uint256 tokenId) public view returns (address owner) {
        owner = _ownerOf[tokenId];
        if (owner == address(0)) revert TokenNotFound();
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        ownerOf(tokenId);
        return string.concat(baseURI, _toString(tokenId), ".json");
    }

    function mint(address to, uint256 tokenId) external {
        if (msg.sender != mintAuthority) revert Unauthorized();
        if (to == address(0)) revert ZeroAddress();
        if (_ownerOf[tokenId] != address(0)) revert TokenAlreadyMinted();
        if (totalSupply == maxSupply) revert SupplyCapExceeded();

        totalSupply += 1;
        _ownerOf[tokenId] = to;
        balanceOf[to] += 1;
        emit Transfer(address(0), to, tokenId);
    }

    function approve(address approved, uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        if (msg.sender != owner && !isApprovedForAll[owner][msg.sender]) revert Unauthorized();
        getApproved[tokenId] = approved;
        emit Approval(owner, approved, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) external {
        if (operator == msg.sender) revert Unauthorized();
        isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) external {
        if (to == address(0)) revert ZeroAddress();
        address owner = ownerOf(tokenId);
        if (owner != from) revert WrongFrom();
        if (msg.sender != owner && msg.sender != getApproved[tokenId] && !isApprovedForAll[owner][msg.sender]) {
            revert Unauthorized();
        }

        delete getApproved[tokenId];
        _ownerOf[tokenId] = to;
        balanceOf[from] -= 1;
        balanceOf[to] += 1;
        emit Transfer(from, to, tokenId);
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) return "0";
        uint256 digits;
        uint256 remaining = value;
        while (remaining != 0) {
            digits += 1;
            remaining /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(buffer);
    }
}
