export enum UserRoles {
  USER = "user",
}

export interface ISignUp {
  name: string | null;
  email: string | null;
  mailingAddress: string | null;
  state: string | null;
  county: string | null;
  mobileNumber: string | null;
  password: string | null;
  confirmPassword: string | null;
  role: UserRoles;
}
