import * as yup from "yup";

export const findPropertyInfoSchema = yup.object().shape(
  {
    name_owner: yup
      .string()
      .required("Owner name or parcel number is a required field")
      .when("parcelNumber", ([parcelNumber], schema) => (parcelNumber ? yup.string() : schema)),
    state: yup.string().required("State is a required field"),
    county: yup.string().required("County is a required field"),
    parcelNumber: yup
      .number()
      .required("Parcel number or owner name is a required field")
      .when("name_owner", ([name_owner], schema) => (name_owner ? yup.string() : schema)),
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
