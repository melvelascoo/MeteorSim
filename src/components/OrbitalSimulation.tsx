/**
 * 3D Orbital Simulation Component
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OrbitalSimulationProps {
  asteroidDiameter: number;
  velocity: number;
  angle: number;
  impactLat: number;
  impactLon: number;
  mitigationApplied: boolean;
}

export default function OrbitalSimulation({
  asteroidDiameter,
  velocity,
  angle,
  impactLat,
  impactLon,
  mitigationApplied
}: OrbitalSimulationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    earth?: THREE.Mesh;
    asteroid?: THREE.Mesh;
    trajectory?: THREE.Line;
    mitigatedTrajectory?: THREE.Line;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.set(0, 300, 600);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(500, 200, 500);
    scene.add(sunLight);

    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      emissive: 0x112244,
      specular: 0x333333,
      shininess: 25
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(105, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x6ba3ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const stars = createStarField();
    scene.add(stars);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      earth
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const { scene, camera, renderer, earth } = sceneRef.current;
    if (!scene || !camera || !renderer || !earth) return;

    if (sceneRef.current.asteroid) {
      scene.remove(sceneRef.current.asteroid);
    }
    if (sceneRef.current.trajectory) {
      scene.remove(sceneRef.current.trajectory);
    }
    if (sceneRef.current.mitigatedTrajectory) {
      scene.remove(sceneRef.current.mitigatedTrajectory);
    }

    const asteroidScale = Math.log(asteroidDiameter + 1) * 2;
    const asteroidGeometry = new THREE.SphereGeometry(asteroidScale, 16, 16);
    const asteroidMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b7355,
      emissive: 0x332211
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    const impactPoint = latLonToCartesian(impactLat, impactLon, 100);

    const trajectoryPoints: THREE.Vector3[] = [];
    const startDistance = 500;
    const angleRad = (angle * Math.PI) / 180;

    const direction = new THREE.Vector3()
      .subVectors(impactPoint, new THREE.Vector3(0, 0, 0))
      .normalize();

    const perpendicular = new THREE.Vector3(
      -direction.y,
      direction.x,
      0
    ).normalize();

    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const distance = startDistance * (1 - t);
      const heightFactor = Math.sin(angleRad) * distance * 0.3;

      const point = new THREE.Vector3()
        .copy(impactPoint)
        .add(direction.clone().multiplyScalar(-distance))
        .add(perpendicular.clone().multiplyScalar(heightFactor));

      trajectoryPoints.push(point);
    }

    const trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(trajectoryPoints);
    const trajectoryMaterial = new THREE.LineBasicMaterial({
      color: 0xff3333,
      linewidth: 2
    });
    const trajectory = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
    scene.add(trajectory);

    if (mitigationApplied) {
      const mitigatedPoints: THREE.Vector3[] = [];
      const deflectionAngle = 5 * (Math.PI / 180);

      const deflectionAxis = new THREE.Vector3(0, 0, 1);
      const rotationMatrix = new THREE.Matrix4().makeRotationAxis(deflectionAxis, deflectionAngle);

      for (let i = 0; i <= 100; i++) {
        const t = i / 100;

        if (t < 0.5) {
          mitigatedPoints.push(trajectoryPoints[i].clone());
        } else {
          const originalPoint = trajectoryPoints[i].clone();
          const deflectedPoint = originalPoint.applyMatrix4(rotationMatrix);
          mitigatedPoints.push(deflectedPoint);
        }
      }

      const mitigatedGeometry = new THREE.BufferGeometry().setFromPoints(mitigatedPoints);
      const mitigatedMaterial = new THREE.LineBasicMaterial({
        color: 0x33ff33,
        linewidth: 2
      });
      const mitigatedTrajectory = new THREE.Line(mitigatedGeometry, mitigatedMaterial);
      scene.add(mitigatedTrajectory);
      sceneRef.current.mitigatedTrajectory = mitigatedTrajectory;
    }

    scene.add(asteroid);
    sceneRef.current.asteroid = asteroid;
    sceneRef.current.trajectory = trajectory;

    let animationProgress = 0;
    const animate = () => {
      earth.rotation.y += 0.001;

      animationProgress += 0.003;
      if (animationProgress > 1) animationProgress = 0;

      const currentIndex = Math.floor(animationProgress * trajectoryPoints.length);
      if (currentIndex < trajectoryPoints.length) {
        const targetPoints = mitigationApplied && sceneRef.current.mitigatedTrajectory
          ? (sceneRef.current.mitigatedTrajectory.geometry as THREE.BufferGeometry).attributes.position
          : trajectoryPoints;

        if (Array.isArray(targetPoints)) {
          asteroid.position.copy(targetPoints[currentIndex]);
        } else {
          asteroid.position.set(
            targetPoints.getX(currentIndex),
            targetPoints.getY(currentIndex),
            targetPoints.getZ(currentIndex)
          );
        }
      }

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
    };
  }, [asteroidDiameter, velocity, angle, impactLat, impactLon, mitigationApplied]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded text-xs z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span>Original Trajectory</span>
          </div>
          {mitigationApplied && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span>Mitigated Trajectory</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-gray-400">Velocity: {velocity.toFixed(1)} km/s</p>
        <p className="text-gray-400">Angle: {angle.toFixed(0)}°</p>
      </div>
    </div>
  );
}

function latLonToCartesian(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

function createStarField(): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < 3000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    vertices.push(x, y, z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true
  });

  return new THREE.Points(geometry, material);
}
