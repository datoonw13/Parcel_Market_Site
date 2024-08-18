import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { z } from "zod";

export type AboutProperty = z.infer<typeof aboutLandSchema>;

export interface PropertyPriceCalculationReq {
  body: {
    owner?: string;
    parcelNumber: string;
    propertyType: string;
    state: string;
    county: string;
    coordinates: string;
  };
  queryParams: {
    lat: string;
    lon: string;
    acre: string;
  };
}

export interface PropertyPriceCalculationRes {
  propertyId: number;
  properties: UsedForPriceCalculationItem[];
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

export interface UsedForPriceCalculationItem {
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
}

export interface PropertySellReq extends AboutProperty {
  sellerType: "instantsale" | "sale";
  state: string;
  county: string;
  propertyType: string;
  acrage: number;
  parcelNumber: string;
  owner: string;
  salePrice: number;
  accepted: boolean;
  coordinates: string;
  lat: string;
  lon: string;
  propertyId: number;
  city: string;
}

export interface SellingPropertyDetails extends PropertySellReq, Omit<AboutProperty, "agreement"> {
  user: { id: string; name: string; email: string };
  dataCreated: Date;
  marketPrice: string;
  id: number;
  usedForPriceCalculations?: Array<UsedForPriceCalculationItem>;
  totalViews: number;
  availableTill: string;
  user_id?: number;
  followedListingId?: number;
  offerId?: string;
  city: string;
}
