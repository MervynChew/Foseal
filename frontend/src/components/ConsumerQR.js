import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import cropStorageData from "../contract/CropStorage.json";
import "./ConsumerQR.css"; // ⬅️ Import the CSS

const ConsumerQR = ({ batchId }) => {
  const [contract, setContract] = useState(null);
  const [cropScores, setCropScores] = useState(null);
  const [transportationData, setTransportationData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState("");
  const isConnectingRef = useRef(false);

  const qrImageRef = useRef(null);  // <-- Added this line

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

        const _contract = new ethers.Contract(
          cropStorageData.address,
          cropStorageData.abi,
          signer
        );
        setContract(_contract);

        const [cropEntries, transportationEntries, storageEntries] = await Promise.all([
          _contract.getAverageCropData(batchId),
          _contract.getTransportationByBatchId(batchId),
          _contract.getStorageByBatchID(batchId),
        ]);

        if (cropEntries && cropEntries.length > 0) {
          const parsedCrop = parseCropData(cropEntries);
          setCropScores(parsedCrop);

          // Destructure crop data here
          var { airTemp, airHumidity, soilMoisture, soilPH, n, p, k } = parsedCrop;
        }

        if (transportationEntries && transportationEntries.length > 0) {
          const parsedTransportation = parseTransportationData(transportationEntries);
          setTransportationData(parsedTransportation);

          // Destructure transportation data here
          var { temperature, humidity, date } = parsedTransportation;
        }

        
        if (storageEntries && storageEntries.length > 0) {
          const parsedStorage = parseStorageData(storageEntries);
          setStorageData(parsedStorage);

          // Destructure transportation data here
          var { temperature_storage, humidity_storage, date_storage } = parsedStorage;
        }

        


        console.log("Crop Entries:", cropEntries);
        console.log("Transportation:", transportationEntries);
        console.log("Storage:", storageEntries);

        // Prepare the data to encode into QR
        const qrPayload = {
          batchId,
          cropScores: cropEntries,
          transportationData: transportationEntries,
          storageData: storageEntries,
        };

        const readableText = `
          🌾 Batch ID: ${batchId}

          🌱 Crop Data
          ──────────────
          🌡️  Air Temperature : ${airTemp}°C
          💧  Air Humidity  : ${airHumidity}%
          🌿  Soil Moisture : ${soilMoisture}%
          ⚗️  Soil pH : ${soilPH}
          🧪  Nutrient Levels
            • Nitrogen (N)  : ${n}
            • Phosphorus (P)  : ${p}
            • Potassium (K) : ${k}

          🚚 Transportation
          ──────────────
          🌡️  Temperature : ${temperature}°C
          💧  Humidity  : ${humidity}%
          📅  Date  : ${new Date(Number(date) * 1000).toLocaleString()}

          🚚 Storage
          ──────────────
          🌡️  Temperature : ${temperature_storage}°C
          💧  Humidity  : ${humidity_storage}%
          📅  Date  : ${new Date(Number(date_storage) * 1000).toLocaleString()}
          `.trim();


          setQrData(readableText.trim());



      } catch (error) {
        console.error("Error fetching data:", error);
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

    return { airTemp, airHumidity, soilMoisture, soilPH, n, p, k };
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
      batch_id_storage: data[0],
      productionLevel_storage: Number(data[1]),
      temperature_storage: Number(data[2]),
      humidity_storage: Number(data[3]),
      date_storage: Number(data[4]),
    };
  };

  const downloadQR = async () => {
  try {
    const image = qrImageRef.current;
    const url = image.src;

    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${batchId}_QRcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to download QR code:", error);
  }
};



  return (
    <div className="qr-wrapper">
      {loading && <p>Loading...</p>}
      {!loading && qrData && (
        <div className="qr-box">
          <img
            ref={qrImageRef}
            className="qr-image"
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=250x250`}
            alt="QR Code"
          />
          <button className="qr-download-btn" onClick={downloadQR}>
            ⬇️ Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsumerQR;
