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


export const userPropertiesFiltersValidations = z.object({
  states: z.array(z.string()).nullable().nullable(),
  counties: z.array(z.string()).nullable().nullable(),
  acreageMin: z.number({ coerce: true }).nullable(),
  acreageMax: z.number({ coerce: true }).nullable(),
  voltPriceMin: z.number({ coerce: true }).nullable(),
  voltPriceMax: z.number({ coerce: true }).nullable(),
  page: z.number({ coerce: true }),
  sortBy: z.nativeEnum(SortEnum).nullable(),
});
