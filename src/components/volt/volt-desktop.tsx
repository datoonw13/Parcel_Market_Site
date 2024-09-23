import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/icons/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { VoltPriceCalculationReq, VoltPriceCalculationRes, VoltSearchModel, VoltSearchResultModel, VoltSteps } from "@/types/volt";
import { IMap } from "@/types/map";
import useNotification from "@/hooks/useNotification";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import { PropertyPriceCalculationRes } from "@/types/property";
import VoltSearch from "./volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltDesktopMap from "./volt-desktop-map";
import { Button } from "../ui/button";
import VoltCalculation from "./volt-calculation";

const primaryLayout = `"details map" "footer map"`;
const secondaryLayout = `"details map" "footer footer"`;

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
}

function isElementVisible(parcelNumberNoFormatting: string, step: VoltSteps) {
  const rect = document
    .getElementById(`${step === VoltSteps.SEARCH_RESULTS ? "search-result-" : "calculation-"}${parcelNumberNoFormatting}`)
    ?.getBoundingClientRect();

  const containerRect = document.querySelector("#volt-scroll>div")?.getBoundingClientRect();

  if (!containerRect || !rect) {
    return false;
  }
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
}

const VoltDesktop: FC<VoltDesktopProps> = ({ user, setStep, step }) => {
  const { notify } = useNotification();

  const [calculationPending, setCalculationPending] = useState(false);
  const [highlightedParcelNumber, setHighlightedParcelNumber] = useState<string | null>(null);
  const [values, setValues] = useState<{
    searchDetails: VoltSearchModel | null;
    searchResult: VoltSearchResultModel | null;
    selectedItem: IMap[0] | null;
    calculation: VoltPriceCalculationRes | null;
  }>({
    searchDetails: null,
    searchResult: null,
    selectedItem: null,
    calculation: null,
  });

  const calculatePrice = async () => {
    if (!values.selectedItem) {
      return;
    }
    const reqData: VoltPriceCalculationReq = {
      body: {
        county: values.selectedItem?.properties.fields.county.toLocaleLowerCase(),
        state: values.selectedItem?.properties.fields.state2.toLocaleLowerCase(),
        parcelNumber: values.selectedItem?.properties.fields.parcelnumb,
        owner: values.selectedItem.properties.fields.owner,
        propertyType: values.selectedItem.properties.fields?.zoning_description || values.selectedItem.properties.fields.usedesc || "",
        coordinates: JSON.stringify(values.selectedItem.geometry.coordinates),
        locality: values.selectedItem.properties.fields.city,
      },
      queryParams: {
        acre: values.selectedItem.properties.fields.ll_gisacre.toString(),
        lat: values.selectedItem.properties.fields.lat,
        lon: values.selectedItem.properties.fields.lon,
      },
    };
    setCalculationPending(true);

    const { errorMessage, data } = await calculateLandPriceAction(reqData);
    if (errorMessage) {
      notify({ title: "Error", description: errorMessage }, { variant: "error" });
      setCalculationPending(false);
    } else {
      setStep(VoltSteps.CALCULATION);
      setValues({ ...values, calculation: data });
    }
  };

  return (
    <div
      style={{ gridTemplateAreas: primaryLayout }}
      className={cn(
        "hidden lg:grid h-full w-full grid-rows-[1fr_minmax(0,_max-content)] grid-cols-[350px_1fr] lg:grid-cols-[406px_1fr] xl:grid-cols-[490px_1fr]"
      )}
    >
      <div className="h-full grid grid-rows-[minmax(0,_max-content)_1fr] overflow-hidden" style={{ gridArea: "details" }}>
        <div className="px-14 xl:px-16 pt-14 xl:pt-16 pb-14">
          <Link href="/">
            <Logo className="w-[141px] h-10" />
          </Link>
        </div>
        <div className="overflow-hidden grid">
          <ScrollArea className="" id="volt-scroll">
            <div className="overflow-hidden flex flex-col gap-8 px-5 lg:px-8 xl:px-11">
              <VoltSearch values={values} setValues={setValues} user={user} onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)} />
              {step === VoltSteps.SEARCH_RESULTS && (
                <VoltSearchResult
                  onSearchResultItemHover={(parcelNumberNoFormatting) => setHighlightedParcelNumber(parcelNumberNoFormatting)}
                  onSearchResultItemMouseLeave={() => {
                    // setHighlightedParcelNumber(null)
                  }}
                  highlightedParcelNumber={highlightedParcelNumber}
                  values={values}
                  setValues={setValues}
                />
              )}
              {step === VoltSteps.CALCULATION && (
                <VoltCalculation
                  onSearchResultItemHover={(parcelNumberNoFormatting) => setHighlightedParcelNumber(parcelNumberNoFormatting)}
                  onSearchResultItemMouseLeave={() => {
                    // setHighlightedParcelNumber(null)
                  }}
                  highlightedParcelNumber={highlightedParcelNumber}
                  values={values}
                  setValues={setValues}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="bg-primary-main-100" style={{ gridArea: "map" }}>
        <VoltDesktopMap
          step={step}
          highlightedParcelNumber={highlightedParcelNumber}
          onMarkerMouseEnter={(parcelNumberNoFormatting) => {
            setHighlightedParcelNumber(parcelNumberNoFormatting);
            if (!isElementVisible(parcelNumberNoFormatting, step)) {
              const item = document.getElementById(
                `${step === VoltSteps.SEARCH_RESULTS ? "search-result-" : "calculation-"}${parcelNumberNoFormatting}`
              );
              if (item) {
                item.scrollIntoView();
              }
            }
          }}
          values={values}
          setValues={setValues}
          onMarkerMouseLeave={() => {
            // setHighlightedParcelNumber(null);
          }}
        />
      </div>
      <div className={cn("px-5 lg:px-8 xl:px-11 h-fit mt-6", step > 0 && "border-t border-t-grey-100")} style={{ gridArea: "footer" }}>
        <div className={cn("space-y-4 pt-4 md:pt-6 md:pb-8 mt-auto")}>
          {step === VoltSteps.SEARCH_RESULTS && (
            <div className="flex gap-3">
              <Button className="w-full bg-grey-100 hover:bg-grey-200 text-black">Save Data</Button>
              <Button loading={calculationPending} onClick={calculatePrice} disabled={!values.selectedItem} className="w-full">
                Calculate Price
              </Button>
            </div>
          )}
          <div className="flex gap-3 items-center justify-center lg:justify-start">
            <Link href="/">
              <p className="text-sm text-gray-800">Privacy Policy</p>
            </Link>
            <div className="w-[1px] h-4 bg-gray-200" />
            <Link href="/">
              <p className="text-sm text-gray-800">Terms of use</p>
            </Link>
          </div>
          <p className="text-xs font-medium text-grey-600 text-center lg:text-start">
            ©{new Date().getFullYear()} Parcel Market. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
export default VoltDesktop;
