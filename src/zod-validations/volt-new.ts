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
