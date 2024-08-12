import { z } from "zod";

export const offerValidation = z.object({
  price: z.number().min(1).max(999999999),
  earnestMoney: z.number().min(1).max(100).nullable(),
  inspectionPeriodDays: z.number().min(1).nullable(),
  closingPeriodDays: z.union([z.literal(15), z.literal(30), z.literal(45)]),
  closingCosts: z.string().min(1),
  contigencies: z.array(z.string().min(1)).min(1).nullable(),
  offerActiveForDays: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
    z.literal(11),
    z.literal(12),
    z.literal(13),
    z.literal(14),
  ]),
  otherTerms: z.string().optional(),
});
