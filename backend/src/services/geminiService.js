import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'your_google_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Refines the mathematical Jyotish prediction using Google Gemini AI.
 * IMPORTANT: Gemini is strictly instructed to keep the exact mathematical astrology facts,
 * planetary positions, and core conclusions unchanged, only enhancing language quality & tone.
 */
export async function refinePredictionWithAI({ userName, category, timeframe, mathResult }) {
  const { chartData, meta, planetaryImpacts, mathematicalRules } = mathResult;

  const prompt = `
You are a highly respected, compassionate Vedic Jyotish Astrologer.
You have performed exact mathematical astronomical calculations for client "${userName}".

Mathematical Kundli Data:
- Lagna (Ascendant): ${chartData.lagna}
- Moon Sign (Rashi): ${chartData.moonSign} (${chartData.moonNakshatra} Nakshatra)
- Sun Sign: ${chartData.sunSign}
- Jupiter Sign: ${chartData.jupiterSign}
- Saturn Sign: ${chartData.saturnSign}
- Prediction Focus: ${meta.categoryLabel} for ${meta.timeframeLabel}
- Mathematical Harmony Score: ${meta.mathematicalScore}%

Planetary Position Rules & Observations:
${planetaryImpacts.map(i => `- ${i}`).join('\n')}
${mathematicalRules.map(r => `- ${r}`).join('\n')}

INSTRUCTIONS:
1. Refine this prediction into polite, highly inspiring, authentic Vedic Astrologer language (Hinglish/English mix).
2. DO NOT change the planetary facts, Lagna, Rashi, or mathematical conclusion score.
3. Keep the output structured with 3 sections:
   - 🌟 **Kundli Insights & Planetary Positions**
   - 🔮 **Astrological Guidance (${meta.categoryLabel} - ${meta.timeframeLabel})**
   - 💡 **Vedic Remedy / Positive Advice**
4. Keep the summary short and impactful.
  `;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      console.warn("Gemini API call warning/fallback:", err.message);
    }
  }

  // Fallback refined text generation if Gemini API is not configured or fails
  return `
🌟 **Kundli Insights & Planetary Positions**
• **Lagna:** ${chartData.lagna} | **Moon Sign:** ${chartData.moonSign} (${chartData.moonNakshatra})
• **Key Transits:** Sun in ${chartData.sunSign}, Jupiter in ${chartData.jupiterSign}, Saturn in ${chartData.saturnSign}.

🔮 **Astrological Guidance (${meta.categoryLabel} - ${meta.timeframeLabel})**
${planetaryImpacts.map(p => `• ${p}`).join('\n')}
${mathematicalRules.map(m => `• ${m}`).join('\n')}

💡 **Vedic Remedy & Guidance**
Maintaining positive daily routines, offering prayers or meditation during Sunrise, and cultivating patience will bring maximum clarity and success during this period.
  `.trim();
}
