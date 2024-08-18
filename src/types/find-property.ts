import type { AboutProperty, PropertySellReq } from "./property";

// export interface ISellProperty extends AboutProperty {
//   sellerType: "instantsale" | "sale";
//   state: string;
//   county: string;
//   propertyType: string;
//   acrage: number;
//   parcelNumber: string;
//   owner: string;
//   salePrice: number;
//   accepted: boolean;
//   coordinates: string;
//   lat: string;
//   lon: string;
//   propertyId: number;
//   city: string;
// }

export interface IUserSearches {
  id: number;
  owner: string;
  user_id: number;
  state: string;
  county: string;
  propertyType: string;
  acrage: string;
  parcelNumber: string;
  price: string;
  price_sum: string;
  median_middle_price: string;
  accepted: false;
  dateCreated: Date;
  lastsalesprice: string;
  lastsalesdate: Date;
  coordinates: string;
  assessments: {
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
    lastSalesDate: string;
    property_id: number;
    dateCreated: string;
    latitude: string;
    longitude: string;
    state: string;
    county: string;
  }[];
  lat: string;
  lon: string;
}
