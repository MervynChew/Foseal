// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropStorage {
    struct CropData {
        string batch_id;
        uint8 productionLevel;
        uint256 date;
        int256 airTemperature;
        uint256 airHumidity;
        uint256 soilMoisture;
        uint256 soilPH;
        uint256 nitrogen;
        uint256 phosphorus;
        uint256 potassium;
    }

    struct Storage {
        string batch_id;
        uint8 productionLevel;
        int256 temperature;
        uint256 humidity;
        uint256 date;
    }

    struct Transportation {
        string batch_id;
        uint8 productionLevel;
        int256 temperature;
        uint256 humidity;
        uint256 date;
    }

    // Use mappings to store and update by unique key (batch_id + productionLevel + date)
    mapping(bytes32 => CropData) private cropRecords;
    mapping(bytes32 => Storage) private storageConditions;
    mapping(bytes32 => Transportation) private transportationConditions;

    mapping(string => uint256[]) private cropDatesByBatch;

    bytes32[] public transportationKeys;
    bytes32[] public storageKeys;





    // Events
    event CropStored(
        string batch_id,
        uint8 productionLevel,
        uint256 date,
        int256 airTemperature,
        uint256 airHumidity,
        uint256 soilMoisture,
        uint256 soilPH,
        uint256 nitrogen,
        uint256 phosphorus,
        uint256 potassium
    );

    event CropUpdated(
        string batch_id,
        uint8 productionLevel,
        uint256 date
    );

    event StorageStored(
        string batch_id,
        uint8 productionLevel,
        int256 temperature,
        uint256 humidity,
        uint256 date
    );

    event StorageUpdated(
        string batch_id,
        uint8 productionLevel,
        uint256 date
    );

    event TransportationStored(
        string batch_id,
        uint8 productionLevel,
        int256 temperature,
        uint256 humidity,
        uint256 date
    );

    event TransportationUpdated(
        string batch_id,
        uint8 productionLevel,
        uint256 date
    );

    // --- Helper function to generate unique key ---
    function getKey(string memory _batch_id, uint8 _productionLevel, uint256 _date) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_batch_id, _productionLevel, _date));
    }

    // --- CropData functions ---

    function storeCrop(
        string memory _batch_id,
        uint8 _productionLevel,
        uint256 _date,
        int256 _airTemperature,
        uint256 _airHumidity,
        uint256 _soilMoisture,
        uint256 _soilPH,
        uint256 _nitrogen,
        uint256 _phosphorus,
        uint256 _potassium
    ) public {
        require(bytes(_batch_id).length > 0, "Batch ID required");
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(cropRecords[key].date == 0, "Crop already exists");

        cropRecords[key] = CropData({
            batch_id: _batch_id,
            productionLevel: _productionLevel,
            date: _date,
            airTemperature: _airTemperature,
            airHumidity: _airHumidity,
            soilMoisture: _soilMoisture,
            soilPH: _soilPH,
            nitrogen: _nitrogen,
            phosphorus: _phosphorus,
            potassium: _potassium
        });

        emit CropStored(
            _batch_id,
            _productionLevel,
            _date,
            _airTemperature,
            _airHumidity,
            _soilMoisture,
            _soilPH,
            _nitrogen,
            _phosphorus,
            _potassium
        );

        cropDatesByBatch[_batch_id].push(_date);
    }

    function updateCrop(
        string memory _batch_id,
        uint8 _productionLevel,
        uint256 _date
    ) public {
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(cropRecords[key].date != 0, "Crop does not exist");

        CropData storage crop = cropRecords[key];
        crop.productionLevel = _productionLevel;
        crop.date = _date;

        emit CropUpdated(_batch_id, _productionLevel, _date);
    }

    function getCropByBatchID(string memory _batch_id, uint8 _productionLevel, uint256 _date) public view returns (CropData memory) {
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(cropRecords[key].date != 0, "Crop does not exist");
        return cropRecords[key];
    }



    function getAverageCropData(string memory _batch_id) public view returns (
    int256 avgAirTemperature,
    uint256 avgAirHumidity,
    uint256 avgSoilMoisture,
    uint256 avgSoilPH,
    uint256 avgNitrogen,
    uint256 avgPhosphorus,
    uint256 avgPotassium
    ) {
        uint256[] memory dates = cropDatesByBatch[_batch_id];
        require(dates.length > 0, "No crop records for this batch");

        uint256 count = 0;
        int256 totalAirTemp = 0;
        uint256 totalAirHum = 0;
        uint256 totalSoilMoist = 0;
        uint256 totalSoilPH = 0;
        uint256 totalN = 0;
        uint256 totalP = 0;
        uint256 totalK = 0;

        for (uint256 i = 0; i < dates.length; i++) {
            bytes32 key = getKey(_batch_id, 0, dates[i]);
            CropData memory crop = cropRecords[key];

            if (crop.date != 0) {
                totalAirTemp += crop.airTemperature;
                totalAirHum += crop.airHumidity;
                totalSoilMoist += crop.soilMoisture;
                totalSoilPH += crop.soilPH;
                totalN += crop.nitrogen;
                totalP += crop.phosphorus;
                totalK += crop.potassium;
                count++;
            }
        }

        require(count > 0, "No matching records found");

        avgAirTemperature = totalAirTemp / int256(count);
        avgAirHumidity = totalAirHum / count;
        avgSoilMoisture = totalSoilMoist / count;
        avgSoilPH = totalSoilPH / count;
        avgNitrogen = totalN / count;
        avgPhosphorus = totalP / count;
        avgPotassium = totalK / count;
    }


    // --- Storage functions ---

    function storeStorage(
        string memory _batch_id,
        uint8 _productionLevel,
        int256 _temperature,
        uint256 _humidity,
        uint256 _date
    ) public {
        require(bytes(_batch_id).length > 0, "Batch ID required");
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(storageConditions[key].date == 0, "Storage data already exists");

        storageConditions[key] = Storage({
            batch_id: _batch_id,
            productionLevel: _productionLevel,
            temperature: _temperature,
            humidity: _humidity,
            date: _date
        });

        storageKeys.push(key); 

        emit StorageStored(_batch_id, _productionLevel, _temperature, _humidity, _date);
    }

    function updateStorage(
        string memory _batch_id,
        uint8 _productionLevel,
        uint256 _date
    ) public {
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(storageConditions[key].date != 0, "Storage data does not exist");

        Storage storage storageData = storageConditions[key];
        storageData.productionLevel = _productionLevel;
        storageData.date = _date;

        emit StorageUpdated(_batch_id, _productionLevel, _date);
    }

    function getStorageByBatchID(string memory _batch_id) public view returns (Storage memory) {
        for (uint256 i = 0; i < storageKeys.length; i++) {
            Storage memory s = storageConditions[storageKeys[i]];
            if (
                keccak256(abi.encodePacked(s.batch_id)) == keccak256(abi.encodePacked(_batch_id)) &&
                s.productionLevel == 1
            ) {
                return s;
            }
        }
        revert("Storage data not found for this batch ID and production level 1.");
    }


    // --- Transportation functions ---

    function storeTransportation(
        string memory _batch_id,
        uint8 _productionLevel,
        int256 _temperature,
        uint256 _humidity,
        uint256 _date
    ) public {
        require(bytes(_batch_id).length > 0, "Batch ID required");
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(transportationConditions[key].date == 0, "Transportation data already exists");

        transportationConditions[key] = Transportation({
            batch_id: _batch_id,
            productionLevel: _productionLevel,
            temperature: _temperature,
            humidity: _humidity,
            date: _date
        });

        transportationKeys.push(key);

        emit TransportationStored(_batch_id, _productionLevel, _temperature, _humidity, _date);
    }

    function updateTransportation(
        string memory _batch_id,
        uint8 _productionLevel,
        uint256 _date
    ) public {
        bytes32 key = getKey(_batch_id, _productionLevel, _date);
        require(transportationConditions[key].date != 0, "Transportation data does not exist");

        Transportation storage transportData = transportationConditions[key];
        transportData.productionLevel = _productionLevel;
        transportData.date = _date;

        emit TransportationUpdated(_batch_id, _productionLevel, _date);
    }

    function getTransportationByBatchId(string memory _batch_id) public view returns (Transportation memory) {
        for (uint256 i = 0; i < transportationKeys.length; i++) {
            Transportation memory t = transportationConditions[transportationKeys[i]];
            if (
                keccak256(abi.encodePacked(t.batch_id)) == keccak256(abi.encodePacked(_batch_id)) &&
                t.productionLevel == 1
            ) {
                return t;
            }
        }
        revert("Transportation data not found for this batch ID and production level 1.");
    }

}
