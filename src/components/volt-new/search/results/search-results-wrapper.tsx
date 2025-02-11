import { removeParcelNumberFormatting } from "@/helpers/common";
import { ErrorResponse } from "@/helpers/error-response";
import { getCounty, getState } from "@/helpers/states";
import { fetcher } from "@/server-actions/fetcher";
import { IMainPropertyBaseInfo } from "@/types/property";
import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { redirect } from "next/navigation";
import { FC } from "react";
import { z } from "zod";
import VoltSearchAlerts from "./search-results-warning";
import VoltSearchResults from "./search-results";

interface IVoltSearchResultsWrapper {
  searchParams: { [key: string]: string };
}

const VALID_SEARCH_PARAMS_KEY = ["searchType", "parcelNumber", "firstName", "lastName", "entityName", "state", "county"];

const getData = async (data: z.infer<typeof propertySearchTypeValidation>) => {
  try {
    const apiUrl = data.searchType === "parcelNumber" ? "searchByStateAndCountyAndParcel" : "searchByStateAndCountyAndOwner";
    const request = await fetcher<any[]>(`regrid/${apiUrl}?${new URLSearchParams(data)}`, {
      next: {
        revalidate: 3600,
      },
    });

    const formattedData: IMainPropertyBaseInfo[] = request.map((property) => ({
      id: removeParcelNumberFormatting(property.properties.fields.parcelnumb),
      parcelNumber: property.properties.fields.parcelnumb,
      parcelNumberNoFormatting: removeParcelNumberFormatting(property.properties.fields.parcelnumb),
      owner: property.properties.fields.owner,
      acreage: Number(property.properties.fields.ll_gisacre),
      city: property.properties.fields.city,
      county: {
        value: property.properties.fields.county.toLocaleLowerCase(),
        label:
          getCounty(property.properties.fields.county, property.properties.fields.state2)?.label ||
          property.properties.fields.county.toLocaleLowerCase(),
      },
      state: {
        value: property.properties.fields.state2.toLocaleLowerCase(),
        label: getState(property.properties.fields.state2)?.label || property.properties.fields.state2.toLocaleLowerCase(),
      },
      lat: Number(property.properties.fields.lat),
      lon: Number(property.properties.fields.lon),
      polygon: property.geometry.coordinates,
      propertyType: property.properties.fields?.zoning_description || property.properties.fields.usedesc || "",
    }));

    return {
      data: formattedData,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      data: null,
      errorMessage: errorData.message,
    };
  }
};

const VoltSearchResultsWrapper: FC<IVoltSearchResultsWrapper> = async ({ searchParams }) => {
  const searchParamsObj = Object.fromEntries(new URLSearchParams(searchParams));
  const searchParamsObjFiltered = Object.keys(searchParamsObj)
    .filter((el) => VALID_SEARCH_PARAMS_KEY.includes(el))
    .reduce((acc, cur) => ({ ...acc, [cur]: searchParamsObj[cur] }), {});
  const validationResult = await propertySearchTypeValidation.safeParseAsync(searchParamsObjFiltered);

  if (validationResult.error && Object.keys(searchParamsObjFiltered).length > 0) {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.keys(searchParamsObjFiltered).forEach((key) => {
      newSearchParams.delete(key);
    });
    return redirect(`/volt-new?${newSearchParams.toString()}`);
  }

  if (validationResult.data?.entityName) {
    validationResult.data.firstName = validationResult.data?.entityName;
    delete validationResult.data.entityName;
  }

  const request = validationResult.error ? null : await getData(validationResult.data!);

  if (request?.errorMessage) {
    return <VoltSearchAlerts />;
  }

  return request?.data && <VoltSearchResults data={request.data} />;
};

export default VoltSearchResultsWrapper;
