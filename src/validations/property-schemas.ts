import * as yup from "yup";

export const searchPropertySchema = yup.object().shape({
  info: yup.object().shape(
    {
      isLegalEntity: yup.boolean().required(),
      entityName: yup
        .string()
        .required("Owner name or parcel number is a required field")
        .nullable()
        .when(["parcelNumber", "isLegalEntity"], ([parcelNumber, isLegalEntity], schema) => {
          if (parcelNumber || !isLegalEntity) {
            return schema;
          }
          return schema.notOneOf([null], "Owner name or parcel number is a required field");
        }),
      firstName: yup
        .string()
        .required("firstName or parcel number is a required field")
        .nullable()
        .when(["parcelNumber", "isLegalEntity"], ([parcelNumber, isLegalEntity], schema) => {
          if (parcelNumber || isLegalEntity) {
            return schema;
          }
          return schema.notOneOf([null], "First name or parcel number is a required field");
        }),
      lastName: yup
        .string()
        .required("Last name or parcel number is a required field")
        .nullable()
        .when(["parcelNumber", "isLegalEntity"], ([parcelNumber, isLegalEntity], schema) => {
          if (parcelNumber || isLegalEntity) {
            return schema;
          }
          return schema.notOneOf([null], "Last name or parcel number is a required field");
        }),
      state: yup.string().required("State is a required field").nullable().notOneOf([null], "State is a required field"),
      county: yup.string().required("County is a required field").nullable().notOneOf([null], "County is a required field"),
      parcelNumber: yup
        .string()
        .required("Parcel number or owner name is a required field")
        .min(6, "Min 6 character")
        .nullable()
        .when(["entityName", "firstName", "lastName"], ([entityName, firstName, lastName], schema) =>
          entityName || (firstName && lastName) ? schema : schema.notOneOf([null], "Parcel number or owner name is a required field")
        ),
    },
    [
      ["firstName", "parcelNumber"],
      ["lastName", "parcelNumber"],
      ["entityName", "parcelNumber"],
    ]
  ),
  found: yup.object().shape({
    parcelNumber: yup.string().required().nullable().notOneOf([null]),
  }),
  about: yup.object().shape({
    waterFeature: yup.boolean().required().nullable().notOneOf([null]),
    waterFront: yup.boolean().required().nullable().notOneOf([null]),
    langCoverType: yup.string().required().nullable().notOneOf([null]),
    propertyCondition: yup.string().required().nullable().notOneOf([null]),
    wetProperty: yup.string().required().nullable().notOneOf([null]),
    propertyRestriction: yup.string().required().nullable().notOneOf([null]),
    propertyAccess: yup.string().required().nullable().notOneOf([null]),
    improvementsValue: yup.number().required().nullable(),
  }),
});
