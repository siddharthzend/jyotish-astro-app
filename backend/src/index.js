import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateMathematicalPrediction } from './jyotish/mathEngine.js';
import { refinePredictionWithAI } from './services/geminiService.js';
import { initDatabase, savePrediction, getRecentPredictions } from './services/dbService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Connection
initDatabase();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: process.env.NODE_ENV || 'dev',
    timestamp: new Date().toISOString()
  });
});

// Predict Endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { fullName, contact, dob, tob, pob, timeframe, category, lat, lng } = req.body;

    if (!fullName || !contact || !dob || !tob || !pob || !timeframe || !category) {
      return res.status(400).json({ error: 'All input details are required.' });
    }

    // 1. In-App Mathematical Jyotish Calculation
    const mathResult = generateMathematicalPrediction({
      dob,
      tob,
      lat: lat || 28.6139,
      lng: lng || 77.2090,
      timeframe,
      category
    });

    // 2. Refine output with Google Gemini AI (preserving core math meaning)
    const refinedPrediction = await refinePredictionWithAI({
      userName: fullName,
      category,
      timeframe,
      mathResult
    });

    // Short summary snippet for fast UI display & database saving
    const shortSummary = `Lagna: ${mathResult.chartData.lagna} | Moon: ${mathResult.chartData.moonSign} (${mathResult.chartData.moonNakshatra}). Score: ${mathResult.meta.mathematicalScore}%`;

    // 3. Save User details, Query & Response to Database
    const savedRecord = await savePrediction({
      fullName,
      contact,
      dob,
      tob,
      pob,
      timeframe,
      category,
      shortResponse: shortSummary,
      fullResponse: refinedPrediction
    });

    return res.json({
      success: true,
      data: {
        recordId: savedRecord.id,
        fullName,
        timeframe,
        category,
        mathResult,
        shortSummary,
        predictionText: refinedPrediction
      }
    });

  } catch (error) {
    console.error('Prediction endpoint error:', error);
    return res.status(500).json({ error: 'Internal Server Error during astrology prediction.' });
  }
});

// History Endpoint
app.get('/api/history', async (req, res) => {
  try {
    const history = await getRecentPredictions(10);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Jyotish Backend Server running on port ${PORT} [Env: ${process.env.NODE_ENV || 'dev'}]`);
});
