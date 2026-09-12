import * as Astronomy from 'astronomy-engine';

// Vedic Rashis in English and Sanskrit
const RASHIS = [
  { id: 1, name: "Aries", sanskrit: "Mesha", lord: "Mars", element: "Fire" },
  { id: 2, name: "Taurus", sanskrit: "Vrishabha", lord: "Venus", element: "Earth" },
  { id: 3, name: "Gemini", sanskrit: "Mithuna", lord: "Mercury", element: "Air" },
  { id: 4, name: "Cancer", sanskrit: "Karka", lord: "Moon", element: "Water" },
  { id: 5, name: "Leo", sanskrit: "Simha", lord: "Sun", element: "Fire" },
  { id: 6, name: "Virgo", sanskrit: "Kanya", lord: "Mercury", element: "Earth" },
  { id: 7, name: "Libra", sanskrit: "Tula", lord: "Venus", element: "Air" },
  { id: 8, name: "Scorpio", sanskrit: "Vrishchika", lord: "Mars", element: "Water" },
  { id: 9, name: "Sagittarius", sanskrit: "Dhanu", lord: "Jupiter", element: "Fire" },
  { id: 10, name: "Capricorn", sanskrit: "Makara", lord: "Saturn", element: "Earth" },
  { id: 11, name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn", element: "Air" },
  { id: 12, name: "Pisces", sanskrit: "Meena", lord: "Jupiter", element: "Water" }
];

// 27 Nakshatras
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

/**
 * Calculates Lahiri Ayanamsa for given Julian Date
 */
function getLahiriAyanamsa(julianDate) {
  // Approximate Lahiri Ayanamsa formula: 23.85 + (year - 2000) * 0.01396
  const year = 2000 + (julianDate - 2451545.0) / 365.25;
  return 23.85 + (year - 2000) * 0.01396;
}

/**
 * Normalizes an angle in degrees to [0, 360)
 */
function normalizeDegree(deg) {
  let normalized = deg % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Calculates planetary positions using astronomy-engine
 */
export function calculatePlanetaryPositions(dob, tob, lat = 28.6139, lng = 77.2090) {
  const dateTimeStr = `${dob}T${tob}:00.000Z`;
  const dateObj = new Date(dateTimeStr);
  const time = Astronomy.MakeTime(dateObj);
  const ayanamsa = getLahiriAyanamsa(time.ut);

  const bodies = [
    { body: Astronomy.Body.Sun, name: "Sun", lordOf: "Soul/Career" },
    { body: Astronomy.Body.Moon, name: "Moon", lordOf: "Mind/Emotion" },
    { body: Astronomy.Body.Mars, name: "Mars", lordOf: "Energy/Drive" },
    { body: Astronomy.Body.Mercury, name: "Mercury", lordOf: "Intellect/Finance" },
    { body: Astronomy.Body.Jupiter, name: "Jupiter", lordOf: "Wisdom/Expansion" },
    { body: Astronomy.Body.Venus, name: "Venus", lordOf: "Harmony/Wealth" },
    { body: Astronomy.Body.Saturn, name: "Saturn", lordOf: "Discipline/Karma" }
  ];

  const positions = {};

  bodies.forEach(({ body, name, lordOf }) => {
    const vector = Astronomy.GeoVector(body, time, true);
    const ecliptic = Astronomy.Ecliptic(vector);
    const tropicalDeg = ecliptic.elon;
    const siderealDeg = normalizeDegree(tropicalDeg - ayanamsa);

    const rashiIndex = Math.floor(siderealDeg / 30);
    const degInRashi = siderealDeg % 30;

    const nakshatraIndex = Math.floor(siderealDeg / (360 / 27));
    const pada = Math.floor((siderealDeg % (360 / 27)) / (360 / 108)) + 1;

    positions[name] = {
      name,
      lordOf,
      tropicalLongitude: tropicalDeg.toFixed(2),
      siderealLongitude: siderealDeg.toFixed(2),
      rashi: RASHIS[rashiIndex],
      degInRashi: degInRashi.toFixed(2),
      nakshatra: NAKSHATRAS[nakshatraIndex],
      pada
    };
  });

  // Approximate Rahu & Ketu (Mean Nodes)
  const moonDeg = parseFloat(positions.Moon.siderealLongitude);
  const rahuDeg = normalizeDegree(360 - ((time.ut - 2451545.0) * 0.05295) % 360);
  const ketuDeg = normalizeDegree(rahuDeg + 180);

  const rahuRashiIdx = Math.floor(rahuDeg / 30);
  const ketuRashiIdx = Math.floor(ketuDeg / 30);

  positions["Rahu"] = {
    name: "Rahu",
    lordOf: "Desire/Ambition",
    siderealLongitude: rahuDeg.toFixed(2),
    rashi: RASHIS[rahuRashiIdx],
    nakshatra: NAKSHATRAS[Math.floor(rahuDeg / (360 / 27))]
  };

  positions["Ketu"] = {
    name: "Ketu",
    lordOf: "Spirituality/Moksha",
    siderealLongitude: ketuDeg.toFixed(2),
    rashi: RASHIS[ketuRashiIdx],
    nakshatra: NAKSHATRAS[Math.floor(ketuDeg / (360 / 27))]
  };

  // Lagna / Ascendant Calculation (Approximate based on LST)
  const lst = (time.ut * 24 + lng / 15) % 24;
  const lagnaDeg = normalizeDegree(lst * 15 - ayanamsa);
  const lagnaRashiIdx = Math.floor(lagnaDeg / 30);
  const lagna = RASHIS[lagnaRashiIdx];

  return {
    birthDetails: { dob, tob, lat, lng },
    ayanamsa: ayanamsa.toFixed(2),
    lagna,
    positions
  };
}

/**
 * Generates Mathematical Jyotish Prediction Score & Key Rules
 */
export function generateMathematicalPrediction({ dob, tob, lat, lng, timeframe, category }) {
  const chart = calculatePlanetaryPositions(dob, tob, lat, lng);
  const moonRashi = chart.positions.Moon.rashi;
  const sunRashi = chart.positions.Sun.rashi;
  const jupiterRashi = chart.positions.Jupiter.rashi;
  const saturnRashi = chart.positions.Saturn.rashi;
  const lagnaRashi = chart.lagna;

  let mathematicalRules = [];
  let planetaryImpacts = [];
  let score = 75; // Baseline score out of 100

  // Category specific mathematical logic
  if (category === 'career') {
    planetaryImpacts.push(`Sun in ${sunRashi.sanskrit} (${sunRashi.element} element) governs your professional authority and core leadership.`);
    planetaryImpacts.push(`Saturn in ${saturnRashi.sanskrit} influences hard work, career perseverance, and long-term stability.`);
    if (jupiterRashi.element === sunRashi.element) {
      score += 15;
      mathematicalRules.push("Benefic Jupiter aspecting career indicators signals rapid growth and recognition.");
    } else {
      score += 5;
      mathematicalRules.push("Steady effort required; persistent discipline yields solid results.");
    }
  } else if (category === 'finance') {
    planetaryImpacts.push(`Jupiter in ${jupiterRashi.sanskrit} acts as the Karaka for wealth, expansion, and prosperity.`);
    planetaryImpacts.push(`Mercury in ${chart.positions.Mercury.rashi.sanskrit} governs financial intellect, trade, and decision-making.`);
    if (chart.positions.Venus.rashi.element === 'Earth' || chart.positions.Venus.rashi.element === 'Water') {
      score += 12;
      mathematicalRules.push("Strong Venus placement indicates favorable financial liquidity and asset accumulation.");
    } else {
      score += 8;
      mathematicalRules.push("Financial growth is steady; focus on structured savings and prudent investments.");
    }
  } else if (category === 'health') {
    planetaryImpacts.push(`Lagna in ${lagnaRashi.sanskrit} (${lagnaRashi.element} element) defines physical stamina and vitality.`);
    planetaryImpacts.push(`Mars in ${chart.positions.Mars.rashi.sanskrit} influences immune strength, energy levels, and physical drive.`);
    if (lagnaRashi.element === 'Fire' || lagnaRashi.element === 'Air') {
      score += 10;
      mathematicalRules.push("High energy levels present; maintain balanced hydration and routine physical activity.");
    } else {
      score += 7;
      mathematicalRules.push("Peaceful routine and balanced diet will enhance overall vitality and reduce stress.");
    }
  } else { // Overall
    planetaryImpacts.push(`Moon in ${moonRashi.sanskrit} (${moonRashi.nakshatra} Nakshatra) dictates emotional peace and mind state.`);
    planetaryImpacts.push(`Jupiter in ${jupiterRashi.sanskrit} provides overarching protection and divine grace.`);
    score += 10;
    mathematicalRules.push("Harmonious blend of planetary transits brings holistic balance across personal and spiritual domains.");
  }

  // Timeframe adjustments
  let timeframeLabel = "Next 3 Months";
  if (timeframe === 'next_1_year') timeframeLabel = "Next 1 Year";
  if (timeframe === 'whole_life') timeframeLabel = "Whole Life Overview";

  return {
    chartData: {
      lagna: lagnaRashi.sanskrit,
      moonSign: moonRashi.sanskrit,
      moonNakshatra: chart.positions.Moon.nakshatra,
      sunSign: sunRashi.sanskrit,
      jupiterSign: jupiterRashi.sanskrit,
      saturnSign: saturnRashi.sanskrit
    },
    meta: {
      timeframeLabel,
      categoryLabel: category.toUpperCase(),
      mathematicalScore: Math.min(score, 98)
    },
    planetaryImpacts,
    mathematicalRules
  };
}
