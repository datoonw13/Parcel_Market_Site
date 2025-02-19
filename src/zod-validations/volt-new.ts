import { moneyFormatter, removeParcelNumberFormatting } from "@/helpers/common";
import { getCounty, getState } from "@/helpers/states";
import { hideNumber, hideString } from "@/lib/utils";
import { uuid } from "short-uuid";
import { z } from "zod";

export const searchType = z.enum(["fullName", "entityName", "parcelNumber", "map"]);

export const propertySearchTypeValidation = z
  .object({
    searchType,
    parcelNumber: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    entityName: z.string().trim().optional(),
    state: z.string().min(1),
    county: z.string().min(1),
  })
  .superRefine(({ parcelNumber, searchType, entityName, firstName, lastName }, context) => {
    if (searchType === "parcelNumber" && (!parcelNumber || (parcelNumber && parcelNumber.length < 2))) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 2,
        type: "string",
        inclusive: true,
        path: ["parcelNumber"],
      });
    }
    if (searchType === "entityName" && !entityName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["entityName"],
      });
    }
    if (searchType === "fullName" && !firstName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["firstName"],
      });
    }
    if (searchType === "fullName" && !lastName) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "string",
        inclusive: true,
        path: ["lastName"],
      });
    }
  });

// Define the schema for an individual assessment

