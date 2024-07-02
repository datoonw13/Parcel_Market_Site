import { userSignInValidation, userSignUpValidation } from "@/zod-validations/auth-validations";
import { z } from "zod";

export enum UserType {
  DEFAULT,
  PROFESSIONAL,
}

export interface ISignUp {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mailingAddress: string | null;
  state: string | null;
  county: string | null;
  password: string | null;
  confirmPassword: string | null;
  type: UserType;
  agreeTerms: boolean;
  agreeSubscribe: boolean;
  token?: string;
}

export interface ISignIn {
  email: string | null;
  password: string | null;
}

export interface ISignInResponse {
  access_token: string;
  payload: {
    email: string;
    firstName: string;
    lastName: string;
    role: null;
    sub: number;
    id: number;
  };
}

export interface UserModel {
  email: string;
  name: string;
  role: "user" | "admin";
  mobileNumber: string;
  image: string | null;
  mailingAddress: string;
  state: string;
  county: string;
  id: number;
}

export interface ISignUpResponse {
  user: UserModel & { token: string };
}

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

export type IAuthSliceInitial = {
  user: UserModel | null;
  pending: boolean;
  token: string | null;
  selectedParcelOptions: any;
};

export enum IUserRegistrationReason {
  SellLandQuickly = "sellLandQuickly",
  LookingForLandDeal = "lookingForLandDeal",
  ResearchingPropertyData = "researchingPropertyData",
  RealEstateProfessional = "realEstateProfessional",
}

export interface IUser {
  email: string;
  mailingAddress: string;
  state: string;
  county: string;
  mobileNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationReason: IUserRegistrationReason;
  unitNumber: string;
  city: string;
  postalCode: string;
  streetName: string;
}

export enum DeletionAccountReason {
  SoldLand = "SoldLand",
  SoldLandOutsideMarket = "SoldLandOutsideMarket",
  NotUseful = "NotUseful",
  NoDataAccess = "NoDataAccess",
  Complicated = "Complicated",
  TooExpensive = "TooExpensive",
}

// new types
export type IUserSignIn = z.infer<typeof userSignInValidation>;
export type IUserSignUp = z.infer<typeof userSignUpValidation>;
