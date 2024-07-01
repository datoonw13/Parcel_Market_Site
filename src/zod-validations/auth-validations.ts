import { z } from "zod";

export const UserSignInValidation = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
});

export const UserSignUpValidation = z.object({
  email: z.string().trim(),
  mailingAddress: z.string().trim(),
  state: z.string().trim(),
  county: z.string().trim(),
  mobileNumber: z.string().trim(),
  password: z.string().trim(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  registrationReason: z.enum(['sellLandQuickly', 'lookingForLandDeal', 'researchingPropertyData', 'realEstateProfessional']),
  unitNumber: z.string().trim(),
  city: z.string().trim(),
  postalCode: z.string().trim(),
  streetName: z.string().trim(),
});