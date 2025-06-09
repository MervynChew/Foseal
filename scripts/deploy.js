// scripts/deploy.js
require("@nomicfoundation/hardhat-ethers");

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const frontendPath = path.join(__dirname, "../frontend/src/contract");
const contractJsonPath = path.join(frontendPath, "CropStorage.json");
const artifactPath = path.join(__dirname, "../artifacts/contracts/CropStorage.sol/CropStorage.json");

async function main() {
  // Read compiled ABI
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Ensure frontend directory exists
  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  let address;

  // Check if address already exists
  if (fs.existsSync(contractJsonPath)) {
    const existing = JSON.parse(fs.readFileSync(contractJsonPath, "utf8"));
    address = existing.address;

    console.log(`Using existing deployed contract at: ${address}`);
  } else {
    // Deploy a new contract
    const CropStorage = await hre.ethers.getContractFactory("CropStorage");
    const cropStorage = await CropStorage.deploy();
    await cropStorage.waitForDeployment();
    address = await cropStorage.getAddress();

    console.log(`New contract deployed at: ${address}`);
  }

  // Write ABI and address to frontend
  const contractData = {
    address,
    abi: artifact.abi,
  };

  fs.writeFileSync(contractJsonPath, JSON.stringify(contractData, null, 2));
  console.log("Contract data written to frontend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
