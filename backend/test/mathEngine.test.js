import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMathematicalPrediction, calculatePlanetaryPositions } from '../src/jyotish/mathEngine.js';

test('Planetary Calculation calculates sidereal positions correctly', () => {
  const chart = calculatePlanetaryPositions('1995-05-15', '10:30', 28.6139, 77.2090);
  assert.ok(chart.lagna);
  assert.ok(chart.positions.Sun);
  assert.ok(chart.positions.Moon);
  assert.ok(chart.positions.Jupiter);
  assert.ok(chart.positions.Saturn);
});

test('Mathematical prediction engine outputs non-empty rules and score', () => {
  const result = generateMathematicalPrediction({
    dob: '1995-05-15',
    tob: '10:30',
    lat: 28.6139,
    lng: 77.2090,
    timeframe: 'next_3_months',
    category: 'career'
  });

  assert.equal(result.meta.categoryLabel, 'CAREER');
  assert.equal(result.meta.timeframeLabel, 'Next 3 Months');
  assert.ok(result.meta.mathematicalScore > 0);
  assert.ok(result.planetaryImpacts.length > 0);
});
