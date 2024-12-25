import { IUserRecentSearches } from "./user";

export interface IInitiateMap {
  parcelNumberNoFormatting: string;
  owner: string;
  lng: number;
  lat: number;
  coordinates?: any;
  acreage: number;
  properties: Array<IFeature>;
}

export enum PropertyTypeEnum {
  primary,
  secondary,
  tertiary,
}
export interface IBaseFeature {
  type: PropertyTypeEnum;
  parcelNumberNoFormatting: string;
  acreage: number;
  icon?: string;
  iconSelected?: string;
}

export interface IPrimaryFeature extends IBaseFeature {
  type: PropertyTypeEnum.primary;
  owner: string;
  lat: number;
  lng: number;
  lastSaleDate?: Date;
  lastSalePrice?: Date;
  pricePerAcreage?: number;
}

export interface ISecondaryFeature extends IBaseFeature {
  type: PropertyTypeEnum.secondary;
  lat: number;
  lng: number;
  lastSaleDate: Date;
  lastSalePrice: number;
  pricePerAcreage: number;
  bulkId?: string;
}

export interface ITertiaryFeature extends IBaseFeature {
  type: PropertyTypeEnum.tertiary;
  lat: number;
  lng: number;
  bulkId?: string;
  lastSaleDate: Date;
  lastSalePrice: number;
  pricePerAcreage: number;
}

export type IFeature = IPrimaryFeature | ISecondaryFeature | ITertiaryFeature;