export const AssessmentBaseSchema = z
  .object({
    id: z.number(),
    owner: z.string().nullable(),
    parselId: z.string(),
    propertyType: z.string(),
    arcage: z.coerce.number(),
    isValid: z.boolean(),
    isMedianValid: z.boolean(),
    address: z.string(),
    lastSalesPrice: z.coerce.number(),
    lastSalesDate: z.coerce.date(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    state: z.string(),
    county: z.string().nullable().optional(),
    isMainProperty: z.boolean().nullable(),
  })
  .transform(({ arcage, parselId, lastSalesPrice, lastSalesDate, id, state, county, ...input }) => ({
    ...input,
    id: uuid(),
    acreage: arcage,
    parcelNumber: parselId,
    lastSalePrice: lastSalesPrice,
    lastSaleDate: lastSalesDate,
    pricePerAcreage: lastSalesPrice / arcage,
    state: {
      value: "",
      label: "",
      ...(getState(state) || {}),
    },
    county: {
      value: "",
      label: "",
      ...(getCounty(county || "", state) || {}),
    },
  }));

const BulkAssessmentBaseSchema = z
  .object({
    acreage: z.number(),
    price: z.number(),
    pricePerAcreage: z.number(),
    state: z.string(),
    county: z.string().nullable().optional(),
    properties: z.array(AssessmentBaseSchema),
    isMedianValid: z.boolean().optional(),
    group: z.string(),
  })
  .transform((input) => ({
    ...input,
    id: uuid(),
    isMedianValid: input.isMedianValid === undefined ? true : input.isMedianValid,
    lastSaleDate: input.properties[0].lastSaleDate,
    propertyType: input.properties[0].propertyType,
  }));

const AssessmentSchema = z.discriminatedUnion("isBulked", [
  z.object({
    isBulked: z.literal(true),
    data: BulkAssessmentBaseSchema,
  }),
  z.object({
    isBulked: z.literal(false),
    data: AssessmentBaseSchema,
  }),
]);

export const PropertyDataSchema = z
  .object({
    subscribed: z.boolean(),
    id: z.number(),
    owner: z.string(),
    state: z.string(),
    county: z.string(),
    propertyType: z.string(),
    acrage: z.coerce.number(),
    parcelNumber: z.string(),
    legalDescription: z.string().nullable(),
    price: z.coerce.number(),
    dateCreated: z.coerce.date(),
    city: z.string().nullable(),
    coordinates: z.string(),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    locality: z.string(),
    median: z.coerce.number(),
    medianLowerBound: z.coerce.number(),
    medianUpperBound: z.coerce.number(),
    averagePricePerAcreValidMedians: z.coerce.number(),
    assessments: z.array(AssessmentSchema),
    filters: z.object({
      radius: z.coerce.number(),
      soldWithin: z.coerce.number(),
      acreageMin: z.coerce.number(),
      acreageMax: z.coerce.number(),
      propertyTypes: z.string().nullable(),
    }),
  })
  .transform(({ acrage, subscribed, price, parcelNumber, assessments, ...input }) => {
    const axisPositionInPercent = (price: number, min: number, max: number) => ((price - min) / (max - min)) * 100;

    const getAssessmentsAllPrices = () => {
      const allPrices: number[] = [];
      const validPrices: number[] = [];
      assessments.forEach((el) => {
        if (el.data.isMedianValid) {
          validPrices.push(el.data.pricePerAcreage);
        }
        allPrices.push(el.data.pricePerAcreage);
      });
      return {
        allPrices,
        validPrices,
      };
    };
    const { allPrices, validPrices } = getAssessmentsAllPrices();
    const minPriceOfAllAssessments = Math.min(...allPrices);
    const maxPriceOfAllAssessments = Math.max(...allPrices);
    const avgPriceOfAllAssessments = allPrices.reduce((acc, cur) => acc + cur, 0) / allPrices.length;
    //
    const minPriceOfValidAssessments = Math.min(...validPrices);
    const maxPriceOfValidAssessments = Math.max(...validPrices);
    const avgPriceOfValidAssessments = validPrices.reduce((acc, cur) => acc + cur, 0) / validPrices.length;

    const formattedAssessments = assessments.map((el) => {
      if (el.isBulked) {
        const { acreage, county, isMedianValid, pricePerAcreage, state, group, price, properties, lastSaleDate, propertyType } = el.data;
        const uniqueCounties = new Set(el.data.properties.map((el) => el.county.value));
        const uniquePropertyTypes = new Set(el.data.properties.map((el) => el.propertyType));
        const totalProperties = el.data.properties.length;

        return {
          ...el,
          data: {
            id: uuid(),
            lastSaleDate,
            isMedianValid,
            group,
            acreage: {
              value: acreage,
              formattedString: acreage.toFixed(2),
            },
            lastSalePrice: {
              value: subscribed ? price : null,
              formattedString: subscribed ? moneyFormatter.format(price) : hideString(moneyFormatter.format(price)),
            },
            pricePerAcreage: {
              value: subscribed ? pricePerAcreage : null,
              formattedString: subscribed ? moneyFormatter.format(pricePerAcreage) : hideString(moneyFormatter.format(pricePerAcreage)),
              axis: {
                all: axisPositionInPercent(pricePerAcreage, minPriceOfAllAssessments, maxPriceOfAllAssessments),
                valid: axisPositionInPercent(pricePerAcreage, minPriceOfValidAssessments, maxPriceOfValidAssessments),
              },
            },
            state: {
              value: "",
              label: "",
              ...(getState(state) || {}),
            },
            county: {
              value: "",
              label: "",
              ...(getCounty(county || "", state) || {}),
            },
            properties: properties.map((property) => ({
              ...property,
              id: uuid(),
              pricePerAcreage: {
                value: subscribed ? property.pricePerAcreage : null,
                formattedString: subscribed
                  ? moneyFormatter.format(property.pricePerAcreage)
                  : hideNumber(moneyFormatter.format(property.pricePerAcreage)),
                axis: {
                  all: axisPositionInPercent(property.pricePerAcreage, minPriceOfAllAssessments, maxPriceOfAllAssessments),
                  valid: axisPositionInPercent(property.pricePerAcreage, minPriceOfValidAssessments, maxPriceOfValidAssessments),
                },
              },
              lastSalePrice: {
                value: subscribed ? property.lastSalePrice : null,
                formattedString: subscribed
                  ? moneyFormatter.format(property.lastSalePrice)
                  : hideNumber(moneyFormatter.format(property.lastSalePrice)),
              },
              acreage: {
                value: property.acreage,
                formattedString: property.acreage.toFixed(2),
              },
              parcelNumber: {
                value: subscribed ? property.parcelNumber : null,
                formattedString: subscribed
                  ? removeParcelNumberFormatting(property.parcelNumber)
                  : hideString(removeParcelNumberFormatting(property.parcelNumber)),
              },
              isSellingProperty: removeParcelNumberFormatting(property.parcelNumber) === removeParcelNumberFormatting(parcelNumber),
            })),
            uniqueCounties: uniqueCounties.size,
            uniquePropertyTypes: uniquePropertyTypes.size,
            totalProperties,
            propertyType,
            hasSellingProperty: !!properties.find(
              (el) => removeParcelNumberFormatting(el.parcelNumber) === removeParcelNumberFormatting(parcelNumber)
            ),
          },
        };
      }
      return {
        ...el,
        data: {
          ...el.data,
          id: uuid(),
          pricePerAcreage: {
            value: subscribed ? el.data.pricePerAcreage : null,
            formattedString: subscribed
              ? moneyFormatter.format(el.data.pricePerAcreage)
              : hideNumber(moneyFormatter.format(el.data.pricePerAcreage)),
            axis: {
              all: axisPositionInPercent(el.data.pricePerAcreage, minPriceOfAllAssessments, maxPriceOfAllAssessments),
              valid: axisPositionInPercent(el.data.pricePerAcreage, minPriceOfValidAssessments, maxPriceOfValidAssessments),
            },
          },
          lastSalePrice: {
            value: subscribed ? el.data.lastSalePrice : null,
            formattedString: subscribed
              ? moneyFormatter.format(el.data.lastSalePrice)
              : hideNumber(moneyFormatter.format(el.data.lastSalePrice)),
          },
          acreage: {
            value: el.data.acreage,
            formattedString: el.data.acreage.toFixed(2),
          },
          parcelNumber: {
            value: subscribed ? el.data.parcelNumber : null,
            formattedString: subscribed
              ? removeParcelNumberFormatting(el.data.parcelNumber)
              : hideString(removeParcelNumberFormatting(el.data.parcelNumber)),
          },
          isSellingProperty: removeParcelNumberFormatting(el.data.parcelNumber) === removeParcelNumberFormatting(parcelNumber),
        },
      };
    });

    return {
      ...input,
      id: uuid(),
      state: {
        value: "",
        label: "",
        ...(getState(input.state) || {}),
      },
      county: {
        value: "",
        label: "",
        ...(getCounty(input.county, input.state) || {}),
      },
      acreage: {
        value: acrage,
        formattedString: acrage.toFixed(2),
      },
      price: {
        value: subscribed ? price : null,
        formattedString: subscribed ? moneyFormatter.format(price) : hideNumber(moneyFormatter.format(price)),
      },
      pricePerAcreage: {
        value: subscribed ? price / acrage : null,
        formattedString: subscribed ? moneyFormatter.format(price / acrage) : hideNumber(moneyFormatter.format(price / acrage)),
        axis: {
          all: axisPositionInPercent(price / acrage, minPriceOfAllAssessments, maxPriceOfAllAssessments),
          valid: axisPositionInPercent(price / acrage, minPriceOfValidAssessments, maxPriceOfValidAssessments),
        },
      },
      parcelNumber: {
        value: parcelNumber,
        formattedString: removeParcelNumberFormatting(parcelNumber),
      },
      assessments: {
        calculations: {
          minPriceOfAllAssessments: {
            value: subscribed ? minPriceOfAllAssessments : null,
            formattedString: subscribed
              ? moneyFormatter.format(minPriceOfAllAssessments)
              : hideNumber(moneyFormatter.format(minPriceOfAllAssessments)),
          },
          maxPriceOfAllAssessments: {
            value: subscribed ? maxPriceOfAllAssessments : null,
            formattedString: subscribed
              ? moneyFormatter.format(maxPriceOfAllAssessments)
              : hideNumber(moneyFormatter.format(maxPriceOfAllAssessments)),
          },
          avgPriceOfAllAssessments: {
            value: subscribed ? avgPriceOfAllAssessments : null,
            formattedString: subscribed
              ? moneyFormatter.format(avgPriceOfAllAssessments)
              : hideNumber(moneyFormatter.format(avgPriceOfAllAssessments)),
            axis: {
              all: axisPositionInPercent(avgPriceOfAllAssessments, minPriceOfAllAssessments, maxPriceOfAllAssessments),
              valid: axisPositionInPercent(avgPriceOfAllAssessments, minPriceOfValidAssessments, maxPriceOfValidAssessments),
            },
          },
          minPriceOfValidAssessments: {
            value: subscribed ? minPriceOfValidAssessments : null,
            formattedString: subscribed
              ? moneyFormatter.format(minPriceOfValidAssessments)
              : hideNumber(moneyFormatter.format(minPriceOfValidAssessments)),
          },
          maxPriceOfValidAssessments: {
            value: subscribed ? maxPriceOfValidAssessments : null,
            formattedString: subscribed
              ? moneyFormatter.format(maxPriceOfValidAssessments)
              : hideNumber(moneyFormatter.format(maxPriceOfValidAssessments)),
          },
          avgPriceOfValidAssessments: {
            value: subscribed ? avgPriceOfValidAssessments : null,
            formattedString: subscribed
              ? moneyFormatter.format(avgPriceOfValidAssessments)
              : hideNumber(moneyFormatter.format(avgPriceOfValidAssessments)),
            axis: {
              all: axisPositionInPercent(avgPriceOfValidAssessments, minPriceOfAllAssessments, maxPriceOfAllAssessments),
              valid: axisPositionInPercent(avgPriceOfValidAssessments, minPriceOfValidAssessments, maxPriceOfValidAssessments),
            },
          },
        },
        data: formattedAssessments,
      },
    };
  });
