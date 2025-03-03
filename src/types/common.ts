export interface ResponseType<T> {
  data: T;
  errors: string[];
  message: string;
  statusCode: number;
}

export interface ResponseModel<T> {
  data: T;
  errorMessage: string | null;
  responseCreated?: Date;
}

export interface IPagination {
  pagination: {
    totalCount: number;
    pageSize: number;
    page: number;
  };
}

export enum SortEnum {
  Newest = "newest",
  Oldest = "oldest",
  PriceHighLow = "volt-hi-lo",
  PriceLowHigh = "volt-lo-hi",
  AreaHighLow = "area-hi-lo",
  AreaLowHigh = "area-lo-hi",
}

export type Nullable<T> = T | null;

export interface MapInteractionModel {
  hoveredParcelNumber: string | null;
  openPopperParcelNumber: string | null;
  zoom?: boolean;
}

export type UnwrapArray<T> = T extends Array<infer R> ? R : never;

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (...args: any) => Promise<infer R> ? R : any;

export enum UserSource {
  Google = "google",
  Facebook = "facebook",
  System = "system",
  Unknown = "unknown",
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}
