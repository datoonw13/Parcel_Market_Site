import { ReactNode } from "react";
import { LatLngTuple } from "leaflet";
import { ISellProperty } from "./find-property";

export enum SortBy {
  Oldest = "oldest",
  Newest = "newest",
  PriceHighLow = "price-hi-lo",
  PriceLowHigh = "price-lo-hi",
  AreaHighLow = "area-hi-lo",
  AreaLowHigh = "area-lo-hi",
}

export interface IMarketplaceFilters {
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

export interface ILandsFilters {
  state: string | null;
  county: string | null;
  acreageMin: number | string | null;
  acreageMax: number | string | null;
  priceMin: number | string | null;
  priceMax: number | string | null;
  page: number;
  pageSize: number;
  sortBy: SortBy | null;
}

export interface LandListItemProps {
  view: "vertical" | "horizontal";
  data: {
    name: string;
    state: string;
    county: string;
    availableTill: string;
    options: {
      [key: string]: {
        icon: ReactNode;
        label: string;
        value: string;
      };
    };
  };
  sellingItemId: number;
  className?: string;
  selecting?: boolean;
  selected?: boolean;
  onClick?: () => void;
  showBookmark?: boolean;
  followedListingId?: number;
  disableDetail?: boolean;
  map?: {
    canView?: boolean;
    mainLandCoordinate?: LatLngTuple;
  };
  disableZoom?: boolean;
}
