const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');
const { ethers } = require('ethers');
const cropStorageData = require("./frontend/src/contract/CropStorage.json");

require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = require('./foseal-33f5f-firebase-adminsdk-fbsvc-ce58e81345.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

/* For upload in blochchain de*/
// Setup provider & wallet (replace these with your own)
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const _contract = new ethers.Contract(cropStorageData.address, cropStorageData.abi, wallet);

console.log("🧾 Contract methods available:", Object.keys(_contract));


async function uploadToBlockchain(reading) {

  console.log("🟡 uploadToBlockchain called with:", reading);

  const { batch_id, ProductionLevel } = reading;

  try {
    let tx;
    const date = Math.floor(new Date(reading.timestamp).getTime() / 1000); // convert to UNIX timestamp

    if (ProductionLevel === 0) {
      // storeCrop
      const airTemperature = Math.round(reading.air_temperature);
      const airHumidity = Math.floor(reading.air_humidity);
      const soilMoisture = Math.floor(reading.soil_moisture);
      const soilPH = Math.floor(reading.soil_ph);
      const nitrogen = Math.floor(reading.npk_n);
      const phosphorus = Math.floor(reading.npk_p);
      const potassium = Math.floor(reading.npk_k);

      console.log("storeCrop inputs:", {
        batch_id,
        ProductionLevel,
        date,
        airTemperature,
        airHumidity,
        soilMoisture,
        soilPH,
        nitrogen,
        phosphorus,
        potassium
      });

      console.log("Batch ID:", batch_id, typeof batch_id);
      console.log("date:", date); // should be a number


      tx = await _contract.storeCrop(
        batch_id,
        ProductionLevel,
        date,
        parseInt(airTemperature),
        parseInt(airHumidity),
        parseInt(soilMoisture),
        parseInt(soilPH),
        parseInt(nitrogen),
        parseInt(phosphorus),
        parseInt(potassium)
      );
      
      await tx.wait();

    } else if (ProductionLevel === 1) {
      
      
      const rawTemp = Math.round(reading.temperature);
      const rawHum = Math.floor(reading.humidity);


      if (typeof rawTemp !== 'number' || typeof rawHum !== 'number') {
        throw new Error(`Missing or invalid temperature/humidity in reading: ${JSON.stringify(reading)}`);
      }

      const temperature = Math.round(rawTemp);
      const humidity = Math.floor(rawHum);

      // Safeguard
      if (isNaN(temperature) || isNaN(humidity)) {
        console.error("❌ Invalid temperature or humidity values:", temperature, humidity);
        return; // Prevent blockchain call
      }


      console.log("storeTransportation inputs:", {
        batch_id,
        ProductionLevel,
        temperature,
        humidity,
        date
      });

      tx = await _contract.storeTransportation(
        batch_id,
        ProductionLevel,
        temperature,
        humidity,
        date
      );

      await tx.wait();

    } else if (ProductionLevel === 2) {
      // // storeStorage
      // const temperature = Math.round(reading.air_temperature);
      // const humidity = Math.floor(reading.air_humidity);
      const rawTemp = Math.round(reading.temperature);
      const rawHum = Math.floor(reading.humidity);


      if (typeof rawTemp !== 'number' || typeof rawHum !== 'number') {
        throw new Error(`Missing or invalid temperature/humidity in reading: ${JSON.stringify(reading)}`);
      }


      console.log("storeStorage inputs:", {
        batch_id,
        ProductionLevel,
        temperature,
        humidity,
        date
      });

      tx = await _contract.storeStorage(
        batch_id,
        ProductionLevel,
        temperature,
        humidity,
        date
      );

      await tx.wait();

      if (ProductionLevel === 1 || ProductionLevel === 2) {
      if (typeof reading.air_temperature !== 'number' || typeof reading.air_humidity !== 'number') {
        console.error("🚫 Invalid reading for transportation/storage:", reading);
        return false;
      }
    }



    } else {
      console.warn("⚠️ Invalid ProductionLevel:", ProductionLevel);
      return;
    }

    console.log(`📤 Sending transaction for batch ${batch_id} at level ${ProductionLevel}...`);
    await tx.wait();
    console.log(`✅ Transaction confirmed for batch ${batch_id}`);
    return true;

  } catch (err) {
    console.error("❌ Error uploading to blockchain:", err);
    return false;
    throw err;
  }
}

/* For upload in blochchain de*/

// Middleware
app.use(cors());
app.use(express.json());


// Route to get all sensor data
app.get('/api/new-sensor-data', async (req, res) => {
  try {
    const snapshot = await db.collection('sensor_readings')
      .where('uploaded', '!=', true)  // Only fetch not yet uploaded
      .get();

    const data = [];
    for (const doc of snapshot.docs) {
      const reading = doc.data();
      await uploadToBlockchain(reading);
      
      // Mark as uploaded to prevent duplicate uploads
      await db.collection('sensor_readings').doc(doc.id).update({
        uploaded: true
      });

      data.push({ id: doc.id, ...reading });
    }

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('Error uploading to blockchain:', error);
    res.status(500).json({ success: false, error: 'Blockchain upload failed' });
  }
});




// Route to get all sensor data
app.get('/api/sensor-data', async (req, res) => {
  try {
    const snapshot = await db.collection('sensor_readings').get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sensor data' });
  }
});


app.get('/api/check-new-sensor-data', async (req, res) => {
  try {
    const snapshot = await db.collection('sensor_readings')
      .where('uploaded', '!=', true)
      .get();
    res.json({
      count: snapshot.size,
      docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




// Get all sensor data for a specific plant
app.get('/api/sensor-data/:plantName', async (req, res) => {
  try {
    const { plantName } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;
    
    let query = db.collection('sensor_readings')
      .where('plant_name', '==', plantName)
      .orderBy('timestamp', 'desc');
    
    // Add date filters if provided
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }
    
    query = query.limit(parseInt(limit));
    
    const snapshot = await query.get();
    const data = [];
    
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: data,
      count: data.length
    });
    
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sensor data'
    });
  }
});

// Get all sensor data (no filter by plantName)
// app.get('/api/sensor-data', async (req, res) => {
//   try {
//     const { startDate, endDate, limit = 100 } = req.query;

//     let query = db.collection('sensor_readings').orderBy('timestamp', 'desc');

//     if (startDate) {
//       query = query.where('timestamp', '>=', startDate);
//     }

//     if (endDate) {
//       query = query.where('timestamp', '<=', endDate);
//     }

//     query = query.limit(parseInt(limit));

//     const snapshot = await query.get();
//     const data = [];

//     snapshot.forEach(doc => {
//       data.push({
//         id: doc.id,
//         ...doc.data()
//       });
//     });

//     res.json({
//       success: true,
//       data: data,
//       count: data.length
//     });

//   } catch (error) {
//     console.error('Error fetching all sensor data:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch all sensor data'
//     });
//   }
// });


// Get latest sensor reading for a plant
app.get('/api/sensor-data/:plantName/latest', async (req, res) => {
  try {
    const { plantName } = req.params;
    
    const snapshot = await db.collection('sensor_readings')
      .where('plant_name', '==', plantName)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        error: 'No data found for this plant'
      });
    }
    
    const doc = snapshot.docs[0];
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
    
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest sensor data'
    });
  }
});


// Health check route
app.get('/health', (req, res) => {
  res.send('Server is healthy');
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

