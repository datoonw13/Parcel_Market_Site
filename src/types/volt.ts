import { voltSearchSchema } from "@/zod-validations/volt";
import { z } from "zod";
import { PolygonProps } from "react-leaflet";
import { IMap } from "./map";
import {
  IMainPropertyBaseInfo,
  IPropertyBaseInfo,
  IPropertyOwner,
  IPropertyPolygon,
  IPropertyPricePerAcre,
  IPropertySaleHistory,
  IPropertyType,
  IPropertyUsedForCalculation,
  UsedForPriceCalculationItem,
} from "./property";

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

export type IVoltPriceCalculationRes = IMainPropertyBaseInfo &
  IPropertyPricePerAcre & {
    propertiesUsedForCalculation: IPropertyUsedForCalculation[];
    price: number;
  };

export interface VoltWrapperValuesModel {
  searchDetails: VoltSearchModel | null;
  searchResult: IMainPropertyBaseInfo[] | null;
  selectedItem: IMainPropertyBaseInfo | null;
  calculation: IVoltPriceCalculationRes | null;
}
