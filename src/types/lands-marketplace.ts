import { ISellProperty } from "./find-property";

export interface ILandsMarketplaceFilters {
  state: string | null;
  county: string | null;
  acreage: { min: number | null; max: number | null } | null;
  price: { min: number | null; max: number | null } | null;
  page: number;
  pageSize: number;
  sellerType: ISellProperty["sellerType"];
}
