export interface ResponseType<T> {
  data: T;
  errors: string[];
  message: string;
  statusCode: number;
}

export interface ResponseModel<T> {
  data: T;
  errorMessage: string | null;
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
