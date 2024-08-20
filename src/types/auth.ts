import { userSignInValidation, userSignUpValidation } from "@/zod-validations/auth-validations";
import { z } from "zod";
import { UsedForPriceCalculationItem } from "./property";

export interface GoogleAuthNotRegisteredResponse {
  email: string;
  name: string;
  picture: string;
  token: string;
}

export interface IRegisterGoogleUser {
  token: string | null;
  state: string | null;
  county: string | null;
  mailingAddress: string | null;
}

// new types
export type IUserSignIn = z.infer<typeof userSignInValidation>;
export type IUserSignUp = z.infer<ReturnType<typeof userSignUpValidation>>;
export type IUser = Omit<z.infer<ReturnType<typeof userSignUpValidation>>, "agreeTerm" | "repeatPassword">;

export enum IUserRegistrationReason {
  SellLandQuickly = "sellLandQuickly",
  LookingForLandDeal = "lookingForLandDeal",
  ResearchingPropertyData = "researchingPropertyData",
  RealEstateProfessional = "realEstateProfessional",
}

export enum DeletionAccountReason {
  SoldLand = "SoldLand",
  SoldLandOutsideMarket = "SoldLandOutsideMarket",
  NotUseful = "NotUseful",
  NoDataAccess = "NoDataAccess",
  Complicated = "Complicated",
  TooExpensive = "TooExpensive",
}

export interface IDecodedAccessToken {
  email: string;
  firstName: string;
  lastName: string;
  role: null;
  sub: number;
  id: number;
  planSelected?: boolean;
  isSubscribed?: boolean;
}

export interface ISignInResponse {
  access_token: string;
  payload: IDecodedAccessToken;
}

export interface AuthedUserSearches {
  id: number;
  owner: string;
  user_id: number;
  state: string;
  county: string;
  propertyType: string;
  acrage: string;
  parcelNumber: string;
  price: string;
  price_sum: string;
  median_middle_price: string;
  accepted: false;
  dateCreated: Date;
  lastsalesprice: string;
  lastsalesdate: Date;
  coordinates: string;
  assessments: UsedForPriceCalculationItem[];
  lat: string;
  lon: string;
}
