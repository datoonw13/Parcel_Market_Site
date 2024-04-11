import * as yup from "yup";

export const findPropertyInfoSchema = yup.object().shape(
  {
    owner: yup
      .string()
      .required("Owner name or parcel number is a required field")
      .nullable()
      .when("parcelNumber", ([parcelNumber], schema) =>
        parcelNumber ? schema : schema.notOneOf([null], "Owner name or parcel number is a required field")
      ),
    state: yup.string().required("State is a required field").nullable().notOneOf([null], "State is a required field"),
    county: yup.string().required("County is a required field").nullable().notOneOf([null], "County is a required field"),
    parcelNumber: yup
      .string()
      .required("Parcel number or owner name is a required field")
      .nullable()
      .when("owner", ([owner], schema) => (owner ? schema : schema.notOneOf([null], "Parcel number or owner name is a required field"))),
  },
  [["owner", "parcelNumber"]]
);

export const findPropertyAboutSchema = yup.object().shape({
  waterFeature: yup.boolean().required(),
  waterFront: yup.boolean().required(),
  langCoverType: yup.string().required(),
  propertyCondition: yup.string().required(),
  wetProperty: yup.string().required(),
  propertyRestriction: yup.string().required(),
  propertyAccess: yup.string().required(),
  improvementsValue: yup.number().required(),
});

export const searchPropertySchema = yup.object().shape({
  info: yup.object().shape(
    {
      owner: yup
        .string()
        .required("Owner name or parcel number is a required field")
        .nullable()
        .when("parcelNumber", ([parcelNumber], schema) =>
          parcelNumber ? schema : schema.notOneOf([null], "Owner name or parcel number is a required field")
        ),
      state: yup.string().required("State is a required field").nullable().notOneOf([null], "State is a required field"),
      county: yup.string().required("County is a required field").nullable().notOneOf([null], "County is a required field"),
      parcelNumber: yup
        .string()
        .required("Parcel number or owner name is a required field")
        .nullable()
        .when("owner", ([owner], schema) => (owner ? schema : schema.notOneOf([null], "Parcel number or owner name is a required field"))),
    },
    [["owner", "parcelNumber"]]
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
    improvementsValue: yup.number().required().nullable().notOneOf([null]),
  }),
  signature: yup.string().required().nullable().notOneOf([null]),
});
