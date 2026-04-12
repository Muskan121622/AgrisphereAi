// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriTrace {
    struct CropBatch {
        string batchId;
        string productType;
        string location;
        string certification;
        uint256 harvestDate;
        address farmer;
    }

    struct TransitRecord {
        string action;
        string location;
        uint256 timestamp;
        address actor;
    }

    // Mapping from Batch ID to Crop Details
    mapping(string => CropBatch) public crops;
    
    // Mapping from Batch ID to History of Transit Records
    mapping(string => TransitRecord[]) public cropHistory;

    event CropRegistered(string batchId, string productType, address farmer);
    event StatusUpdated(string batchId, string action, string location, address actor);

    function registerCrop(
        string memory _batchId,
        string memory _productType,
        string memory _location,
        string memory _certification
    ) public {
        require(crops[_batchId].farmer == address(0), "Crop batch already exists!");

        crops[_batchId] = CropBatch({
            batchId: _batchId,
            productType: _productType,
            location: _location,
            certification: _certification,
            harvestDate: block.timestamp,
            farmer: msg.sender
        });

        // Add the initial creation event to history
        cropHistory[_batchId].push(TransitRecord({
            action: "Harvested & Registered",
            location: _location,
            timestamp: block.timestamp,
            actor: msg.sender
        }));

        emit CropRegistered(_batchId, _productType, msg.sender);
    }

    function updateTransitStatus(
        string memory _batchId,
        string memory _action,
        string memory _location
    ) public {
        require(crops[_batchId].farmer != address(0), "Crop batch does not exist!");

        cropHistory[_batchId].push(TransitRecord({
            action: _action,
            location: _location,
            timestamp: block.timestamp,
            actor: msg.sender
        }));

        emit StatusUpdated(_batchId, _action, _location, msg.sender);
    }

    function getCropHistory(string memory _batchId) public view returns (TransitRecord[] memory) {
        return cropHistory[_batchId];
    }
}
