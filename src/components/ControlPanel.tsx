/**
 * Control Panel Component
 */

import { useState, useEffect } from 'react';
import { Settings, Rocket, Target, Gauge, MapPin } from 'lucide-react';
import { NASAAsteroid } from '../services/nasaService';
import { MitigationStrategy } from '../services/mitigationService';

interface ControlPanelProps {
  diameter: number;
  velocity: number;
  angle: number;
  impactLat: number;
  impactLon: number;
  mitigation: MitigationStrategy;
  warningTime: number;
  onDiameterChange: (value: number) => void;
  onVelocityChange: (value: number) => void;
  onAngleChange: (value: number) => void;
  onImpactLatChange: (value: number) => void;
  onImpactLonChange: (value: number) => void;
  onMitigationChange: (value: MitigationStrategy) => void;
  onWarningTimeChange: (value: number) => void;
  onLoadPreset?: (asteroid: NASAAsteroid) => void;
  asteroids?: NASAAsteroid[];
}

export default function ControlPanel({
  diameter,
  velocity,
  angle,
  impactLat,
  impactLon,
  mitigation,
  warningTime,
  onDiameterChange,
  onVelocityChange,
  onAngleChange,
  onImpactLatChange,
  onImpactLonChange,
  onMitigationChange,
  onWarningTimeChange,
  onLoadPreset,
  asteroids = []
}: ControlPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div
        className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5" />
          <h2 className="text-lg font-bold">Simulation Controls</h2>
        </div>
        <button className="text-white hover:text-gray-300">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {asteroids.length > 0 && onLoadPreset && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Rocket className="w-4 h-4 inline mr-1" />
                Load Real Asteroid Data
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const asteroid = asteroids.find(a => a.id === e.target.value);
                  if (asteroid && onLoadPreset) {
                    onLoadPreset(asteroid);
                  }
                }}
              >
                <option value="">Select an asteroid...</option>
                {asteroids.map(ast => (
                  <option key={ast.id} value={ast.id}>
                    {ast.name} ({ast.estimatedDiameter.average.toFixed(0)}m, {ast.velocity.toFixed(1)} km/s)
                    {ast.isPotentiallyHazardous ? ' ⚠️' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Asteroid Diameter: <span className="text-blue-600">{diameter.toFixed(0)} m</span>
            </label>
            <input
              type="range"
              min="10"
              max="10000"
              step="10"
              value={diameter}
              onChange={(e) => onDiameterChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10m</span>
              <span>1km</span>
              <span>10km</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Gauge className="w-4 h-4 inline mr-1" />
              Impact Velocity: <span className="text-blue-600">{velocity.toFixed(1)} km/s</span>
            </label>
            <input
              type="range"
              min="5"
              max="70"
              step="0.5"
              value={velocity}
              onChange={(e) => onVelocityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 km/s</span>
              <span>30 km/s</span>
              <span>70 km/s</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Entry Angle: <span className="text-blue-600">{angle.toFixed(0)}°</span>
            </label>
            <input
              type="range"
              min="15"
              max="90"
              step="5"
              value={angle}
              onChange={(e) => onAngleChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Grazing (15°)</span>
              <span>Vertical (90°)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Latitude: <span className="text-blue-600">{impactLat.toFixed(1)}°</span>
              </label>
              <input
                type="range"
                min="-90"
                max="90"
                step="1"
                value={impactLat}
                onChange={(e) => onImpactLatChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude: <span className="text-blue-600">{impactLon.toFixed(1)}°</span>
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={impactLon}
                onChange={(e) => onImpactLonChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🛡️ Mitigation Strategy
            </label>
            <select
              value={mitigation}
              onChange={(e) => onMitigationChange(e.target.value as MitigationStrategy)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">No Mitigation</option>
              <option value="kinetic_impactor">Kinetic Impactor (DART-style)</option>
              <option value="nuclear_device">Nuclear Standoff Burst</option>
              <option value="gravity_tractor">Gravity Tractor</option>
              <option value="ion_beam">Ion Beam Shepherd</option>
            </select>
          </div>

          {mitigation !== 'none' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ⏰ Warning Time: <span className="text-blue-600">{warningTime} years</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={warningTime}
                onChange={(e) => onWarningTimeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span>10 years</span>
                <span>20 years</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <p className="text-gray-700">
              💡 <strong>Tip:</strong> Adjust the parameters above or click on the map to change the impact location.
              The simulation updates in real-time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
