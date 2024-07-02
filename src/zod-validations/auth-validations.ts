import { z } from "zod";

export const userSignInValidation = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
});

export const userSignUpValidation = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().email(),
    streetName: z.string().trim().min(1),
    unitNumber: z
      .string()
      .trim()
      .transform((val) => val || undefined),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    password: z
      .string()
      .trim()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@$%])[A-Za-z\d!@$%]{6,}$/,
        "Password must be at least 6 characters long and include at least one letter, one number, and one special character (!@$%)."
      ),
    registrationReason: z.enum(["sellLandQuickly", "lookingForLandDeal", "researchingPropertyData", "realEstateProfessional"]),
    agreeTerm: z.boolean().refine((val) => val === true, {
      message: "Please read and accept the terms and conditions",
    }),
    sendEmailTips: z.boolean(),
    repeatPassword: z.string().trim().min(1),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });
