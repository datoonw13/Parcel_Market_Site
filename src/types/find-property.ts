import { z } from "zod";
import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { IPagination, ResponseType } from "./common";

export interface IFindPropertyInfo {
  type: "fullName" | "entityName" | "parcelNumber";
  firstName: string | null;
  lastName: string | null;
  entityName: string | null;
  parcelNumber: string | null;
  state: string | null;
  county: string | null;
}

export type IFindPropertyAbout = z.infer<typeof aboutLandSchema>;

export interface IRegridReq {
  state: string;
  county: string;
  firstName?: string;
  lastName?: string;
  parcelNumber?: string;
}

export interface IFindPropertyEstimatedPrice {
  body: {
    owner?: string;
    parcelNumber: string;
    propertyType: string;
    state: string;
    county: string;
  };
  queryParams: {
    lat: string;
    lon: string;
    acre: string;
  };
}

export interface IFindPropertyEstimatedPriceResponse {
  state: string;
  county: string;
  parcelNumber: string;
  waterFeature: boolean;
  waterFront: boolean;
  langCoverType: string;
  propertyCondition: string;
  wetProperty: string;
  propertyRestriction: string;
  propertyAccess: string;
  improvementsValue: number;
  price: number;
  name_owner: string;
  user_id: string | null;
  legalDescription: string | null;
  apiOwnerName: string | null;
  lotSize: string | null;
  salePrice: string | null;
  saleYear: string | null;
  id: number;
  dateCreated: Date;
  range: {
    min: number;
    max: number;
  };
  properties: {
    owner: string | null;
    parselId: string;
    propertyType: string;
    arcage: number;
    price: number;
    isValid: boolean;
    lastSalesPrice: number;
    lastSalesDate: string;
    address: string;
    isMedianValid: boolean;
    latitude: string;
    longitude: string;
    property_id: number;
    id: number;
    dateCreated: Date;
  }[];
  median_middle_price: number;
}

export interface ISellProperty extends IFindPropertyAbout {
  sellerType: "instantsale" | "sale";
  county: string;
  propertyType: string;
  acrage: string;
  parcelNumber: string;
  owner: string;
  salePrice: string;
  accepted: string;
  coordinates: string;
  lat: string;
  lon: string;
  propertyId: string;
}

// state: selectedRegridItem?.properties.fields.state2,
// county: selectedRegridItem?.properties.fields.county,
// propertyType: selectedRegridItem?.properties?.fields?.zoning_description || selectedRegridItem?.properties?.fields?.usedesc || "",
// acrage: selectedRegridItem.properties.fields.ll_gisacre,
// parcelNumber: selectedRegridItem?.properties.fields.parcelnumb_no_formatting,
// sellerType,
// owner: selectedRegridItem.properties.fields.owner,
// salePrice: price || 0,
// accepted: true,
// coordinates: JSON.stringify(selectedRegridItem.geometry.coordinates),
// lat: selectedRegridItem.properties.fields.lat,
// lon: selectedRegridItem.properties.fields.lon,
// propertyId,

export interface ISellingProperty extends ISellProperty, Omit<IFindPropertyAbout, "agreement"> {
  user: { id: string; name: string; email: string };
  dataCreated: Date;
  marketPrice: string;
  id: number;
  usedForPriceCalculations?: Array<{ latitude: string; longitude: string; lastSalesDate: string; lastSalesPrice: string; arcage: string }>;
  totalViews: number;
  availableTill: string;
  user_id?: number;
  followedListingId?: number;
  offerId?: string;
}

export type IUserSellingPropertiesResponse = ResponseType<{
  sellingProperties: Array<ISellingProperty>;
  pagination: IPagination;
}>;
