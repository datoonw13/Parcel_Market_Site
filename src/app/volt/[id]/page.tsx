import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { fetcher } from "@/server-actions/fetcher";
import { ErrorResponse } from "@/helpers/error-response";
import { ResponseModel } from "@/types/common";
import VoltDetailsLayout from "@/components/volt-details/layout";
import { redirect } from "next/navigation";
import { PropertyDataSchema } from "@/zod-validations/volt-new";

const getData = async (params: string): Promise<ResponseModel<z.infer<typeof PropertyDataSchema> | null>> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("getAll", "true");
    const req = await fetcher<Promise<z.infer<typeof PropertyDataSchema>>>(`properties/saleData?${params}`);
    const data = await PropertyDataSchema.safeParseAsync(req);
    return {
      errorMessage: null,
      data: data.data!,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

const INITIAL_FILTERS = {
  radius: 10,
  acreageMin: null,
  acreageMax: null,
  propertyTypes: null,
  soldWithin: 2,
} as z.infer<typeof voltDetailsFiltersValidations>;

const VoltPropertyDetailsPage = async ({ searchParams, params }: { searchParams: { [key: string]: string }; params: { id: string } }) => {
  const filtersValidation = await voltDetailsFiltersValidations.safeParseAsync({
    ...searchParams,
  });

  if (filtersValidation.error) {
    const newParams = new URLSearchParams(searchParams);
    Object.keys(INITIAL_FILTERS).forEach((key) => {
      if (INITIAL_FILTERS[key as keyof typeof INITIAL_FILTERS]) {
        newParams.set(key, INITIAL_FILTERS[key as keyof typeof INITIAL_FILTERS]!?.toString());
      } else {
        newParams.delete(key);
      }
    });
    redirect(`/volt/${params.id}?${newParams.toString()}`);
  }

  const queryParams = new URLSearchParams(searchParams);
  queryParams.set("propertyId", params.id);
  const data = filtersValidation.data ? await getData(queryParams.toString()) : null;
  const propertyTypes = await fetcher<Array<{ id: number; group: "vacant-land" | "other"; value: string }>>("properties/propertyTypes");

  console.log(JSON.stringify(data));

  const testData = {
    errorMessage: null,
    data: {
      id: 2832,
      owner: "Davis Jonathan Godfrey",
      state: "Georgia",
      county: "Taylor County",
      propertyType: "Residential",
      parcelNumber: "B53D   081",
      legalDescription: null,
      price: 58414,
      dateCreated: "2025-02-03T06:00:03.367Z",
      city: null,
      coordinates:
        "[[[[-84.22327816486359,32.56051362970774],[-84.22327816486359,32.56093862691371]]],[[[-84.22163128852844,32.56095219062118],[-84.22163128852844,32.561463088775966]]]]",
      lat: 32.560657,
      lon: -84.223597,
      locality: "",
      median: 64102.56410256411,
      medianLowerBound: 32051.282051282054,
      medianUpperBound: 192307.6923076923,
      averagePricePerAcreValidMedians: 81129.99190073877,
      radius: 5,
      soldWithin: null,
      acreageMin: 1.5,
      acreageMax: 3,
      propertyTypes: null,
      assessments: [
        {
          isBulked: false,
          data: {
            id: 331177,
            owner: null,
            propertyType: "RESIDENTIAL - VACANT LAND",
            isValid: true,
            isMedianValid: false,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 5500,
            lastSalesDate: "2024-05-31T00:00:00.000Z",
            latitude: 32.553976,
            longitude: -84.25088,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 2.32,
            parcelNumber: "B02 024 A",
            parcelNumberNoFormatting: "B02024A",
            pricePerAcreage: 2370.689655172414,
          },
        },
        {
          isBulked: false,
          data: {
            id: 331178,
            owner: null,
            propertyType: "RESIDENTIAL - VACANT LAND",
            isValid: true,
            isMedianValid: false,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 8800,
            lastSalesDate: "2024-01-12T00:00:00.000Z",
            latitude: 32.547898,
            longitude: -84.247314,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 2.75,
            parcelNumber: "B05 066",
            parcelNumberNoFormatting: "B05066",
            pricePerAcreage: 3200,
          },
        },
        {
          isBulked: false,
          data: {
            id: 331179,
            owner: null,
            propertyType: "MOBILE HOME",
            isValid: true,
            isMedianValid: false,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 13000,
            lastSalesDate: "2024-08-28T00:00:00.000Z",
            latitude: 32.554867,
            longitude: -84.24847,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 2.21,
            parcelNumber: "B04 034",
            parcelNumberNoFormatting: "B04034",
            pricePerAcreage: 5882.35294117647,
          },
        },
        {
          isBulked: false,
          data: {
            id: 331180,
            owner: null,
            propertyType: "SINGLE FAMILY RESIDENCE",
            isValid: true,
            isMedianValid: false,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 55000,
            lastSalesDate: "2023-04-12T00:00:00.000Z",
            latitude: 32.557684,
            longitude: -84.247736,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 1.84,
            parcelNumber: "B03 022",
            parcelNumberNoFormatting: "B03022",
            pricePerAcreage: 29891.304347826084,
          },
        },
        {
          isBulked: false,
          data: {
            id: 331183,
            owner: null,
            propertyType: "MEDICAL BUILDING",
            isValid: true,
            isMedianValid: true,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 200000,
            lastSalesDate: "2024-04-16T00:00:00.000Z",
            latitude: 32.558042,
            longitude: -84.245071,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 2.63,
            parcelNumber: "B03 018",
            parcelNumberNoFormatting: "B03018",
            pricePerAcreage: 76045.62737642587,
          },
        },
        {
          isBulked: false,
          data: {
            id: 331184,
            owner: null,
            propertyType: "SINGLE FAMILY RESIDENCE",
            isValid: true,
            isMedianValid: true,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 160000,
            lastSalesDate: "2023-12-18T00:00:00.000Z",
            latitude: 32.549284,
            longitude: -84.236786,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 1.89,
            parcelNumber: "B11 024",
            parcelNumberNoFormatting: "B11024",
            pricePerAcreage: 84656.08465608465,
          },
        },
        {
          isBulked: false,
          data: {
            id: 331185,
            owner: null,
            propertyType: "SINGLE FAMILY RESIDENCE",
            isValid: true,
            isMedianValid: true,
            address: "BUTLER, GA 31006",
            lastSalesPrice: 254500,
            lastSalesDate: "2024-08-08T00:00:00.000Z",
            latitude: 32.544038,
            longitude: -84.23688,
            state: "Georgia",
            county: "Taylor County",
            isMainProperty: false,
            acreage: 2.18,
            parcelNumber: "B54D 018 A",
            parcelNumberNoFormatting: "B54D018A",
            pricePerAcreage: 116743.11926605504,
          },
        },
        {
          isBulked: true,
          data: {
            acreage: 1.95,
            price: 125000,
            pricePerAcreage: 64102.5641025641,
            state: "Georgia",
            county: "Taylor County",
            properties: [
              {
                id: 331181,
                owner: null,
                propertyType: "VACANT COMMERCIAL",
                isValid: true,
                isMedianValid: true,
                address: "BUTLER, GA 31006",
                lastSalesPrice: 60897.4358974359,
                lastSalesDate: "2023-07-18T00:00:00.000Z",
                latitude: 32.546031,
                longitude: -84.245146,
                state: "Georgia",
                county: "Taylor County",
                isMainProperty: false,
                acreage: 0.95,
                parcelNumber: "B54B 031 D",
                parcelNumberNoFormatting: "B54B031D",
                pricePerAcreage: 64102.56410256411,
              },
              {
                id: 331182,
                owner: null,
                propertyType: "VACANT COMMERCIAL",
                isValid: true,
                isMedianValid: false,
                address: "BUTLER, GA 31006",
                lastSalesPrice: 64102.56410256411,
                lastSalesDate: "2023-07-18T00:00:00.000Z",
                latitude: 32.546171,
                longitude: -84.245649,
                state: "Georgia",
                county: "Taylor County",
                isMainProperty: false,
                acreage: 1,
                parcelNumber: "B53D081",
                parcelNumberNoFormatting: "B53D081",
                pricePerAcreage: 64102.56410256411,
              },
            ],
            isMedianValid: false,
            id: "B54B031DmultipleB53D081",
          },
        },
      ],
      acreage: 0.72,
      parcelNumberNoFormatting: "B53D081",
    },
  };

  return (
    filtersValidation.data &&
    data?.data && (
      <VoltDetailsLayout propertyTypes={propertyTypes} data={testData.data} initialFilters={INITIAL_FILTERS} searchParams={searchParams} />
    )
  );
};

export default VoltPropertyDetailsPage;
