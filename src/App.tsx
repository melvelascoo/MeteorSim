import { useState, useEffect } from 'react';
import { Rocket, Info, Save, History } from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import ResultsPanel from './components/ResultsPanel';
import ImpactMap from './components/ImpactMap';
import OrbitalSimulation from './components/OrbitalSimulation';
import { calculateImpact, AsteroidData, ImpactResults } from './services/impactCalculations';
import { calculateMitigation, MitigationStrategy, MitigationResult } from './services/mitigationService';
import { fetchNearEarthAsteroids, NASAAsteroid, getHistoricalImpacts } from './services/nasaService';
import { saveSimulation, loadRecentSimulations, SimulationRecord } from './services/supabaseClient';

export default function App() {
  const [diameter, setDiameter] = useState(500);
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  const [impactLat, setImpactLat] = useState(40.7);
  const [impactLon, setImpactLon] = useState(-74.0);
  const [mitigation, setMitigation] = useState<MitigationStrategy>('none');
  const [warningTime, setWarningTime] = useState(5);
  const [simulationName, setSimulationName] = useState('Custom Simulation');

  const [results, setResults] = useState<ImpactResults | null>(null);
  const [mitigationResults, setMitigationResults] = useState<MitigationResult | null>(null);
  const [asteroids, setAsteroids] = useState<NASAAsteroid[]>([]);
  const [showInfo, setShowInfo] = useState(true);
  const [recentSimulations, setRecentSimulations] = useState<SimulationRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchNearEarthAsteroids().then(data => {
      setAsteroids(data);
    });

    loadRecentSimulations(5).then(data => {
      setRecentSimulations(data);
    });
  }, []);

  useEffect(() => {
    const asteroidData: AsteroidData = {
      diameter,
      velocity,
      angle,
      impactLat,
      impactLon
    };

    const impactResults = calculateImpact(asteroidData);
    setResults(impactResults);

    if (mitigation !== 'none') {
      const mitigationResult = calculateMitigation(
        mitigation,
        impactResults.mass,
        diameter,
        velocity,
        warningTime
      );
      setMitigationResults(mitigationResult);
    } else {
      setMitigationResults(null);
    }
  }, [diameter, velocity, angle, impactLat, impactLon, mitigation, warningTime]);

  const handleLoadPreset = (asteroid: NASAAsteroid) => {
    setDiameter(asteroid.estimatedDiameter.average);
    setVelocity(asteroid.velocity);
    setSimulationName(asteroid.name);
    setAngle(45);
  };

  const handleLoadHistorical = (scenario: any) => {
    setDiameter(scenario.diameter);
    setVelocity(scenario.velocity);
    setImpactLat(scenario.location.lat);
    setImpactLon(scenario.location.lon);
    setSimulationName(scenario.name);
    setAngle(45);
  };

  const handleSaveSimulation = async () => {
    if (!results) return;

    try {
      const record: SimulationRecord = {
        name: simulationName,
        diameter_meters: diameter,
        velocity_km_s: velocity,
        angle_degrees: angle,
        impact_lat: impactLat,
        impact_lon: impactLon,
        mass_kg: results.mass,
        energy_megatons: results.energy,
        crater_diameter_km: results.craterDiameter,
        is_ocean_impact: results.isOceanImpact,
        mitigation_applied: mitigation !== 'none' ? mitigation : undefined
      };

      await saveSimulation(record);
      alert('Simulation saved successfully!');

      const updated = await loadRecentSimulations(5);
      setRecentSimulations(updated);
    } catch (error) {
      alert('Error saving simulation');
    }
  };

  const handleLoadSimulation = (sim: SimulationRecord) => {
    setDiameter(sim.diameter_meters);
    setVelocity(sim.velocity_km_s);
    setAngle(sim.angle_degrees);
    setImpactLat(sim.impact_lat);
    setImpactLon(sim.impact_lon);
    setSimulationName(sim.name);
    if (sim.mitigation_applied) {
      setMitigation(sim.mitigation_applied as MitigationStrategy);
    }
    setShowHistory(false);
  };

  const historicalImpacts = getHistoricalImpacts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-blue-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Asteroid Impact Simulator</h1>
              <p className="text-sm text-blue-300">Real NASA data • Scientific calculations • Interactive 3D</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </button>

            <button
              onClick={handleSaveSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              Info
            </button>
          </div>
        </div>
      </header>

      {showInfo && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-blue-900 bg-opacity-80 backdrop-blur-sm border border-blue-700 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-2">Welcome to the Asteroid Impact Simulator</h2>
                <p className="text-blue-200 mb-3">
                  Explore the devastating effects of asteroid impacts using real NASA data and scientific models.
                  Adjust parameters, test mitigation strategies, and visualize the consequences in real-time.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong className="text-blue-300">🗺️ Interactive Map:</strong>
                    <p className="text-blue-200">Click to change impact location and see damage zones</p>
                  </div>
                  <div>
                    <strong className="text-blue-300">🌌 3D Orbit:</strong>
                    <p className="text-blue-200">Watch the asteroid trajectory and mitigation effects</p>
                  </div>
                  <div>
                    <strong className="text-blue-300">🛡️ Mitigation:</strong>
                    <p className="text-blue-200">Test real deflection strategies like DART mission</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-slate-800 bg-opacity-90 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Historical Impacts & Recent Simulations</h2>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">Famous Historical Impacts</h3>
              <div className="grid grid-cols-2 gap-2">
                {historicalImpacts.map((scenario, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadHistorical(scenario)}
                    className="text-left p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                  >
                    <strong>{scenario.name}</strong>
                    <div className="text-xs text-slate-300 mt-1">
                      {scenario.diameter}m • {scenario.velocity} km/s • {scenario.energy.toLocaleString()} MT
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {recentSimulations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-300 mb-2">Your Recent Simulations</h3>
                <div className="space-y-2">
                  {recentSimulations.map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => handleLoadSimulation(sim)}
                      className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm transition-colors"
                    >
                      <strong>{sim.name}</strong>
                      <div className="text-xs text-slate-300 mt-1">
                        {sim.diameter_meters}m • {sim.velocity_km_s} km/s •
                        {sim.energy_megatons?.toFixed(1)} MT •
                        {sim.is_ocean_impact ? '🌊' : '🏔️'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <ControlPanel
              diameter={diameter}
              velocity={velocity}
              angle={angle}
              impactLat={impactLat}
              impactLon={impactLon}
              mitigation={mitigation}
              warningTime={warningTime}
              onDiameterChange={setDiameter}
              onVelocityChange={setVelocity}
              onAngleChange={setAngle}
              onImpactLatChange={setImpactLat}
              onImpactLonChange={setImpactLon}
              onMitigationChange={setMitigation}
              onWarningTimeChange={setWarningTime}
              onLoadPreset={handleLoadPreset}
              asteroids={asteroids}
            />
          </div>

          <div className="lg:col-span-2">
            {results && (
              <ResultsPanel results={results} mitigation={mitigationResults} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ height: '500px' }}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3">
              <h3 className="font-bold">Impact Map - Damage Zones</h3>
            </div>
            {results && (
              <ImpactMap
                impactLat={impactLat}
                impactLon={impactLon}
                shockwaveRadius={results.shockwaveRadius}
                thermalRadius={results.thermalRadius}
                craterDiameter={results.craterDiameter}
                isOceanImpact={results.isOceanImpact}
                onLocationChange={(lat, lon) => {
                  setImpactLat(lat);
                  setImpactLon(lon);
                }}
              />
            )}
          </div>

          <div className="bg-black rounded-lg shadow-xl overflow-hidden relative" style={{ height: '500px' }}>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3">
              <h3 className="font-bold">3D Orbital Trajectory</h3>
            </div>
            <OrbitalSimulation
              asteroidDiameter={diameter}
              velocity={velocity}
              angle={angle}
              impactLat={impactLat}
              impactLon={impactLon}
              mitigationApplied={mitigation !== 'none'}
            />
          </div>
        </div>
      </main>

      <footer className="bg-black bg-opacity-50 border-t border-blue-800 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-blue-300 text-sm">
          <p className="mb-2">
            Data from NASA NEO API • Calculations based on scientific models • Educational purposes only
          </p>
          <p className="text-xs text-blue-400">
            Impact calculations use empirical formulas from planetary defense research.
            Results are estimates and actual impacts would vary based on many factors.
          </p>
        </div>
      </footer>
    </div>
  );
}
