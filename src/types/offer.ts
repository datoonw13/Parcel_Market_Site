import { SortEnum } from "./common";

export enum OfferStatus {
  pending = "Pending",
  accepted = "Accepted",
  rejected = "Rejected",
  expired = "Expired",
  canceled = "Canceled",
}

export interface ReceivedOffersFilters {
  sortBY?: SortEnum;
  parcelNumber?: string;
  priceMin?: string;
  priceMax?: string;
  voltPriceMin?: string;
  voltPriceMax?: string;
  page?: string;
  pageSize?: string;
}
