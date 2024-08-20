import { z } from "zod";

export const passwordSchema = z
  .string()
  .trim()
  .regex(
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
    "Password should contain minimum 8 characters. Use at least one uppercase letter, numbers & special characters ($, ^, *, +)"
  );

export const emailSchema = z.string().trim().email();

export const userSignInValidation = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
});

export const userSignUpValidation = (isGoogleUser?: boolean) =>
  z
    .object({
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().min(1),
      email: emailSchema,
      streetName: z.string().trim().min(1),
      unitNumber: z.string().trim().min(1),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1),
      postalCode: z.string().trim().min(1).max(5),
      password: isGoogleUser ? z.undefined() : passwordSchema,
      registrationReasons: z.array(z.enum(["sellLandQuickly", "lookingForLandDeal", "researchingPropertyData", "realEstateProfessional"])),
      agreeTerm: z.boolean().refine((val) => val === true, {
        message: "Please read and accept the terms and conditions",
      }),
      sendEmailTips: z.boolean(),
      repeatPassword: isGoogleUser ? z.undefined() : z.string().trim().min(1, { message: "Password doesn’t match" }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Password doesn’t match",
      path: ["repeatPassword"],
    });

export const userPasswordResetValidations = z
  .object({
    oldPassword: z.string().trim().min(1),
    newPassword: passwordSchema,
    repeatNewPassword: z.string().trim().min(1, { message: "Password doesn’t match" }),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Password doesn’t match",
    path: ["repeatNewPassword"],
  });

export const updateUserInfoSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: emailSchema,
  streetName: z.string().trim().min(1),
  unitNumber: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
});
