import { SortEnum } from "@/types/common";
import { NotificationFilter } from "@/types/notifications";
import { PropertyTypesEnum } from "@/types/volt-details";
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
  states: z.array(z.string()).nullable(),
  counties: z.array(z.string()).nullable(),
  acreageMin: z.number({ coerce: true }).nullable(),
  acreageMax: z.number({ coerce: true }).nullable(),
  voltPriceMin: z.number({ coerce: true }).nullable(),
  voltPriceMax: z.number({ coerce: true }).nullable(),
  page: z.number({ coerce: true }),
  sortBy: z.nativeEnum(SortEnum).nullable(),
});

export const userSearchesValidations = z.object({
  search: z
    .string()
    .optional()
    .nullable()
    .transform((x) => x || null),
  states: z
    .string()
    .optional()
    .nullable()
    .transform((x) => x || null),
  counties: z
    .string()
    .optional()
    .nullable()
    .transform((x) => x || null),
  acreageMin: z
    .number({ coerce: true })
    .optional()
    .nullable()
    .transform((x) => x || null),
  acreageMax: z
    .number({ coerce: true })
    .optional()
    .nullable()
    .transform((x) => x || null),
  voltPriceMin: z
    .number({ coerce: true })
    .optional()
    .nullable()
    .transform((x) => x || null),
  voltPriceMax: z
    .number({ coerce: true })
    .optional()
    .nullable()
    .transform((x) => x || null),
  page: z
    .number({ coerce: true })
    .optional()
    .nullable()
    .transform((x) => x || null),
  sortBy: z
    .nativeEnum(SortEnum)
    .optional()
    .nullable()
    .transform((x) => x || null),
});

export const userNotificationsValidations = z.object({
  filter: z
    .nativeEnum(NotificationFilter)
    .optional()
    .nullable()
    .transform((x) => x || null),
  page: z
    .number({ coerce: true })
    .optional()
    .nullable()
    .transform((x) => x || null),
});

const schema = z.union([
  z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val === 5 || val === 15, {
      message: "Value must be either 5 or 15",
    }),
  z.number().refine((val) => val === 5 || val === 15, {
    message: "Value must be either 5 or 15",
  }),
]);

export const voltDetailsFiltersValidations = z.object({
  radius: z
    .union([
      z.coerce.number().refine((val) => val === 5),
      z.coerce.number().refine((val) => val === 10),
      z.coerce.number().refine((val) => val === 15),
    ])
    .optional(),
  soldWithin: z
    .union([
      z.coerce.number().refine((val) => val === 1),
      z.coerce.number().refine((val) => val === 2),
      z.coerce.number().refine((val) => val === 3),
    ])
    .optional(),
  acreageMin: z.coerce.number().nullable().optional().catch(null),
  acreageMax: z.coerce.number().nullable().optional().catch(null),
  propertyTypes: z.array(z.number()).nullable().optional().catch(null),
});
