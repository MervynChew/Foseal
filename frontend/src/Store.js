import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import axios from "axios";
import cropStorageData from "./contract/CropStorage.json";

function Store() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [latestData, setLatestData] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [cropName] = useState("Potato_Plant_01"); // Fixed crop name
  const [storedResults, setStoredResults] = useState([]);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    fetchLatestSensorData();
  }, []);

  const fetchLatestSensorData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/sensor-data/${cropName}/latest`);
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setLatestData(data);

        const input = [
          data.air_temperature,
          data.air_humidity,
          data.soil_moisture,
          data.soil_ph,
          data.npk_n,
          data.npk_p,
          data.npk_k,
        ];
        const result = predictFertilizer(input);
        setPrediction(result);
      }
    } catch (error) {
      console.error("Error fetching latest sensor data:", error);
    }
  };

  const predictFertilizer = ([airTemp, airHumid, soilMoist, soilPH, n, p, k]) => {
    if (n < 100 && p > 200 && k > 400 && soilPH >= 7) {
      return "Fertilizer A";
    } else if (n > 400 && p < 150 && k > 600 && soilPH < 6) {
      return "Fertilizer B";
    } else {
      return "Fertilizer C";
    }
  };

  const connectWallet = async () => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(cropStorageData.address, cropStorageData.abi, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);

        alert("Wallet connected!");
      } catch (err) {
        console.error("Connection error:", err);
      } finally {
        isConnectingRef.current = false;
      }
    } else {
      alert("Please install MetaMask.");
      isConnectingRef.current = false;
    }
  };

  const handleStore = async () => {
    if (!contract) return alert("Please connect wallet first.");
    if (!latestData) return alert("Sensor data not loaded.");

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const tx = await contract.storeCrop(
        cropName,
        timestamp,
        parseInt(latestData.air_temperature),
        parseInt(latestData.air_humidity),
        parseInt(latestData.soil_moisture),
        parseInt(latestData.soil_ph),
        parseInt(latestData.npk_n),
        parseInt(latestData.npk_p),
        parseInt(latestData.npk_k)
      );
      await tx.wait();

      alert("Crop data stored successfully!");
    } catch (err) {
      console.error("Store error:", err);
      alert("Store failed: " + (err?.reason || err?.message));
    }
  };

  const handleGetCrops = async () => {
    if (!contract) return alert("Please connect wallet first.");

    try {
      const entries = await contract.getCropsByName(cropName);
      setStoredResults(entries);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch crop data.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <button onClick={connectWallet}>🔗 Connect Wallet</button>

      <h2>🌾 Smart Crop Dashboard</h2>

      {latestData ? (
        <>
          <h3>📊 Latest Sensor Data for "{cropName}":</h3>
          <pre>{JSON.stringify(latestData, null, 2)}</pre>

          <h3>🧪 Recommended Fertilizer:</h3>
          <p><strong>{prediction}</strong></p>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleStore}>📥 Store Crop Data</button>
            <button onClick={handleGetCrops} style={{ marginLeft: "1rem" }}>
              🔍 Get Stored Crops
            </button>
          </div>
        </>
      ) : (
        <p>Loading latest sensor data...</p>
      )}

      {storedResults.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📦 Stored Crop Entries:</h3>
          {storedResults.map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <p><strong>Crop:</strong> {item[0]}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(item[1]) * 1000).toLocaleString()}</p>
              <p><strong>Air Temp:</strong> {item[2].toString()}</p>
              <p><strong>Air Humidity:</strong> {item[3].toString()}</p>
              <p><strong>Soil Moisture:</strong> {item[4].toString()}</p>
              <p><strong>Soil PH:</strong> {item[5].toString()}</p>
              <p><strong>N:</strong> {item[6].toString()}</p>
              <p><strong>P:</strong> {item[7].toString()}</p>
              <p><strong>K:</strong> {item[8].toString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;
