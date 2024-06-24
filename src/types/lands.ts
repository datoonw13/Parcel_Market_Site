import { ISellProperty } from "./find-property";

export enum SortBy {
  Newest = "newest",
  PriceHighLow = "price-hi-lo",
  PriceLowHigh = "price-lo-hi",
  AreaHighLow = "area-hi-lo",
  AreaLowHigh = "area-lo-hi",
  Updated = "updated",
  Oldest = "oldest",
}

export interface ILandsMarketplaceFilters {
  state: string | null;
  county: string | null;
  acreageMin: number | null;
  acreageMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  page: number;
  pageSize: number;
  sellerType: ISellProperty["sellerType"];
  sortBy: SortBy | null;
}
