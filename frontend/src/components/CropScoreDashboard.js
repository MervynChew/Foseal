import './CropScoreDashboard.css';

import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import cropStorageData from "../contract/CropStorage.json";

const CropScoreDashboard = ({ batchId
 }) => {
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
    const airTemp = Number(data[1]);
    const airHumidity = Number(data[0]);
    const soilPH = Number(data[2]);
    const soilMoisture = Number(data[3]);
    const k = Number(data[4]);
    const n = Number(data[5]);
    const p = Number(data[6]);

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


  const ProgressBar = ({ label, value }) => {
    const val = Number(value);
    return (
      <div className="progress-bar-container">
        <div className="label-row">
          <span className="label">{label}</span>
          <span className="percentage">{val}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${val}%` }}></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="score-board"><p>Loading data from blockchain...</p></div>;
  }

  if (!scores) {
    return <div className="score-board"><p>No data found for this crop.</p></div>;
  }

  return (


    <div className="score-board">
      <h2>Crop Quality Dashboard</h2>

      <div className="overall-score">
        <div className="score-value">{scores.overall_score}%</div>
        <div className="score-label">Overall Quality</div>
      </div>

      <ProgressBar label="Freshness" value={scores.freshness_score} />
      <ProgressBar label="Nutritional Value" value={scores.nutritional_value_score} />
      <ProgressBar label="Shelf Life" value={scores.shelf_life_score} />
      <ProgressBar label="Skin Quality" value={scores.skin_quality_score} />
      <ProgressBar label="Sweetness" value={scores.sweetness_score} />
      <ProgressBar label="Texture" value={scores.texture_score} />
      <ProgressBar label="Appearance" value={scores.appearance_score} />
    </div>
  );
};

export default CropScoreDashboard;