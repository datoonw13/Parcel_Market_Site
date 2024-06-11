import { ISellProperty } from "./find-property";

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
}
