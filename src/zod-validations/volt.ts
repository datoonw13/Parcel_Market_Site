import { z } from "zod";

const propertyLocationSchema = z.object({
  state: z.string().min(1),
  county: z.string().min(1),
});

export const propertyOwnerValidation = z
  .object({
    searchType: z.enum(["fullName", "entityName", "parcelNumber"]),
    parcelNumber: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    entityName: z.string().trim().optional(),
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

export const aboutPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().max(500).optional(),
  waterFeature: z.boolean(),
  frontNavigable: z.boolean(),
  cover: z.array(z.enum(["Wooded", "Open Field", "Mixed", "Clear Cut", "Desert"])).min(1),
  topography: z.enum(["Very Steep", "Some Steep areas", "Gently Rolling", "Flat"]),
  wet: z.enum(["Wet", "Some portions wet", "Not wet"]),
  restriction: z.boolean(),
  access: z.enum(["Road Frontage", "Legal easement", "Non-recorded easement", "No legal access"]),
  improvmentsValue: z.number().min(1).optional(),
  agreement: z.literal<boolean>(true),
});

export const voltSearchSchema = z.intersection(propertyLocationSchema, propertyOwnerValidation);
