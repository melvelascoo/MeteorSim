/**
 * Mitigation Service
 * Simulates asteroid deflection strategies
 */

export type MitigationStrategy =
  | 'none'
  | 'kinetic_impactor'
  | 'nuclear_device'
  | 'gravity_tractor'
  | 'ion_beam';

export interface MitigationResult {
  strategy: MitigationStrategy;
  successProbability: number;
  velocityChange: number; // m/s
  trajectoryDeflection: number; // km
  warningTimeNeeded: number; // years
  description: string;
  energyReduction: number; // percentage
}

/**
 * Calculate kinetic impactor effect
 */
function calculateKineticImpactor(
  asteroidMass: number,
  asteroidVelocity: number,
  warningTime: number
): MitigationResult {
  // Spacecraft mass: ~500 kg at 10 km/s
  const spacecraftMass = 500;
  const spacecraftVelocity = 10000; // m/s

  // Momentum transfer efficiency (~1.5 with ejecta)
  const beta = 1.5;

  // Velocity change: Δv = β * (m_sc * v_sc) / m_asteroid
  const velocityChange = beta * (spacecraftMass * spacecraftVelocity) / asteroidMass;

  // Deflection distance after warning time
  const timeSeconds = warningTime * 365.25 * 24 * 3600;
  const trajectoryDeflection = (velocityChange * timeSeconds) / 1000; // km

  // Success probability based on warning time
  const successProbability = Math.min(warningTime / 5, 0.95);

  // Energy reduction (approximate)
  const velocityRatio = velocityChange / (asteroidVelocity * 1000);
  const energyReduction = (2 * velocityRatio - velocityRatio * velocityRatio) * 100;

  return {
    strategy: 'kinetic_impactor',
    successProbability,
    velocityChange,
    trajectoryDeflection,
    warningTimeNeeded: 5,
    energyReduction,
    description: 'High-speed spacecraft collision to change asteroid momentum. Most viable current technology.'
  };
}

/**
 * Calculate nuclear device effect
 */
function calculateNuclearDevice(
  asteroidMass: number,
  asteroidDiameter: number,
  warningTime: number
): MitigationResult {
  // Nuclear yield: 1 megaton
  const yieldJoules = 4.184e15;

  // Energy coupling efficiency (~0.1 for standoff detonation)
  const efficiency = 0.1;

  // Velocity change depends on energy transfer
  const asteroidRadius = asteroidDiameter / 2;
  const surfaceArea = 4 * Math.PI * Math.pow(asteroidRadius, 2);

  // Simplified momentum transfer
  const impulse = efficiency * yieldJoules / 1000;
  const velocityChange = impulse / asteroidMass;

  const timeSeconds = warningTime * 365.25 * 24 * 3600;
  const trajectoryDeflection = (velocityChange * timeSeconds) / 1000;

  const successProbability = Math.min(warningTime / 3, 0.90);

  const energyReduction = Math.min((velocityChange / 1000) * 50, 15);

  return {
    strategy: 'nuclear_device',
    successProbability,
    velocityChange,
    trajectoryDeflection,
    warningTimeNeeded: 3,
    energyReduction,
    description: 'Nuclear standoff burst to vaporize surface material and create thrust. High-risk, high-reward option.'
  };
}

/**
 * Calculate gravity tractor effect
 */
function calculateGravityTractor(
  asteroidMass: number,
  warningTime: number
): MitigationResult {
  // Spacecraft mass: 1000 kg
  const spacecraftMass = 1000;

  // Gravitational constant
  const G = 6.674e-11;

  // Typical hovering distance: 100 m
  const distance = 100;

  // Force: F = G * m1 * m2 / r²
  const force = (G * spacecraftMass * asteroidMass) / Math.pow(distance, 2);

  // Acceleration: a = F / m
  const acceleration = force / asteroidMass;

  // Operating time (years converted to seconds)
  const operatingTime = warningTime * 365.25 * 24 * 3600;

  // Velocity change: Δv = a * t
  const velocityChange = acceleration * operatingTime;

  const trajectoryDeflection = (velocityChange * operatingTime) / 2000; // km

  const successProbability = Math.min(warningTime / 10, 0.85);

  const energyReduction = Math.min((velocityChange / 100) * 5, 8);

  return {
    strategy: 'gravity_tractor',
    successProbability,
    velocityChange,
    trajectoryDeflection,
    warningTimeNeeded: 10,
    energyReduction,
    description: 'Spacecraft uses gravitational attraction to slowly pull asteroid off course. Requires very long warning time.'
  };
}

/**
 * Calculate ion beam shepherd effect
 */
function calculateIonBeam(
  asteroidMass: number,
  asteroidDiameter: number,
  warningTime: number
): MitigationResult {
  // Ion beam thrust: ~0.5 N
  const thrust = 0.5;

  // Operating efficiency
  const efficiency = 0.7;

  // Effective thrust
  const effectiveThrust = thrust * efficiency;

  // Acceleration
  const acceleration = effectiveThrust / asteroidMass;

  // Operating time
  const operatingTime = warningTime * 365.25 * 24 * 3600;

  // Velocity change
  const velocityChange = acceleration * operatingTime;

  const trajectoryDeflection = (velocityChange * operatingTime) / 2000;

  const successProbability = Math.min(warningTime / 8, 0.80);

  const energyReduction = Math.min((velocityChange / 100) * 6, 10);

  return {
    strategy: 'ion_beam',
    successProbability,
    velocityChange,
    trajectoryDeflection,
    warningTimeNeeded: 8,
    energyReduction,
    description: 'Ion beam directed at asteroid surface to create ablation thrust. Experimental but promising technology.'
  };
}

/**
 * Main mitigation calculation
 */
export function calculateMitigation(
  strategy: MitigationStrategy,
  asteroidMass: number,
  asteroidDiameter: number,
  asteroidVelocity: number,
  warningTime: number
): MitigationResult | null {
  if (strategy === 'none') {
    return null;
  }

  switch (strategy) {
    case 'kinetic_impactor':
      return calculateKineticImpactor(asteroidMass, asteroidVelocity, warningTime);

    case 'nuclear_device':
      return calculateNuclearDevice(asteroidMass, asteroidDiameter, warningTime);

    case 'gravity_tractor':
      return calculateGravityTractor(asteroidMass, warningTime);

    case 'ion_beam':
      return calculateIonBeam(asteroidMass, asteroidDiameter, warningTime);

    default:
      return null;
  }
}

/**
 * Get all available strategies with descriptions
 */
export function getAllStrategies() {
  return [
    {
      id: 'none',
      name: 'No Mitigation',
      description: 'Natural impact scenario without intervention'
    },
    {
      id: 'kinetic_impactor',
      name: 'Kinetic Impactor',
      description: 'High-speed spacecraft collision (DART mission style)',
      warningTime: '5+ years',
      techLevel: 'Current Technology'
    },
    {
      id: 'nuclear_device',
      name: 'Nuclear Standoff Burst',
      description: 'Nuclear detonation near asteroid surface',
      warningTime: '3+ years',
      techLevel: 'Available Technology'
    },
    {
      id: 'gravity_tractor',
      name: 'Gravity Tractor',
      description: 'Spacecraft gravitational pull over long duration',
      warningTime: '10+ years',
      techLevel: 'Experimental'
    },
    {
      id: 'ion_beam',
      name: 'Ion Beam Shepherd',
      description: 'Focused ion beam ablation',
      warningTime: '8+ years',
      techLevel: 'Experimental'
    }
  ];
}
