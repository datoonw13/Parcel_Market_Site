import { ISignUp, UserType } from "@/types/auth";
import * as yup from "yup";

export const signUpSchema = (isGoogleUser?: boolean) =>
  yup.object().shape({
    firstName: yup.string().required("Name is a required field").nullable().notOneOf([null], "First name is a required field"),
    lastName: yup.string().required("Name is a required field").nullable().notOneOf([null], "Last Name is a required field"),
    email: yup
      .string()
      .required("Email is a required field")
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid format"
      )
      .nullable()
      .notOneOf([null], "Email is a required field"),
    mailingAddress: yup
      .string()
      .required("Mailing address is a required field")
      .nullable()
      .notOneOf([null], "Mailing address is a required field"),
    password: yup
      .string()
      .required("Password is a required field")
      .nullable()
      .notOneOf(isGoogleUser ? [] : [null], "Password is a required field"),
    confirmPassword: yup
      .string()
      .required("Please confirm your password.")
      .nullable()
      .notOneOf(isGoogleUser ? [] : [null], "Please confirm your password")
      .oneOf([yup.ref("password")], "Your passwords do not match."),
    state: yup
      .string()
      .required("State is a required field")
      .nullable()
      .when(["type"], ([type], schema) => (type === UserType.DEFAULT ? schema : schema.notOneOf([null], "State is a required field"))),
    county: yup
      .string()
      .required("County is a required field")
      .nullable()
      .when(["type"], ([type], schema) => (type === UserType.DEFAULT ? schema : schema.notOneOf([null], "County is a required field"))),
    agreeSubscribe: yup.boolean().oneOf([true]).required(),
    agreeTerms: yup.boolean().oneOf([true]).required(),
    type: yup.mixed<UserType>().oneOf([UserType.DEFAULT, UserType.PROFESSIONAL]).required(),
  });

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is a required field")
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email format"
    )
    .nullable()
    .notOneOf([null], "State is a required field"),
  password: yup.string().required("Password is a required field").nullable().notOneOf([null], "State is a required field"),
});
