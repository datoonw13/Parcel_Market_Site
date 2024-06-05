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

export interface IFindPropertyAbout {
  waterFeature: boolean | null;
  waterFront: boolean | null;
  langCoverType: string | null;
  propertyCondition: string | null;
  wetProperty: string | null;
  propertyRestriction: string | null;
  propertyAccess: string | null;
  improvementsValue: number | null;
  agreement: boolean;
}

export interface IRegridReq {
  state: string;
  county: string;
  owner?: string;
  parcelNumber?: string;
}

export interface IFindPropertyEstimatedPrice {
  body: Omit<IFindPropertyAbout, "agreement"> & {
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
    lat: string;
    lng: string;
    property_id: number;
    id: number;
    dateCreated: Date;
  }[];
}

export interface ISellProperty {
  state: string;
  county: string;
  propertyType: string;
  acrage: number;
  parcelNumber: string;
  sellerType: "instantsale" | "saleonmarketplace";
  owner: string;
  salePrice: number;
  accepted: boolean;
  coordinates: string;
  lat: string;
  lon: string;
}

export interface ISellingProperty extends ISellProperty {
  user: { id: string; name: string; email: string };
  dataCreated: Date;
  marketPrice: string;
}

export type IUserSellingPropertiesResponse = ResponseType<{
  sellingProperties: Array<ISellingProperty>;
  pagination: IPagination;
}>;

// export interface ISearchPropertyCalculatePrice {
//   body: ISearchPropertyAbout &
//     Pick<ISearchPropertyInfo, "state" | "county"> & { owner?: string; parcelNumber: string; propertyType: string };
//   queryParams: {
//     lat: string;
//     lon: string;
//     acre: string;
//   };
// }

/// ///

// import { IPagination, ResponseType } from "./common";

// export interface ISearchPropertyCalculatePrice {
//   body: ISearchPropertyAbout &
//     Pick<ISearchPropertyInfo, "state" | "county"> & { owner?: string; parcelNumber: string; propertyType: string };
//   queryParams: {
//     lat: string;
//     lon: string;
//     acre: string;
//   };
// }

// export interface ISearchPropertyCalculatePriceResponse {
//   state: string;
//   county: string;
//   parcelNumber: string;
//   waterFeature: boolean;
//   waterFront: boolean;
//   langCoverType: string;
//   propertyCondition: string;
//   wetProperty: string;
//   propertyRestriction: string;
//   propertyAccess: string;
//   improvementsValue: number;
//   price: number;
//   name_owner: string;
//   user_id: string | null;
//   legalDescription: string | null;
//   apiOwnerName: string | null;
//   lotSize: string | null;
//   salePrice: string | null;
//   saleYear: string | null;
//   id: number;
//   dateCreated: Date;
//   range: {
//     min: number;
//     max: number;
//   };
//   properties: {
//     owner: string | null;
//     parselId: string;
//     propertyType: string;
//     arcage: number;
//     price: number;
//     isValid: boolean;
//     lastSalesPrice: number;
//     lastSalesDate: string;
//     address: string;
//     isMedianValid: boolean;
//     lat: string;
//     lng: string;
//     property_id: number;
//     id: number;
//     dateCreated: Date;
//   }[];
// }

// export interface ISearchPropertyInfo {
//   state: string | null;
//   county: string | null;
//   parcelNumber: string | null;
//   entityName: string | null;
//   firstName: string | null;
//   lastName: string | null;
//   isLegalEntity: boolean;
// }

// export interface ISearchPropertyAbout {
//   waterFeature: boolean | null;
//   waterFront: boolean | null;
//   langCoverType: string | null;
//   propertyCondition: string | null;
//   wetProperty: string | null;
//   propertyRestriction: string | null;
//   propertyAccess: string | null;
//   improvementsValue: number | null;
// }

// export interface ISearchProperty {
//   info: ISearchPropertyInfo;
//   found: {
//     parcelNumber: string | null;
//   };
//   about: ISearchPropertyAbout;
// }

// export interface ICalculatePriceReq {
//   state: string;
//   county: string;
//   owner?: string;
//   parcelNumber?: string;
// }
