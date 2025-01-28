import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { fetcher } from "@/server-actions/fetcher";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import { ErrorResponse } from "@/helpers/error-response";
import { IVoltPriceCalculation } from "@/types/volt";
import { ResponseModel } from "@/types/common";
import VoltDetailsLayout from "@/components/volt-details/layout";
import { redirect } from "next/navigation";

const formatData = (data: any) => ({
  id: data.id,
  dateCreated: data.dateCreated,
  parcelNumber: data.parcelNumber,
  parcelNumberNoFormatting: removeParcelNumberFormatting(data.parcelNumber),
  acreage: Number(data.acrage),
  state: {
    value: data.state.toLocaleLowerCase() || "",
    label: getStateValue(data.state)?.label || data.state.toLocaleLowerCase() || "",
  },
  county: {
    value: data.county.toLocaleLowerCase() || "",
    label: getCountyValue(data.county, data.state)?.label || data.county.toLocaleLowerCase() || "",
  },
  city: data.locality,
  lat: Number(data.lat),
  lon: Number(data.lon),
  owner: data.owner,
  polygon: JSON.parse(data.coordinates),
  price: data.price,
  pricePerAcreage: data.price / Number(data.acrage),
  propertyType: data.propertyType,
  propertiesUsedForCalculation: (data?.properties || data.assessments).map((el: any) => {
    if (el.isBulked) {
      return {
        isBulked: true,
        data: {
          id:
            el.data.properties.length === 1
              ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
              : el.data.properties.map((el: any) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
          parcelNumber:
            el.data.properties.length === 1
              ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
              : el.data.properties.map((el: any) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
          parcelNumberNoFormatting:
            el.data.properties.length === 1
              ? `${removeParcelNumberFormatting(el.data.properties[0].parselId)}multiple`
              : el.data.properties.map((el: any) => removeParcelNumberFormatting(el.parselId)).join("multiple"),
          acreage: el.data.properties.reduce((acc, cur) => acc + Number(cur.arcage), 0),
          price: el.data.properties.reduce((acc, cur) => acc + Number(cur.lastSalesPrice), 0),
          pricePerAcreage:
            el.data.properties.reduce((acc, cur) => acc + Number(cur.lastSalesPrice), 0) /
            el.data.properties.reduce((acc, cur) => acc + Number(cur.arcage), 0),
          county: {
            value: el.data.properties[0].county,
            label: el.data.properties[0].county,
          },
          state: {
            value: el.data.properties[0].state,
            label: el.data.properties[0].state,
          },
          properties: el.data.properties.map((property: any) => ({
            acreage: Number(property.arcage),
            city: property.city || "",
            county: {
              value: property.county,
              label: property.county,
            },
            state: {
              value: property.state,
              label: property.state,
            },
            id: removeParcelNumberFormatting(property.parselId),
            isMedianValid: property.isMedianValid,
            isValid: property.isValid,
            lastSaleDate: property.lastSalesDate,
            lastSalePrice: Number(property.lastSalesPrice),
            lat: Number(property.latitude),
            lon: Number(property.longitude),
            parcelNumber: property.parselId,
            parcelNumberNoFormatting: removeParcelNumberFormatting(property.parselId),
            pricePerAcreage: Number((Number(property.lastSalesPrice) / Number(property.arcage)).toFixed(2)),
          })),
        },
      };
    }
    return {
      isBulked: false,
      data: {
        acreage: Number(el.data.arcage),
        city: el.data.city || "",
        county: {
          value: el.data.county,
          label: el.data.county,
        },
        state: {
          value: el.data.state,
          label: el.data.state,
        },
        id: removeParcelNumberFormatting(el.data.parselId),
        isMedianValid: el.data.isMedianValid,
        isValid: el.data.isValid,
        lastSaleDate: el.data.lastSalesDate,
        lastSalePrice: Number(el.data.lastSalesPrice),
        lat: Number(el.data.latitude),
        lon: Number(el.data.longitude),
        parcelNumber: el.data.parselId,
        parcelNumberNoFormatting: removeParcelNumberFormatting(el.data.parselId),
        pricePerAcreage: Number((Number(el.data.lastSalesPrice) / Number(el.data.arcage)).toFixed(2)),
      },
    };
  }),
});

export const getData = async (
  id: number
): Promise<
  ResponseModel<{
    data: IVoltPriceCalculation & { dateCreated: Date };
    additionalData: IVoltPriceCalculation & { dateCreated: Date };
  } | null>
> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("getAll", "true");
    const dataReq = await fetcher<any>(`properties/${id}`);
    const additionalDataReq = await fetcher<any>(`properties/${id}?getAll=true`);
    console.log(JSON.stringify(dataReq));

    return {
      errorMessage: null,
      data: {
        data: formatData(dataReq),
        additionalData: formatData(additionalDataReq),
      },
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
    redirect(`/volt/2?${newParams.toString()}`);
  }

  const data = filtersValidation.data ? await getData(Number(params.id)) : null;

  return (
    filtersValidation.data && <VoltDetailsLayout data={data?.data || null} initialFilters={INITIAL_FILTERS} searchParams={searchParams} />
  );
};

export default VoltPropertyDetailsPage;
