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

export const defaultSignInSchema = z.object({
  email: emailSchema,
  password: z.string().trim().min(1),
});

export const userSignUpValidation = (isThirdPartyAuth?: boolean) =>
  z
    .object({
      email: emailSchema,
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().min(1),
      redirectUrl: z.string().optional(),
      password: isThirdPartyAuth ? z.undefined() : passwordSchema,
      registrationReasons: z.array(z.enum(["LandOwner", "CertifiedAppraiser", "LicensedAgent", "LandInvestor"])),
      subscribeToEmail: z.boolean(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmTerm: z.string().optional(),
      utmContent: z.string().optional(),
      userSource: z.string().optional(),
      agreeTerm: z.boolean().refine((val) => val === true, {
        message: "Please read and accept the terms and conditions",
      }),
      repeatPassword: isThirdPartyAuth
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
});
