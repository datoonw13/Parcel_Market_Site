import { z } from "zod";

export const passwordSchema = z
  .string({
    message: "Your password must contain a minimum of 8 characters and use at least one uppercase letter, number, and ay special character",
  })
  .trim()
  .regex(
    // eslint-disable-next-line no-useless-escape
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!-\/:-@[-`{-~]).{8,}$/,
    "Password should contain minimum 8 characters. Use at least one uppercase letter, numbers & any special characters"
  );

export const emailSchema = z.string().trim().email();

export const userSignInValidation = z.object({
  email: emailSchema,
  password: z.string().trim().min(1),
});

export const userSignUpValidation = (isGoogleUser?: boolean) =>
  z
    .object({
      referrer: z.string().trim(),
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().min(1),
      email: emailSchema,
      streetName: z.string().trim().min(1),
      unitNumber: z.string().trim(),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1),
      postalCode: z.string().trim().min(1).max(5),
      password: isGoogleUser ? z.undefined() : passwordSchema,
      registrationReasons: z.array(z.enum(["LandOwner", "CertifiedAppraiser", "LicensedAgent", "LandInvestor"])),
      agreeTerm: z.boolean().refine((val) => val === true, {
        message: "Please read and accept the terms and conditions",
      }),
      subscribeToEmail: z.boolean(),
      repeatPassword: isGoogleUser
        ? z.undefined()
        : z.string({ message: "Password doesn’t match" }).trim().min(1, { message: "Password doesn’t match" }),
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
  streetName: z.string().trim().min(1),
  unitNumber: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
});
