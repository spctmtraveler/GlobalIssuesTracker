import * as THREE from "three";
import { Feature, DataCategory } from "../types";

// Convert GeoJSON coordinates to 3D positions
export function geoToVector3(lat: number, lon: number, radius: number = 1): THREE.Vector3 {
  // Convert latitude and longitude to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  // Calculate 3D coordinates
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Create a mesh for a country
export function createCountryMesh(feature: Feature, dataValue: number, category: DataCategory): THREE.Mesh {
  // Get color based on data value and category - now always in blue spectrum
  const color = getColorForValue(dataValue, category);
  
  // Create flat circular indicators instead of 3D shapes
  const radius = 0.025 + (dataValue / 100) * 0.015; // Size based on data value
  const geometry = new THREE.CircleGeometry(radius, 16);
  
  // Create material with the color based on data - aquamarine/blue palette
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color).multiplyScalar(0.3),
    transparent: true,
    opacity: 0.9,
    metalness: 0.4,
    roughness: 0.3,
    side: THREE.DoubleSide // Make it visible from both sides
  });
  
  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);
  
  // Position the mesh based on the country centroid
  const centroid = getCountryCentroid(feature);
  const position = geoToVector3(centroid[1], centroid[0], 1.01);
  mesh.position.copy(position);
  
  // Orient the mesh normal to the surface of the globe
  mesh.lookAt(0, 0, 0);
  
  // Set user data for interactions
  mesh.userData = {
    countryCode: feature.properties.ISO_A3,
    countryName: feature.properties.NAME,
    dataValue
  };
  
  return mesh;
}

// Calculate the centroid of a country
function getCountryCentroid(feature: Feature): [number, number] {
  let totalLon = 0;
  let totalLat = 0;
  let pointCount = 0;
  
  if (feature.geometry.type === "Polygon") {
    const coordinates = feature.geometry.coordinates as number[][][];
    coordinates[0].forEach(coord => {
      totalLon += coord[0];
      totalLat += coord[1];
      pointCount++;
    });
  } else if (feature.geometry.type === "MultiPolygon") {
    const multiCoordinates = feature.geometry.coordinates as number[][][][];
    multiCoordinates.forEach(polygon => {
      polygon[0].forEach(coord => {
        totalLon += coord[0];
        totalLat += coord[1];
        pointCount++;
      });
    });
  }
  
  if (pointCount === 0) {
    return [0, 0];
  }
  
  return [totalLon / pointCount, totalLat / pointCount];
}

// Get color based on data value and category
export function getColorForValue(value: number, category: DataCategory): string {
  // Use monochromatic aquamarine/blue colors for all categories
  // Varying from dark to bright aquamarine/cyan
  let minColor = "#003850"; // Dark aquamarine
  let maxColor = "#00e5ff"; // Bright cyan
  
  // Slight variations for different categories (all in blue/aquamarine spectrum)
  switch (category) {
    case "health":
      minColor = "#004d66"; // Dark blue
      maxColor = "#00e5ff"; // Bright cyan
      break;
    case "happiness":
      minColor = "#005066"; // Dark teal
      maxColor = "#00ffcc"; // Bright mint
      break;
    case "environmental":
      minColor = "#003850"; // Dark aquamarine
      maxColor = "#00e5ff"; // Bright cyan
      break;
    case "qualityOfLife":
      minColor = "#003366"; // Dark blue
      maxColor = "#4dd6ff"; // Light blue
      break;
    case "violence":
      minColor = "#002b50"; // Very dark blue
      maxColor = "#00ccff"; // Bright blue
      break;
  }
  
  // Normalize value to 0-1 range based on category
  let normalizedValue = 0;
  
  switch (category) {
    case "health":
      // Health (life expectancy): 50-90 years
      normalizedValue = (value - 50) / 40;
      break;
    case "happiness":
      // Happiness: 0-10 scale
      normalizedValue = value / 10;
      break;
    case "environmental":
      // Environmental: 0-100 score
      normalizedValue = value / 100;
      break;
    case "qualityOfLife":
      // Quality of life: 0-100 score
      normalizedValue = value / 100;
      break;
    case "violence":
      // Violence (peace index): 0-100 score
      normalizedValue = value / 100;
      break;
  }
  
  // Clamp normalized value to 0-1 range
  normalizedValue = Math.max(0, Math.min(1, normalizedValue));
  
  // Interpolate between min and max color
  return interpolateColor(minColor, maxColor, normalizedValue);
}

// Interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Parse hex colors
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  
  // Interpolate
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  // Convert back to hex
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// Format data value based on category
export function formatDataValue(value: number, category: DataCategory): string {
  switch (category) {
    case "health":
      return `${value.toFixed(1)} years`;
    case "happiness":
      return `${value.toFixed(1)}/10`;
    case "environmental":
      return `${value.toFixed(1)}/100`;
    case "qualityOfLife":
      return `${value.toFixed(1)}/100`;
    case "violence":
      return `${value.toFixed(1)}/100`;
    default:
      return value.toFixed(1);
  }
}
