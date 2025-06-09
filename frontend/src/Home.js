import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import cropStorageData from "./contract/CropStorage.json";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [crop, setCrop] = useState("");
  const [airTemp, setAirTemp] = useState("");
  const [airHumidity, setAirHumidity] = useState("");
  const [soilMoisture, setSoilMoisture] = useState("");
  const [soilPH, setSoilPH] = useState("");
  const [n, setN] = useState("");
  const [p, setP] = useState("");
  const [k, setK] = useState("");
  const [date, setDate] = useState(""); // Default to today's date
  const [searchCrop, setSearchCrop] = useState("");
  const [result, setResult] = useState([]);

  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app.");
    }
  }, []);

  const connectWallet = async () => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(
          cropStorageData.address,
          cropStorageData.abi,
          _signer
        );

        console.log("Contract add:", cropStorageData.address);

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
    if (!contract) {
      alert("Contract not initialized yet. Please connect wallet.");
      return;
    }

    if (!crop || airTemp === "" || airHumidity === "" || soilMoisture === "" || soilPH === "" || n === "" || p === "" || k === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      console.log("Crop:", crop, "Temp:", airTemp);

      // Convert date to timestamp (uint256)
      const timestamp = Math.floor(new Date(date).getTime() / 1000);
    
      const tx = await contract.storeCrop(
        crop,
        timestamp,
        parseInt(airTemp),
        parseInt(airHumidity),
        parseInt(soilMoisture),
        parseInt(soilPH),
        parseInt(n),
        parseInt(p),
        parseInt(k)
      );
      await tx.wait();

      alert("Crop data stored successfully!");
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error message:", err.message);
      console.error("Error reason:", err.reason);
      console.error("Error data:", err.data);
      if (err?.error?.message) console.error("Nested error:", err.error.message);
      alert("Transaction failed: " + (err?.reason || err?.message || "Unknown error"));
    }
  };

  const handleSearch = async () => {
    if (!contract) {
      alert("Please connect your wallet.");
      return;
    }

    if (!searchCrop) {
      alert("Please enter a crop name to search.");
      return;
    }

    try {
      const entries = await contract.getCropsByName(searchCrop);
      setResult(entries);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch crop data.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={connectWallet}>Connect Wallet</button>

      <h1>🌱 Crop Storage DApp</h1>

      <div style={{ marginTop: "2rem" }}>
        <h3>Store Crop Data</h3>
        <input type="text" placeholder="Crop" value={crop} onChange={(e) => setCrop(e.target.value)} />
        <input type="number" placeholder="Air Temperature" value={airTemp} onChange={(e) => setAirTemp(e.target.value)} />
        <input type="number" placeholder="Air Humidity" value={airHumidity} onChange={(e) => setAirHumidity(e.target.value)} />
        <input type="number" placeholder="Soil Moisture" value={soilMoisture} onChange={(e) => setSoilMoisture(e.target.value)} />
        <input type="number" placeholder="Soil pH" value={soilPH} onChange={(e) => setSoilPH(e.target.value)} />
        <input type="number" placeholder="N value" value={n} onChange={(e) => setN(e.target.value)} />
        <input type="number" placeholder="P value" value={p} onChange={(e) => setP(e.target.value)} />
        <input type="number" placeholder="K value" value={k} onChange={(e) => setK(e.target.value)} />
        <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={handleStore}>Store Data</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Get Stored Crop Data</h3>
        <input
          type="text"
          placeholder="Enter crop to search"
          value={searchCrop}
          onChange={(e) => setSearchCrop(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        {result.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            {result.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                {result.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}>
                    <p><strong>Crop:</strong> {item[0]}</p>
                    <p><strong>Air Temperature:</strong> {item[2].toString()}</p>
                    <p><strong>Air Humidity:</strong> {item[3].toString()}</p>
                    <p><strong>Soil Moisture:</strong> {item[4].toString()}</p>
                    <p><strong>Soil pH:</strong> {item[5].toString()}</p>
                    <p><strong>N:</strong> {item[6].toString()}</p>
                    <p><strong>P:</strong> {item[7].toString()}</p>
                    <p><strong>K:</strong> {item[8].toString()}</p>
                    <p><strong>Timestamp:</strong> {new Date(Number(item[1]) * 1000).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

