import { ReactNode } from "react";
import { LatLngTuple } from "leaflet";
import { PropertySellReq } from "./property";

export enum SortBy {
  Oldest = "oldest",
  Newest = "newest",
  PriceHighLow = "price-hi-lo",
  PriceLowHigh = "price-lo-hi",
  AreaHighLow = "area-hi-lo",
  AreaLowHigh = "area-lo-hi",
}

export interface IMarketplaceFilters {
  search: string | null;
  states: string[] | null;
  counties: string[] | null;
  acreageMin: number | null;
  acreageMax: number | null;
  voltValueMin: number | null;
  voltValueMax: number | null;
  page: number;
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
    receivedOffers?: number;
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
