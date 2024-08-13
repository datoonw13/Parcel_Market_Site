import { z } from "zod";
import { offerValidation } from "@/zod-validations/offer-validations";
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

export enum OfferEarnestMoneyEnum {
  FIVE_PERCENT = 5,
  TEN_PERCENT = 10,
  TWENTY_PERCENT = 20,
}

export enum OfferInspectionPeriodEnum {
  TEN_DAYS = 10,
  TWENTY_DAYS = 20,
  THIRTY_DAYS = 30,
}

export enum OfferClosingPeriodOfferEnum {
  FIFTEEN_DAYS = 15,
  THIRTY_DAYS = 30,
  FORTY_FIVE_DAYS = 45,
}

export enum OfferClosingCostsOfferEnum {
  SELLER_PAYS = "Seller Pays",
  SPLIT_EQUALLY = "Split equally",
  BUYER_PAYS = "Buyer Pays",
}

export enum OfferContingenciesOfferEnum {
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

export interface OfferModel {
  id: number;
  price: string;
  earnestMoney: OfferEarnestMoneyEnum;
  inspectionPeriodDays: OfferInspectionPeriodEnum;
  closingPeriodDays: OfferClosingPeriodOfferEnum;
  closingCosts: OfferClosingCostsOfferEnum;
  contigencies: OfferContingenciesOfferEnum[] | null;
  offerActiveForDays: number;
  offerStatus: OfferStatusEnum;
  offerGivenByUserId: number;
  offerGivenToUserId: number;
  sellingPropertyId: number;
  otherTerms: null;
  createdAt: Date;
  activeUntil: string;
  sellingProperty: ISellingProperty;
  offerGivenBy: { id: number; firstName: string; lastName: string };
  offerGivenTo: { id: number; firstName: string; lastName: string };
}

export type MakeOfferModel = z.infer<typeof offerValidation>;
