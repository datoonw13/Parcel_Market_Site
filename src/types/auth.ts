// export enum UserRoles {
//   USER = "user",
// }

export interface ISignUp {
  name: string | null;
  email: string | null;
  mailingAddress: string | null;
  state: string | null;
  county: string | null;
  password: string | null;
  confirmPassword: string | null;
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
}
