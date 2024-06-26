// export enum UserRoles {
//   USER = "user",
// }

import { ISellProperty } from "./property";

export interface ISignUp {
  name: string | null;
  email: string | null;
  mailingAddress: string | null;
  state: string | null;
  county: string | null;
  password: string | null;
  confirmPassword: string | null;
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
    name: string;
    role: null;
    sub: number;
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
  selectedParcelOptions: ISellProperty | null;
};
