import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import cropStorageData from "../contract/CropStorage.json";

const DataLLM = ({ batchId }) => {
  const [contract, setContract] = useState(null);
  const [cropScores, setCropScores] = useState(null);
  const [transportationData, setTransportationData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (!batchId) return;

    const connectWalletAndFetchData = async () => {
      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      try {
        if (!window.ethereum) {
          alert("Please install MetaMask.");
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        console.log("Contract address:", cropStorageData.address);
        console.log("ABI:", cropStorageData.abi);

        const _contract = new ethers.Contract(
          cropStorageData.address,
          cropStorageData.abi,
          signer
        );
        setContract(_contract);

        console.log("Fetching data for batchId:", batchId);
        const [cropEntries, transportationEntries, storageEntries] = await Promise.all([
          _contract.getAverageCropData(batchId),
          _contract.getTransportationByBatchId(batchId),
          _contract.getStorageByBatchID(batchId), // To Ivan: for now no faucet, when i upload data for this should be ok liao
        ]);

        console.log("Raw crop data:", cropEntries);
        console.log("Raw transportation data:", transportationEntries);
        console.log("Raw storage data:", storageEntries);

        if (!cropEntries || cropEntries.length === 0) {
          alert("No crop data found.");
          setCropScores(null);
        } else {
          const parsedCrop = parseCropData(cropEntries);
          console.log("Parsed Crop Data:", parsedCrop);
          setCropScores(parsedCrop);
        }

        if (!transportationEntries || transportationEntries.length === 0) {
          alert("No transportation data found.");
          setTransportationData(null);
        } else {
          const parsedTransportation = parseTransportationData(transportationEntries);
          console.log("Parsed Transportation Data:", parsedTransportation);
          setTransportationData(parsedTransportation);
        }

        if (!storageEntries || storageEntries.length === 0) {
          alert("No storage data found.");
          setStorageData(null);
        } else {
          const parsedStorage = parseStorageData(storageEntries);
          console.log("Parsed Storage Data:", parsedStorage);
          setStorageData(parsedStorage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        //alert("Failed to fetch some or all data.");
      } finally {
        setLoading(false);
        isConnectingRef.current = false;
      }
    };

    connectWalletAndFetchData();
  }, [batchId]);

  const parseCropData = (data) => {
    const airTemp = Number(data[0]);
    const airHumidity = Number(data[1]);
    const soilMoisture = Number(data[2]);
    const soilPH = Number(data[3]);
    const n = Number(data[4]);
    const p = Number(data[5]);
    const k = Number(data[6]);

    return {
      overall_score: Math.round((airTemp + airHumidity + soilMoisture + soilPH + n + p + k) / 7),
      freshness_score: Math.max(0, Math.min(100, 100 - Math.abs(airTemp - 25) * 2)),
      nutritional_value_score: Math.min(100, n + p + k),
      shelf_life_score: Math.max(0, 100 - Math.abs(soilMoisture - 50)),
      skin_quality_score: Math.max(0, 100 - Math.abs(soilPH - 6) * 10),
      sweetness_score: Math.min(100, Math.floor(k * 1.2)),
      texture_score: Math.min(100, Math.floor(soilMoisture / 2)),
      appearance_score: Math.min(100, 100 - Math.abs(airHumidity - 60)),
    };
  };

  const parseTransportationData = (data) => {
    return {
      batch_id: data[0],
      productionLevel: Number(data[1]),
      temperature: Number(data[2]),
      humidity: Number(data[3]),
      date: Number(data[4]),
    };
  };

  const parseStorageData = (data) => {
    return {
      batch_id: data[0],
      productionLevel: Number(data[1]),
      temperature: Number(data[2]),
      humidity: Number(data[3]),
      date: Number(data[4]),
    };
  };

  return null; // or your JSX UI here
};

export default DataLLM;
