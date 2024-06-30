import { z } from "zod";

export const UserSignInValidation = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().trim().min(1),
});
