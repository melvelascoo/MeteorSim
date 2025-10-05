/**
 * NASA NEO (Near Earth Object) API Service
 * Fetches real asteroid data from NASA's API
 */

const NASA_API_KEY = 'DEMO_KEY'; // Public demo key, rate limited
const NASA_NEO_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export interface NASAAsteroid {
  id: string;
  name: string;
  estimatedDiameter: {
    min: number;
    max: number;
    average: number;
  };
  velocity: number; // km/s
  closeApproachDate: string;
  isPotentiallyHazardous: boolean;
  absoluteMagnitude: number;
}

/**
 * Fetch asteroids approaching Earth
 */
export async function fetchNearEarthAsteroids(
  startDate?: string,
  endDate?: string
): Promise<NASAAsteroid[]> {
  try {
    // Use current date if not provided
    const today = new Date();
    const start = startDate || today.toISOString().split('T')[0];

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    const end = endDate || sevenDaysLater.toISOString().split('T')[0];

    const url = `${NASA_NEO_BASE_URL}/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();
    const asteroids: NASAAsteroid[] = [];

    // Parse NASA data format
    for (const date in data.near_earth_objects) {
      const dateObjects = data.near_earth_objects[date];

      for (const neo of dateObjects) {
        const diameterData = neo.estimated_diameter.meters;
        const closeApproach = neo.close_approach_data[0];

        asteroids.push({
          id: neo.id,
          name: neo.name,
          estimatedDiameter: {
            min: diameterData.estimated_diameter_min,
            max: diameterData.estimated_diameter_max,
            average: (diameterData.estimated_diameter_min + diameterData.estimated_diameter_max) / 2
          },
          velocity: parseFloat(closeApproach.relative_velocity.kilometers_per_second),
          closeApproachDate: closeApproach.close_approach_date,
          isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
          absoluteMagnitude: neo.absolute_magnitude_h
        });
      }
    }

    return asteroids;
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    return getMockAsteroids();
  }
}

/**
 * Fetch a single asteroid by ID
 */
export async function fetchAsteroidById(id: string): Promise<NASAAsteroid | null> {
  try {
    const url = `${NASA_NEO_BASE_URL}/neo/${id}?api_key=${NASA_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const neo = await response.json();
    const diameterData = neo.estimated_diameter.meters;
    const closeApproach = neo.close_approach_data[0];

    return {
      id: neo.id,
      name: neo.name,
      estimatedDiameter: {
        min: diameterData.estimated_diameter_min,
        max: diameterData.estimated_diameter_max,
        average: (diameterData.estimated_diameter_min + diameterData.estimated_diameter_max) / 2
      },
      velocity: parseFloat(closeApproach.relative_velocity.kilometers_per_second),
      closeApproachDate: closeApproach.close_approach_date,
      isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
      absoluteMagnitude: neo.absolute_magnitude_h
    };
  } catch (error) {
    console.error('Error fetching asteroid:', error);
    return null;
  }
}

/**
 * Mock asteroids for offline or demo mode
 */
function getMockAsteroids(): NASAAsteroid[] {
  return [
    {
      id: '2099942',
      name: 'Apophis',
      estimatedDiameter: {
        min: 310,
        max: 340,
        average: 325
      },
      velocity: 7.42,
      closeApproachDate: '2029-04-13',
      isPotentiallyHazardous: true,
      absoluteMagnitude: 19.7
    },
    {
      id: '2101955',
      name: 'Bennu',
      estimatedDiameter: {
        min: 490,
        max: 492,
        average: 491
      },
      velocity: 6.3,
      closeApproachDate: '2135-09-25',
      isPotentiallyHazardous: true,
      absoluteMagnitude: 20.9
    },
    {
      id: '433',
      name: 'Eros',
      estimatedDiameter: {
        min: 16800,
        max: 17000,
        average: 16900
      },
      velocity: 23.5,
      closeApproachDate: '2056-01-31',
      isPotentiallyHazardous: false,
      absoluteMagnitude: 10.4
    },
    {
      id: '99942',
      name: '2004 MN4',
      estimatedDiameter: {
        min: 210,
        max: 280,
        average: 245
      },
      velocity: 12.6,
      closeApproachDate: '2029-04-13',
      isPotentiallyHazardous: true,
      absoluteMagnitude: 19.7
    },
    {
      id: '162173',
      name: 'Ryugu',
      estimatedDiameter: {
        min: 900,
        max: 920,
        average: 910
      },
      velocity: 8.9,
      closeApproachDate: '2076-12-05',
      isPotentiallyHazardous: false,
      absoluteMagnitude: 19.2
    }
  ];
}

/**
 * Get famous historical impact scenarios
 */
export function getHistoricalImpacts() {
  return [
    {
      name: 'Chicxulub (Dinosaur Extinction)',
      diameter: 10000,
      velocity: 20,
      location: { lat: 21.3, lon: -89.5 },
      energy: 100000000 // 100 million megatons
    },
    {
      name: 'Tunguska Event',
      diameter: 60,
      velocity: 15,
      location: { lat: 60.9, lon: 101.9 },
      energy: 15 // 15 megatons
    },
    {
      name: 'Chelyabinsk Meteor',
      diameter: 20,
      velocity: 19,
      location: { lat: 55.1, lon: 61.4 },
      energy: 0.5 // 500 kilotons
    },
    {
      name: 'Barringer Crater',
      diameter: 50,
      velocity: 12.8,
      location: { lat: 35.0, lon: -111.0 },
      energy: 10 // 10 megatons
    }
  ];
}
