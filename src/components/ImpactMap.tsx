/**
 * 2D Interactive Impact Map Component
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ImpactMapProps {
  impactLat: number;
  impactLon: number;
  shockwaveRadius: number;
  thermalRadius: number;
  craterDiameter: number;
  isOceanImpact: boolean;
  onLocationChange?: (lat: number, lon: number) => void;
}

export default function ImpactMap({
  impactLat,
  impactLon,
  shockwaveRadius,
  thermalRadius,
  craterDiameter,
  isOceanImpact,
  onLocationChange
}: ImpactMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{
    impact?: L.Marker;
    crater?: L.Circle;
    shockwave?: L.Circle;
    thermal?: L.Circle;
  }>({});

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('impact-map', {
        center: [impactLat, impactLon],
        zoom: 6,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onLocationChange) {
          onLocationChange(e.latlng.lat, e.latlng.lng);
        }
      });

      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    if (markersRef.current.impact) {
      markersRef.current.impact.remove();
    }
    if (markersRef.current.crater) {
      markersRef.current.crater.remove();
    }
    if (markersRef.current.shockwave) {
      markersRef.current.shockwave.remove();
    }
    if (markersRef.current.thermal) {
      markersRef.current.thermal.remove();
    }

    const impactIcon = L.divIcon({
      className: 'impact-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background: ${isOceanImpact ? '#3b82f6' : '#ef4444'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    markersRef.current.impact = L.marker([impactLat, impactLon], {
      icon: impactIcon
    })
      .addTo(map)
      .bindPopup(`
        <b>Impact Point</b><br/>
        ${isOceanImpact ? '🌊 Ocean Impact' : '🏔️ Land Impact'}<br/>
        Lat: ${impactLat.toFixed(2)}°<br/>
        Lon: ${impactLon.toFixed(2)}°
      `);

    markersRef.current.crater = L.circle([impactLat, impactLon], {
      radius: craterDiameter * 500,
      color: '#7c3aed',
      fillColor: '#7c3aed',
      fillOpacity: 0.5,
      weight: 2
    })
      .addTo(map)
      .bindPopup(`<b>Crater</b><br/>Diameter: ${craterDiameter.toFixed(1)} km`);

    markersRef.current.shockwave = L.circle([impactLat, impactLon], {
      radius: shockwaveRadius * 1000,
      color: '#dc2626',
      fillColor: '#dc2626',
      fillOpacity: 0.2,
      weight: 2,
      dashArray: '5, 5'
    })
      .addTo(map)
      .bindPopup(`<b>Severe Damage Zone</b><br/>Radius: ${shockwaveRadius.toFixed(1)} km`);

    markersRef.current.thermal = L.circle([impactLat, impactLon], {
      radius: thermalRadius * 1000,
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '10, 5'
    })
      .addTo(map)
      .bindPopup(`<b>Thermal Radiation Zone</b><br/>Radius: ${thermalRadius.toFixed(1)} km`);

    map.setView([impactLat, impactLon], 6);
  }, [impactLat, impactLon, shockwaveRadius, thermalRadius, craterDiameter, isOceanImpact]);

  return (
    <div className="relative w-full h-full">
      <div id="impact-map" className="w-full h-full rounded-lg" />

      <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-bold text-sm mb-2">Map Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span>Crater Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600 opacity-40"></div>
            <span>Severe Damage (20+ psi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 opacity-30"></div>
            <span>Thermal Radiation (3rd degree burns)</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-600">
          Click anywhere on the map to change impact location
        </p>
      </div>
    </div>
  );
}
