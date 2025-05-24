// scripts/deploy.js
require("@nomicfoundation/hardhat-ethers");

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const CropStorage = await hre.ethers.getContractFactory("CropStorage");
  const cropStorage = await CropStorage.deploy();
  await cropStorage.waitForDeployment();

  const address = await cropStorage.getAddress();

  console.log(`Deployed to: ${address}`);

  const contractData = {
    address,
    abi: JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../artifacts/contracts/CropStorage.sol/CropStorage.json"),
        "utf8"
      )
    ).abi,
  };

  // Write to frontend folder
  const outputDir = path.join(__dirname, "../frontend/src/contract");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(outputDir, "CropStorage.json"),
    JSON.stringify(contractData, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


