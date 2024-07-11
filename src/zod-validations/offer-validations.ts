import { z } from "zod";

export const offerValidation = z.object({
  price: z.number().min(1),
  earnestMoney: z.number().min(0).max(100).optional(),
  inspectionPeriodDays: z.number().min(1).optional(),
  closingPeriodDays: z.number().min(1).max(45),
  closingCosts: z.string().min(1).optional(),
  contigencies: z.string().min(1).optional(),
  offerActiveForDays: z.number().min(3),
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
