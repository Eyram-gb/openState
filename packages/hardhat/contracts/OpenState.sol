// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OpenState {
	struct Product {
		string name;
		uint256 productionDate;
		uint256 expiryDate;
		bytes32 productHash;
		string notes;
	}

	mapping(bytes32 => Product) private products;
	address public owner;
	mapping(address => bool) private moderators;
	string public manufacturer; // Store the manufacturer's name

	event ProductRegistered(Product product);
	event ProductNotesUpdated(bytes32 productHash, string notes);
	event ModeratorUpdated(address moderator, bool state);
	event ManufacturerUpdated(string newManufacturer);

	constructor(string memory _manufacturer) {
		owner = msg.sender; // The deployer of the contract is the initial owner
		manufacturer = _manufacturer; // Set the manufacturer's name during contract deployment
	}

	modifier onlyOwner() {
		require(msg.sender == owner, "Caller is not the owner");
		_;
	}

	modifier onlyOwnerOrModerator() {
		require(
			msg.sender == owner || moderators[msg.sender] == true,
			"Caller is not authorized"
		);
		_;
	}

	function updateModerator(address _moderator, bool _state) public onlyOwner {
		moderators[_moderator] = _state;
		emit ModeratorUpdated(_moderator, _state);
	}

	// Update the manufacturer's name (onlyOwner)
	function updateManufacturer(
		string memory _newManufacturer
	) public onlyOwner {
		manufacturer = _newManufacturer;
		emit ManufacturerUpdated(_newManufacturer);
	}

	// Register a product with its details (onlyOwnerOrModerator)
	function registerProduct(
		string memory _name,
		uint256 _productionDate,
		uint256 _expiryDate,
		bytes32 _productHash,
		string memory _notes
	) public onlyOwnerOrModerator {
		products[_productHash] = Product({
			name: _name,
			productionDate: _productionDate,
			expiryDate: _expiryDate,
			productHash: _productHash,
			notes: _notes
		});

		emit ProductRegistered(products[_productHash]);
	}

	// Update the notes for a product (onlyOwnerOrModerator)
	function updateProductNotes(
		string memory _productID,
		string memory _notes
	) public onlyOwnerOrModerator {
		bytes32 productHash = keccak256(abi.encodePacked(_productID));
		require(
			bytes(products[productHash].name).length != 0,
			"Product does not exist."
		);

		products[productHash].notes = _notes;

		emit ProductNotesUpdated(productHash, _notes);
	}

	// Check authenticity directly by comparing input hash to stored hash
	function checkAuthenticity(
		string memory _productID
	) public view returns (Product memory) {
		bytes32 inputHash = keccak256(abi.encodePacked(_productID));
		Product memory product = products[inputHash];

		// If the product doesn't exist or is not authentic, revert
		require(bytes(product.name).length != 0, "Product does not exist.");

		return product;
	}

	function getHash(string memory _productID) public pure returns (bytes32) {
		return keccak256(abi.encodePacked(_productID));
	}

	// Transfer ownership of the contract to a new owner
	function transferOwnership(address newOwner) public onlyOwner {
		require(newOwner != address(0), "New owner is the zero address");
		owner = newOwner;
	}
}