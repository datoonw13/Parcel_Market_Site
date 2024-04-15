import * as yup from "yup";

export const signUpSchema = yup.object().shape({
  name: yup.string().required("Name is a required field").nullable(),
  email: yup
    .string()
    .required("Email is a required field")
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid format"
    )
    .nullable(),
  mailingAddress: yup.string().required("Mailing address is a required field").nullable(),
  // mobileNumber: yup.string().required("Mobile number is a required field").nullable(),
  password: yup.string().required("Password is a required field").nullable(),
  confirmPassword: yup
    .string()
    .required("Please confirm your password.")
    .nullable()
    .oneOf([yup.ref("password")], "Your passwords do not match."),
  state: yup.string().required("State is a required field").nullable(),
  county: yup.string().required("County is a required field").nullable(),
});

export const signInSchema = yup.object().shape({
  email: yup.string().required("Email is a required field").nullable(),
  password: yup.string().required("Password is a required field").nullable(),
});
