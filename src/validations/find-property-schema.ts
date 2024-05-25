import { IFindPropertyInfo } from "@/types/find-property";
import * as yup from "yup";

export const findPropertyInfoSchema = yup.object().shape(
  {
    type: yup.mixed<IFindPropertyInfo["type"]>().oneOf(["fullName", "entityName", "parcelNumber"]).required(),
    state: yup.string().required("State is a required field").nullable().notOneOf([null], "State is a required field"),
    county: yup.string().required("County is a required field").nullable().notOneOf([null], "County is a required field"),
    firstName: yup
      .string()
      .required("FirstName required field")
      .nullable()
      .when(["type"], ([type], schema) => {
        if (type !== "fullName") {
          return schema;
        }
        return schema.notOneOf([null], "First name is a required field");
      }),
    lastName: yup
      .string()
      .required("Last name  is a required field")
      .nullable()
      .when(["type"], ([type], schema) => {
        if (type !== "fullName") {
          return schema;
        }
        return schema.notOneOf([null], "Last name is a required field");
      }),
    entityName: yup
      .string()
      .required("Entity name is a required field")
      .nullable()
      .when(["type"], ([type], schema) => {
        if (type !== "entityName") {
          return schema;
        }
        return schema.notOneOf([null], "Entity name is a required field");
      }),
    parcelNumber: yup
      .string()
      .required("Parcel number is a required field")
      .min(6, "Min 6 character")
      .nullable()
      .when(["type"], ([type], schema) =>
        type !== "parcelNumber" ? schema : schema.notOneOf([null], "Parcel number is a required field")
      ),
  },
  [
    ["firstName", "type"],
    ["lastName", "type"],
    ["entityName", "type"],
    ["parcelNumber", "type"],
  ]
);
