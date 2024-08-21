import { SortEnum } from "@/types/common";
import { z } from "zod";

export const marketplaceFiltersValidations = z.object({
  search: z.string().nullable().optional(),
  states: z.string().nullable().optional(),
  counties: z.string().nullable().optional(),
  acreageMin: z.number({ coerce: true }).nullable().optional(),
  acreageMax: z.number({ coerce: true }).nullable().optional(),
  voltValueMin: z.number({ coerce: true }).nullable().optional(),
  voltValueMax: z.number({ coerce: true }).nullable().optional(),
  page: z.number({ coerce: true }).optional(),
  sortBy: z.nativeEnum(SortEnum).nullable().optional(),
});
