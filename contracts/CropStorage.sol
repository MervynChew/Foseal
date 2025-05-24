// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropStorage {
    string public crop;

    function setCrop(string memory _crop) public {
        crop = _crop;
    }

    function getCrop() public view returns (string memory) {
        return crop;
    }
}