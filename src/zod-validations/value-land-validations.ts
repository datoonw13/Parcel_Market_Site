import { z } from "zod";

const landAddressValidation = z.object({
  state: z.string().min(1),
  county: z.string().min(1),
});

export const landOwnerValidation = z
  .object({
    type: z.enum(["fullName", "entityName", "parcelNumber"]),
    parcelNumber: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    entityName: z.string().optional(),
  })
  .superRefine(({ parcelNumber, type, entityName, firstName, lastName }, context) => {
    if (type === "parcelNumber" && (!parcelNumber || (parcelNumber && parcelNumber.length < 2))) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 2,
        type: "string",
        inclusive: true,
        path: ["parcelNumber"],
      });
    }
    if (type === "entityName" && !entityName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["entityName"],
      });
    }
    if (type === "fullName" && !firstName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["firstName"],
      });
    }
    if (type === "fullName" && !lastName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["lastName"],
      });
    }
  });

export const aboutLandSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(500).optional(),
  waterFeature: z.boolean(),
  frontNavigable: z.boolean(),
  cover: z.array(z.enum(["Wooded", "Open Field", "Mixed", "Clear Cut", "Desert"])).min(1),
  topography: z.enum(["Very Steep", "Some Steep areas", "Gently Rolling", "Flat"]),
  wet: z.enum(["Wet", "Some portions wet", "Not Wet"]),
  restriction: z.boolean(),
  access: z.enum(["Road Frontage", "Legal easement", "Non-recorded easement", "No legal access"]),
  improvmentsValue: z.number().min(1).optional(),
  agreement: z.literal<boolean>(true),
});

export const valueLandDetailsValidations = z.intersection(landAddressValidation, landOwnerValidation);
