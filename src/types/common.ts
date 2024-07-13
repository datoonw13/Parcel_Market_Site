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
  PriceHighLow = "price-hi-lo",
  PriceLowHigh = "price-lo-hi",
  AreaHighLow = "area-hi-lo",
  AreaLowHigh = "area-lo-hi",
  Updated = "updated",
  Oldest = "oldest",
}
