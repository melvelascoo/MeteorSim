/**
 * Impact Calculations Service
 * Provides scientific calculations for asteroid impact simulations
 */

const ASTEROID_DENSITY = 3000; // kg/m³ (average asteroid density)
const TNT_ENERGY = 4.184e9; // Joules per kiloton
const EARTH_OCEAN_COVERAGE = 0.71; // 71% of Earth is ocean

export interface AsteroidData {
  diameter: number; // meters
  velocity: number; // km/s
  angle: number; // degrees
  impactLat: number;
  impactLon: number;
}

export interface ImpactResults {
  mass: number; // kg
  energy: number; // megatons TNT
  craterDiameter: number; // km
  craterDepth: number; // km
  shockwaveRadius: number; // km
  seismicMagnitude: number;
  thermalRadius: number; // km
  isOceanImpact: boolean;
  tsunamiHeight?: number; // meters (if ocean impact)
  affectedPopulation: number;
}

/**
 * Calculate asteroid mass based on diameter
 */
export function calculateMass(diameter: number): number {
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  return volume * ASTEROID_DENSITY;
}

/**
 * Calculate impact energy in megatons of TNT
 */
export function calculateEnergy(mass: number, velocity: number): number {
  // Convert velocity from km/s to m/s
  const velocityMs = velocity * 1000;

  // Kinetic energy: E = 1/2 * m * v²
  const energyJoules = 0.5 * mass * Math.pow(velocityMs, 2);

  // Convert to megatons of TNT
  const energyKilotons = energyJoules / TNT_ENERGY;
  const energyMegatons = energyKilotons / 1000;

  return energyMegatons;
}

/**
 * Calculate crater diameter using empirical formula
 * Based on Collins et al. (2005) scaling relationships
 */
export function calculateCraterDiameter(
  energy: number,
  velocity: number,
  angle: number,
  isOcean: boolean
): number {
  // Convert energy from megatons to joules
  const energyJoules = energy * 1e6 * TNT_ENERGY;

  // Adjust for impact angle (vertical = 90°, grazing = 0°)
  const angleRadians = (angle * Math.PI) / 180;
  const angleEfficiency = Math.pow(Math.sin(angleRadians), 1/3);

  // Different scaling for land vs ocean impacts
  const terrainFactor = isOcean ? 0.8 : 1.0;

  // Empirical crater scaling formula
  // D = C * (E^0.22) * efficiency * terrain
  const scalingConstant = 1.8e-3;
  const diameter = scalingConstant * Math.pow(energyJoules, 0.22) * angleEfficiency * terrainFactor;

  return diameter / 1000; // Convert to km
}

/**
 * Calculate crater depth (typically 1/5 to 1/3 of diameter)
 */
export function calculateCraterDepth(diameter: number): number {
  return diameter / 4;
}

/**
 * Calculate shockwave radius (severe damage zone)
 */
export function calculateShockwaveRadius(energy: number): number {
  // Overpressure of 20 psi (severe structural damage)
  // Scaling based on nuclear explosion models
  return Math.pow(energy, 0.33) * 2.5;
}

/**
 * Calculate thermal radiation radius (3rd degree burns)
 */
export function calculateThermalRadius(energy: number): number {
  return Math.pow(energy, 0.41) * 3.2;
}

/**
 * Estimate seismic magnitude
 */
export function calculateSeismicMagnitude(energy: number): number {
  // Richter scale correlation with energy
  // M = (2/3) * log10(E) - 2.9
  const energyJoules = energy * 1e6 * TNT_ENERGY;
  return (2/3) * Math.log10(energyJoules) - 2.9;
}

/**
 * Determine if impact location is in ocean
 */
export function isOceanImpact(lat: number, lon: number): boolean {
  // Simplified ocean detection
  // Major oceans: Pacific, Atlantic, Indian

  // Pacific Ocean
  if (lon > 120 || lon < -70) {
    if (Math.abs(lat) < 60) return true;
  }

  // Atlantic Ocean
  if (lon > -70 && lon < -10) {
    if (Math.abs(lat) < 60) return true;
  }

  // Indian Ocean
  if (lon > 40 && lon < 120 && lat < 20 && lat > -50) {
    return true;
  }

  // Use random probability based on Earth's ocean coverage for unknown areas
  return Math.random() < EARTH_OCEAN_COVERAGE;
}

/**
 * Calculate tsunami wave height for ocean impacts
 */
export function calculateTsunamiHeight(
  energy: number,
  craterDiameter: number,
  waterDepth: number = 4000 // average ocean depth in meters
): number {
  // Simplified tsunami model
  // Wave height scales with energy and crater size
  const energyFactor = Math.pow(energy, 0.25);
  const craterFactor = craterDiameter * 1000; // convert to meters

  // Initial wave height at impact
  const initialHeight = Math.min(craterFactor / 10, waterDepth * 0.5);

  return initialHeight * energyFactor * 0.1;
}

/**
 * Estimate affected population (simplified model)
 */
export function estimateAffectedPopulation(
  lat: number,
  lon: number,
  shockwaveRadius: number,
  thermalRadius: number
): number {
  // Population density map (simplified)
  const populationDensities: { [key: string]: number } = {
    'north_america': 25,
    'south_america': 23,
    'europe': 73,
    'africa': 45,
    'asia': 150,
    'oceania': 5,
    'ocean': 0
  };

  // Determine region based on coordinates
  let region = 'ocean';

  if (Math.abs(lat) < 60) {
    if (lon > -130 && lon < -60 && lat > 15) region = 'north_america';
    else if (lon > -80 && lon < -35 && lat < 15) region = 'south_america';
    else if (lon > -10 && lon < 40 && lat > 35) region = 'europe';
    else if (lon > -20 && lon < 50 && lat < 35 && lat > -35) region = 'africa';
    else if (lon > 40 && lon < 150) region = 'asia';
    else if (lon > 110 && lon < 180 && lat < -10) region = 'oceania';
  }

  const density = populationDensities[region] || 0;
  const affectedArea = Math.PI * Math.pow(Math.max(shockwaveRadius, thermalRadius), 2);

  return Math.round(density * affectedArea);
}

/**
 * Main calculation function
 */
export function calculateImpact(data: AsteroidData): ImpactResults {
  const mass = calculateMass(data.diameter);
  const energy = calculateEnergy(mass, data.velocity);
  const isOcean = isOceanImpact(data.impactLat, data.impactLon);
  const craterDiameter = calculateCraterDiameter(energy, data.velocity, data.angle, isOcean);
  const craterDepth = calculateCraterDepth(craterDiameter);
  const shockwaveRadius = calculateShockwaveRadius(energy);
  const thermalRadius = calculateThermalRadius(energy);
  const seismicMagnitude = calculateSeismicMagnitude(energy);

  const results: ImpactResults = {
    mass,
    energy,
    craterDiameter,
    craterDepth,
    shockwaveRadius,
    thermalRadius,
    seismicMagnitude,
    isOceanImpact: isOcean,
    affectedPopulation: estimateAffectedPopulation(
      data.impactLat,
      data.impactLon,
      shockwaveRadius,
      thermalRadius
    )
  };

  if (isOcean) {
    results.tsunamiHeight = calculateTsunamiHeight(energy, craterDiameter);
  }

  return results;
}
