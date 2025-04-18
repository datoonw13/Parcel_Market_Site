import { voltSearchSchema } from "@/zod-validations/volt";
import { z } from "zod";
import { PolygonProps } from "react-leaflet";
import { IMap } from "./map";
import {
  IBulkPropertiesUsedForCalculation,
  IMainPropertyBaseInfo,
  IPropertyBaseInfo,
  IPropertyPricePerAcre,
  IPropertySaleHistory,
  IPropertyUsedForCalculation,
} from "./property";
import { IUserRecentSearches } from "./user";

export type VoltSearchModel = z.infer<typeof voltSearchSchema>;

export enum VoltSteps {
  SEARCH,
  SEARCH_RESULTS,
  CALCULATION,
}

export type VoltSearchResultModel = IMap;

export interface IVoltPriceCalculationReqParams {
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

export interface PropertyUsedForCalculation extends IPropertyBaseInfo, IPropertySaleHistory, IPropertyPricePerAcre {
  isMedianValid: boolean;
  isValid: boolean;
}

export type IVoltPriceCalculation = IMainPropertyBaseInfo &
  IPropertyPricePerAcre & {
    propertiesUsedForCalculation: Array<IPropertyUsedForCalculation | IBulkPropertiesUsedForCalculation>;
    price: number;
  };

export interface VoltWrapperValuesModel {
  searchDetails: VoltSearchModel | null;
  searchResult: IMainPropertyBaseInfo[] | null;
  selectedItem: IMainPropertyBaseInfo | null;
  calculation: IVoltPriceCalculation | null;
  additionalDataResult: IUserRecentSearches | null;
}

export interface IVoltPriceCalculationResponseProperty {
  isBulked: false;
  data: {
    id: number;
    owner: null;
    parselId: string;
    propertyType: string;
    arcage: string;
    price: string;
    isValid: boolean;
    isMedianValid: boolean;
    address: string;
    lastSalesPrice: string;
    lastSalesDate: Date;
    latitude: string;
    longitude: string;
    state: string;
    county: string;
    city?: string;
  };
}

export interface IVoltPriceCalculationResponseBulkProperties {
  isBulked: true;
  data: {
    acreage: number;
    price: number;
    pricePerAcreage: number;
    state: string;
    county: string;
    parcelNumberNoFormatting: string;
    properties: (IVoltPriceCalculationResponseProperty["data"] & { bulkGroupId: string })[];
  };
}

export interface IVoltPriceCalculationResponse {
  owner: string;
  state: string;
  county: string;
  propertyType: string;
  parcelNumber: string;
  parcelNumberNoFormatting: string;
  coordinates: string;
  locality: string;
  price: number;
  price_sum: number;
  median_middle_price: number;
  acrage: string;
  lastsalesprice: number;
  lastsalesdate: Date;
  user_id: number;
  lat: string;
  lon: string;
  median: string;
  medianLowerBound: string;
  medianUpperBound: string;
  averagePricePerAcreValidMedians: string;
  legalDescription: null;
  apiOwnerName: null;
  lotSize: null;
  salePrice: null;
  saleYear: null;
  city: null;
  id: number;
  accepted: boolean;
  propertyId: number;
  dateCreated: Date;
  range: {
    min: number;
    max: number;
  };
  properties: Array<IVoltPriceCalculationResponseProperty | IVoltPriceCalculationResponseBulkProperties>;
}

/// // new

export interface IAssessment {
  isBulked: boolean;
  data: {
    id: number;
    owner: string | null;
    parselId: string;
    propertyType: string;
    arcage: string;
    price: string;
    isValid: boolean;
    isMedianValid: boolean;
    address: string;
    lastSalesPrice: string;
    lastSalesDate: string;
    latitude: string;
    longitude: string;
    state: string;
    county: string;
    bulkGroupId: string | null;
    isMainProperty: boolean;
  };
}

export interface IPropertyData {
  id: number;
  owner: string;
  user_id: number;
  state: string;
  county: string;
  propertyType: string;
  acrage: string;
  parcelNumber: string;
  legalDescription: string | null;
  apiOwnerName: string | null;
  lotSize: string | null;
  salePrice: string | null;
  saleYear: string | null;
  price: string;
  price_sum: string;
  median_middle_price: string;
  accepted: boolean;
  dateCreated: string;
  lastsalesprice: string;
  lastsalesdate: string;
  city: string | null;
  coordinates: string;
  lat: string;
  lon: string;
  locality: string;
  median: string;
  medianLowerBound: string;
  medianUpperBound: string;
  averagePricePerAcreValidMedians: string;
  radius: string | null;
  soldWithin: string | null;
  acreageMin: string | null;
  acreageMax: string | null;
  propertyTypes: string | null;
  assessments: IAssessment[];
}

export interface IPropertiesInteraction {
  hover: {
    clickId: string;
    openId: string;
    isBulked: boolean;
  } | null;
  popup: {
    clickId: string;
    openId: string;
    isBulked: boolean;
  } | null;
}
