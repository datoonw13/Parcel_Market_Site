import * as yup from "yup";

export const findPropertyInfoSchema = yup.object().shape(
  {
    name_owner: yup
      .string()
      .required("Owner name or parcel number is a required field")
      .nullable()
      .when("parcelNumber", ([parcelNumber], schema) =>
        parcelNumber ? schema : schema.notOneOf([null], "Owner name or parcel number is a required field")
      ),
    state: yup.string().required("State is a required field").nullable().notOneOf([null], "State is a required field"),
    county: yup.string().required("County is a required field").nullable().notOneOf([null], "County is a required field"),
    parcelNumber: yup
      .number()
      .required("Parcel number or owner name is a required field")
      .nullable()
      .when("name_owner", ([name_owner], schema) =>
        name_owner ? schema : schema.notOneOf([null], "Parcel number or owner name is a required field")
      ),
  },
  [["name_owner", "parcelNumber"]]
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
