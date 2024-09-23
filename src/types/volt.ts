import { voltSearchSchema } from "@/zod-validations/volt";
import { z } from "zod";
import { IMap } from "./map";
import { UsedForPriceCalculationItem } from "./property";

export type VoltSearchModel = z.infer<typeof voltSearchSchema>;

export enum VoltSteps {
  SEARCH,
  SEARCH_RESULTS,
  CALCULATION,
}

export type VoltSearchResultModel = IMap;

export interface VoltPriceCalculationReq {
  body: {
    owner?: string;
    parcelNumber: string;
    propertyType: string;
    state: string;
    county: string;
    coordinates: string;
    locality: string;
  };
  queryParams: {
    lat: string;
    lon: string;
    acre: string;
  };
}

export interface VoltPriceCalculationRes {
  propertyId: number;
  properties: {
    owner: string | null;
    parselId: string;
    propertyType: string;
    arcage: string;
    price: number;
    isValid: boolean;
    lastSalesPrice: string;
    lastSalesDate: string;
    address: string;
    isMedianValid: boolean;
    latitude: string;
    longitude: string;
    id?: number;
    state?: string;
    county?: string;
    parcelNumber: string;
  }[];
  range: {
    min: number;
    max: number;
  };
  owner: string;
  state: string;
  county: string;
  propertyType: string;
  parcelNumber: string;
  coordinates: string;
  price: number;
  price_sum: number;
  median_middle_price: number;
  acrage: number;
  lastsalesprice: number;
  lastsalesdate: string;
  user_id: number;
  lat: string;
  lon: string;
  city: string | null;
  id: number;
  dateCreated: Date;
}
