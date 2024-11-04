import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { PolygonProps } from "react-leaflet";
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
    locality: string;
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
  locality: string;
}

/// //////

export interface IPropertyPolygon {
  polygon: PolygonProps["positions"];
}

export interface IPropertyOwner {
  owner: string;
}

export interface IPropertySaleHistory {
  lastSalePrice: number;
  lastSaleDate: Date;
}

export interface IPropertyPricePerAcre {
  pricePerAcreage: number;
}

export interface IPropertyType {
  propertyType: string;
}

export interface IPropertyCalculationOptions {
  isValid: boolean;
  isMedianValid: boolean;
}

export type IPropertyBaseInfo = {
  id: string | number;
  parcelNumber: string;
  parcelNumberNoFormatting: string;
  lat: number;
  lon: number;
  acreage: number;
  county: {
    value: string;
    label: string;
  };
  state: {
    value: string;
    label: string;
  };
  city: string;
};

export interface IPropertyUsedForCalculation
  extends IPropertyBaseInfo,
    IPropertySaleHistory,
    IPropertyCalculationOptions,
    IPropertyPricePerAcre {}

export interface IBulkPropertiesUsedForCalculation {
  id: string;
  acreage: number;
  price: number;
  pricePerAcreage: number;
  county: {
    value: string;
    label: string;
  };
  state: {
    value: string;
    label: string;
  };
  properties: IPropertyUsedForCalculation[];
}
export interface IMainPropertyBaseInfo extends IPropertyBaseInfo, IPropertyOwner, IPropertyPolygon, IPropertyType {}
