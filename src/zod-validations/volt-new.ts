import { removeParcelNumberFormatting } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import { z } from "zod";

export const searchType = z.enum(["fullName", "entityName", "parcelNumber", "map"]);

export const propertySearchTypeValidation = z
  .object({
    searchType,
    parcelNumber: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    entityName: z.string().trim().optional(),
    state: z.string().min(1),
    county: z.string().min(1),
  })
  .superRefine(({ parcelNumber, searchType, entityName, firstName, lastName }, context) => {
    if (searchType === "parcelNumber" && (!parcelNumber || (parcelNumber && parcelNumber.length < 2))) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 2,
        type: "string",
        inclusive: true,
        path: ["parcelNumber"],
      });
    }
    if (searchType === "entityName" && !entityName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["entityName"],
      });
    }
    if (searchType === "fullName" && !firstName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["firstName"],
      });
    }
    if (searchType === "fullName" && !lastName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["lastName"],
      });
    }
  });

// Define the schema for an individual assessment

const AssessmentBaseSchema = z
  .object({
    id: z.number(),
    owner: z.string().nullable(),
    parselId: z.string(),
    propertyType: z.string(),
    arcage: z.coerce.number(),
    isValid: z.boolean(),
    isMedianValid: z.boolean(),
    address: z.string(),
    lastSalesPrice: z.coerce.number(),
    lastSalesDate: z.coerce.date(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    state: z.string(),
    county: z.string(),
    // bulkGroupId: z.string().nullable(),
    isMainProperty: z.boolean().nullable(),
  })
  .transform(({ arcage, parselId, ...input }) => ({
    ...input,
    acreage: arcage,
    parcelNumber: parselId,
    parcelNumberNoFormatting: removeParcelNumberFormatting(parselId),
    pricePerAcreage: input.lastSalesPrice / arcage,
  }));

const BulkAssessmentBaseSchema = z
  .object({
    acreage: z.number(),
    price: z.number(),
    pricePerAcreage: z.number(),
    state: z.string(),
    county: z.string(),
    properties: z.array(AssessmentBaseSchema),
    isMedianValid: z.boolean().optional(),
    group: z.string(),
  })
  .transform((input) => ({
    ...input,
    id: input.properties.map((el) => el.parcelNumberNoFormatting).join("multiple"),
    isMedianValid: input.isMedianValid === undefined ? true : input.isMedianValid,
  }));

// const AssessmentSchema = z.object({
//   isBulked: z.boolean(),
//   data: z.union([AssessmentBaseSchema, BulkAssessmentBaseSchema]),
// });

const AssessmentSchema = z.discriminatedUnion("isBulked", [
  z.object({
    isBulked: z.literal(true),
    data: BulkAssessmentBaseSchema,
  }),
  z.object({
    isBulked: z.literal(false),
    data: AssessmentBaseSchema,
  }),
]);

export const PropertyDataSchema = z
  .object({
    id: z.number(),
    owner: z.string(),
    state: z.string(),
    county: z.string(),
    propertyType: z.string(),
    acrage: z.coerce.number(),
    parcelNumber: z.string(),
    legalDescription: z.string().nullable(),
    price: z.coerce.number(),
    dateCreated: z.coerce.date(),
    city: z.string().nullable(),
    coordinates: z.string(),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    locality: z.string(),
    median: z.coerce.number(),
    medianLowerBound: z.coerce.number(),
    medianUpperBound: z.coerce.number(),
    averagePricePerAcreValidMedians: z.coerce.number(),
    // radius: z.coerce.number().nullable(),
    // soldWithin: z.string().nullable(),
    // acreageMin: z.coerce.number().nullable(),
    // acreageMax: z.coerce.number().nullable(),
    // propertyTypes: z.array(z.number()).nullable(),
    assessments: z.array(AssessmentSchema),
  })
  .transform(({ acrage, ...input }) => ({
    ...input,
    state: getStateValue(input.state)?.label || "",
    county: getCountyValue(input.county, input.state)?.label || "",
    acreage: acrage,
    parcelNumberNoFormatting: removeParcelNumberFormatting(input.parcelNumber),
  }));
