import "../Consumer.css";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import cropStorageData from "../contract/CropStorage.json";
import InfoCard from './InfoCard'; // Ensure this is the correct relative path

const DashboardCards = ({ batchId, activeCard, toggleCard }) => {
  const [scores, setScores] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConnectingRef = useRef(false);

  useEffect(() => {
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
        const _contract = new ethers.Contract(
          cropStorageData.address,
          cropStorageData.abi,
          signer
        );
        setContract(_contract);

        const entries = await _contract.getAverageCropData(batchId);

        if (entries.length === 0) {
          alert("No crop data found.");
          setScores(null);
        } else {
          const parsed = parseCropData(entries);
          setScores(parsed);
        }

        console.log("Raw entries from contract:", entries);
      } catch (err) {
        console.error("Blockchain fetch error:", err);
        alert("Failed to fetch crop data.");
      } finally {
        setLoading(false);
        isConnectingRef.current = false;
      }
    };

    if (batchId) {
      connectWalletAndFetchData();
    }
  }, [batchId]);

  const parseCropData = (data) => {
    return {
      airHumidity: Number(data[0]),
      airTemperature: Number(data[1]),
      soilPH: Number(data[2]),
      soilMoisture: Number(data[3]),
      potassium: Number(data[4]),
      nitrogen: Number(data[5]),
      phosphorus: Number(data[6]),
    };
  };

  if (loading) {
    return <div className="score-board"><p>Loading data from blockchain...</p></div>;
  }

  if (!scores) {
    return <div className="score-board"><p>No data found for this crop.</p></div>;
  }

  return (
    <div className="cards-container">
      {/* Transport Card */}
      <InfoCard
        title="Transportation"
        emoji="🚚"
        cardKey="transport"
        activeCard={activeCard}
        toggleCard={toggleCard}
        fetchFunction={async () => {
          if (!contract) return {};
          const raw = await contract.getTransportationByBatchId(batchId);

          console.log("Storage raw:", raw);
          
          return {
            temperature: Number(raw.temperature),
            humidity: Number(raw.humidity),
          };
        }}
        fields={[
          { label: "Average Temperature", key: "temperature", unit: "°C" },
          { label: "Air Humidity", key: "humidity", unit: "%" },
        ]}
      />

      {/* Storage Card */}
      <InfoCard
        title="Storage"
        emoji="📦"
        cardKey="storage"
        activeCard={activeCard}
        toggleCard={toggleCard}
        fetchFunction={async () => {
          if (!contract) return {};
          const raw = await contract.getStorageByBatchID(batchId);

          console.log("Storage raw:", raw);

          return {
            storage_temperature: Number(raw.temperature),
            storage_humidity: Number(raw.humidity),
          };
        }}
        fields={[
          { label: "Storage Humidity", key: "storage_humidity", unit: "%" },
          { label: "Storage Temperature", key: "storage_temperature", unit: "°C" },
        ]}
      />
    </div>
  );
};

export default DashboardCards;
