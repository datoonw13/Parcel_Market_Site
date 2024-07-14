import { z } from "zod";

export const offerValidation = z.object({
  price: z.number().min(1),
  earnestMoney: z.number().min(1).max(100).nullable(),
  inspectionPeriodDays: z.number().min(1).nullable(),
  closingPeriodDays: z.union([z.literal(15), z.literal(30), z.literal(45)]),
  closingCosts: z.string().min(1),
  contigencies: z.string().min(1).nullable(),
  offerActiveForDays: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  otherTerms: z.string().optional(),
});

//   export class CreateOfferDto {
//     @IsNumber()
//     price: number;

//     @IsOptional()
//     @IsNumber()
//     @Min(0)
//     @Max(100)
//     earnestMoney?: number;

//     @IsOptional()
//     @IsInt()
//     inspectionPeriodDays?: number;

//     @IsInt()
//     @Min(1)
//     @Max(45)
//     closingPeriodDays: number;

//     @IsOptional()
//     @IsString()
//     closingCosts: string;

//     @IsOptional()
//     @IsString()
//     contigencies?: string;

//     @IsInt()
//     @Min(3)
//     offerAtiveForDays: number;

//     @IsInt()
//     sellingPropertyId: number;

//     @IsOptional()
//     @IsString()
//     otherTerms: string;
//   }
