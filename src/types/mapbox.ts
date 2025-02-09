import { Geometry, FeatureCollection } from "geojson";

export interface IGeneratedFeatureProperties {
  parcelNumber: string;
  parcelNumberNoFormatting: string;
  lng: number;
  lat: number;
  type: "selling" | "calculation-valid" | "calculation-not-valid";
  acreage: number;
  markerSize?: number;
  hoveredMarkerSize?: number;
  selectedMarkerSize?: number;
  markerIcon?: string;
  hoveredMarkerIcon?: string;
  selectedMarkerIcon?: string;
  polygonLineColor?: string;
  polygonFillColor?: string;
  owner?: string;
  bulkId?: string | null;
  isBulkMedianValid?: boolean;
  lastSaleDate?: Date;
  price?: number;
  pricePerAcreage?: number;
  group?: string;
}

export type MapGeoJson = FeatureCollection<Geometry, IGeneratedFeatureProperties>;
