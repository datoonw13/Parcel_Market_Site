import { IMap } from "@/types/map";
import { VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel, VoltSteps } from "@/types/volt";
import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { removeParcelNumberFormatting } from "@/helpers/common";
import Image from "next/image";
import { IDecodedAccessToken } from "@/types/auth";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import { capitalize } from "lodash";
import { getStateValue } from "@/helpers/states";
import NoAuthorizationSvg from "../../../public/no-authorization.svg";
import VoltItem from "./volt-item";
import { Button } from "../ui/button";

interface VoltCalculationProps {
  setValues: Dispatch<
    SetStateAction<{
      searchDetails: VoltSearchModel | null;
      searchResult: VoltSearchResultModel | null;
      selectedItem: IMap[0] | null;
      calculation: VoltPriceCalculationRes | null;
    }>
  >;
  values: {
    searchDetails: VoltSearchModel | null;
    searchResult: VoltSearchResultModel | null;
    selectedItem: IMap[0] | null;
    calculation: VoltPriceCalculationRes | null;
  };
  onSearchResultItemHover?: (parcelNumberNoFormatting: string) => void;
  onSearchResultItemMouseLeave?: (parcelNumberNoFormatting: string) => void;
  highlightedParcelNumber: string | null;
  user: IDecodedAccessToken | null;
}

const VoltCalculation: FC<VoltCalculationProps> = ({
  values,
  setValues,
  highlightedParcelNumber,
  onSearchResultItemHover,
  onSearchResultItemMouseLeave,
  user,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <div ref={ref} className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg">Subject Parcel</h1>
          <h2 className="text-sm text-grey-800">This is the parcel of land that you searched.</h2>
        </div>
        <div className="flex flex-col gap-2">
          {values.selectedItem && (
            <VoltItem
              onHover={onSearchResultItemHover}
              onMouseLeave={onSearchResultItemMouseLeave}
              id={`calculation-${values.selectedItem.properties.fields.parcelnumb}`}
              data={{
                acreage: Number(values.selectedItem.properties.fields.ll_gisacre),
                owner: values.selectedItem.properties.fields.owner,
                parcelNumber: values.selectedItem.properties.fields.parcelnumb_no_formatting,
                pricePerAcre: null,
                state: getStateValue(values.selectedItem.properties.fields.state2)?.label || "",
                county: capitalize(values.selectedItem.properties.fields.county),
              }}
              selected
              isHighlighted={highlightedParcelNumber === values.selectedItem.properties.fields.parcelnumb_no_formatting}
            />
          )}
        </div>
      </div>
      {user && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="font-semibold text-lg">Recent Sales</h1>
            <h2 className="text-sm text-grey-800">
              These are vacant land parcels that have sold in the past two years, within 10 miles of the subject parcel and are of similar
              acreage.
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {values.calculation?.properties.map((item) => (
              <VoltItem
                id={`calculation-${removeParcelNumberFormatting(item.parselId)}`}
                onHover={onSearchResultItemHover}
                onMouseLeave={onSearchResultItemMouseLeave}
                key={item.parselId}
                data={{
                  acreage: Number(item.arcage),
                  owner: item.owner || "",
                  parcelNumber: item.parselId,
                  pricePerAcre: Number(item.lastSalesPrice) / Number(item.arcage),
                  state: item.state || "",
                  county: item.county?.replace("County", "") || "",
                  lastSaleDate: item.lastSalesDate,
                  lastSalePrice: Number(item.lastSalesPrice),
                }}
                isHighlighted={highlightedParcelNumber === removeParcelNumberFormatting(item.parselId)}
              />
            ))}
          </div>
        </div>
      )}
      {!user && (
        <div className="py-6 px-4 rounded-xl border border-primary-main-400 space-y-4 flex flex-col justify-center items-center">
          <div className="relative size-16 ">
            <Image src={NoAuthorizationSvg} alt="" fill className="w-full h-full" />
          </div>
          <div>
            <p className="text-center font-semibold">Information not available</p>
            <p className="text-center text-grey-800 text-sm">If you want to see all land information, please verify</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
              sessionStorage.setItem("volt", JSON.stringify({ step: VoltSteps.CALCULATION, values }));
            }}
          >
            Sign In
          </Button>
        </div>
      )}
    </>
  );
};

export default VoltCalculation;
