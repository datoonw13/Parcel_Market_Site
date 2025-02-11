import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { fetcher } from "@/server-actions/fetcher";
import { z } from "zod";
import { IMainPropertyBaseInfo } from "@/types/property";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { getCounty, getState } from "@/helpers/states";
import { ErrorResponse } from "@/helpers/error-response";
import VoltSearchDetails from "./search-details";
import VoltSearchResults from "./search-results";

const getData = async (data: z.infer<typeof propertySearchTypeValidation>) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
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

const SearchAsyncWrapper = async ({ searchParams }: { searchParams: z.infer<typeof propertySearchTypeValidation> | null }) => {
  const request = !searchParams ? null : await getData(searchParams);

  return (
    <>
      <VoltSearchDetails searchParams={searchParams} isError={!!request?.errorMessage} />
      {request?.data && <VoltSearchResults data={request.data} />}
    </>
  );
};

export default SearchAsyncWrapper;
