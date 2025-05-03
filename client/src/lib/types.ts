// GeoJSON types
export interface Geometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

export interface Properties {
  NAME: string;
  ISO_A3: string;
  [key: string]: any;
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface FeatureCollection {
  type: string;
  features: Feature[];
}

// Data categories
export type DataCategory = "health" | "happiness" | "environmental" | "qualityOfLife" | "violence";

// Country data structure
export interface CountryData {
  health?: number;
  happiness?: number;
  environmental?: number;
  qualityOfLife?: number;
  violence?: number;
}

// Color scales for data categories
export interface ColorScale {
  min: string;
  max: string;
  steps: number;
}

export interface DataCategoryConfig {
  name: string;
  description: string;
  colorScale: ColorScale;
  valueRange: [number, number]; // Min and max expected values
  format: (value: number) => string;
}
