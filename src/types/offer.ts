import { IUser } from "./auth";
import { SortEnum } from "./common";
import { ISellingProperty } from "./find-property";

export enum OfferStatusEnum {
  pending = "Pending",
  accepted = "Accepted",
  rejected = "Rejected",
  expired = "Expired",
  canceled = "Canceled",
}

export enum OfferEarnestMoneyModel {
  FIVE_PERCENT = 5,
  TEN_PERCENT = 10,
  TWENTY_PERCENT = 20,
}

export enum OfferInspectionPeriodModel {
  TEN_DAYS = 10,
  TWENTY_DAYS = 20,
  THIRTY_DAYS = 30,
}

export enum OfferClosingPeriodOffer {
  FIFTEEN_DAYS = 15,
  THIRTY_DAYS = 30,
  FORTY_FIVE_DAYS = 45,
}

export enum OfferClosingCostsOffer {
  SELLER_PAYS = "Seller Pays",
  SPLIT_EQUALLY = "Split equally",
  BUYER_PAYS = "Buyer Pays",
}

export enum OfferContingenciesOffer {
  TITLE = "Title",
  FINANCING = "Financing",
  APPRAISAL = "Appraisal",
  OTHER = "Other",
}

export interface ReceivedOffersFilters {
  sortBy?: SortEnum;
  parcelNumber?: string;
  priceMin?: string;
  priceMax?: string;
  voltPriceMin?: string;
  voltPriceMax?: string;
  page?: number;
  pageSize?: number;
}

export interface ReceivedOfferModel {
  id: number;
  price: string;
  earnestMoney: OfferEarnestMoneyModel;
  inspectionPeriodDays: OfferInspectionPeriodModel;
  closingPeriodDays: OfferClosingPeriodOffer;
  closingCosts: OfferClosingCostsOffer;
  contigencies: OfferContingenciesOffer;
  offerActiveForDays: number;
  offerStatus: OfferStatusEnum;
  offerGivenByUserId: number;
  offerGivenToUserId: number;
  sellingPropertyId: number;
  otherTerms: null;
  createdAt: Date;
  activeUntil: string;
  sellingProperty: ISellingProperty;
  offerGivenBy: IUser;
}
