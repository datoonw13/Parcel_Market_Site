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
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import VoltSearch from "./volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltDesktopMap from "./volt-desktop-map";
import { Button } from "../ui/button";
import VoltCalculation from "./volt-calculation";
import VoltPriceCalculationAxis from "./volt-calculation-axis";
import CalculationTermsDialog from "./calculation-terms/calculation-terms-dialog";

const primaryLayout = `"details map" "footer map"`;
const secondaryLayout = `"details map" "footer axis"`;

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
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

const VoltDesktop: FC<VoltDesktopProps> = ({ user, setStep, step, setValues, values }) => {
  const { notify } = useNotification();
  const router = useRouter();
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);
  const [calculationPending, setCalculationPending] = useState(false);
  const [highlightedParcelNumber, setHighlightedParcelNumber] = useState<string | null>(null);

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
    } else {
      setStep(VoltSteps.CALCULATION);
      setValues({ ...values, calculation: data });
      setHighlightedParcelNumber(null);
    }
    setCalculationPending(false);
  };

  return (
    <>
      <CalculationTermsDialog
        onAccept={() => {
          setShowCalculationTerms(false);
          calculatePrice();
        }}
        open={showCalculationTerms}
        closeModal={() => setShowCalculationTerms(false)}
      />
      <div
        style={{ gridTemplateAreas: step === VoltSteps.CALCULATION ? secondaryLayout : primaryLayout }}
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
        <div
          className={cn(
            "px-5 lg:px-8 xl:px-11 h-fit flex",
            step > 0 && "border-t border-t-grey-100",
            step === VoltSteps.CALCULATION && "h-full"
          )}
          style={{ gridArea: "footer" }}
        >
          <div className={cn("space-y-4 pt-4 md:pt-6 md:pb-8 w-full flex flex-col justify-between")}>
            {step > VoltSteps.SEARCH && (
              <div className="flex gap-3">
                {step === VoltSteps.SEARCH_RESULTS && (
                  <Button
                    loading={calculationPending}
                    onClick={() => {
                      if (user) {
                        calculatePrice();
                      } else {
                        setShowCalculationTerms(true);
                      }
                    }}
                    disabled={!values.selectedItem}
                    className="w-full"
                  >
                    Calculate Price
                  </Button>
                )}
                {step === VoltSteps.CALCULATION && (
                  <Button
                    className="w-full bg-grey-100 hover:bg-grey-200 text-black"
                    onClick={() => {
                      router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
                      sessionStorage.setItem("volt", JSON.stringify({ step, values }));
                    }}
                  >
                    Save Data
                  </Button>
                )}
              </div>
            )}
            <div>
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
        {step === VoltSteps.CALCULATION && (
          <div style={{ gridArea: "axis" }} className=" border-t border-t-grey-100 pt-4 md:pt-6 md:pb-8 px-6">
            <VoltPriceCalculationAxis
              data={
                values.calculation?.properties.map((el) => ({
                  parcelNumber: el.parselId || "",
                  acreage: Number(Number(el.arcage).toFixed(2)),
                  price: el.price,
                  pricePerAcre: Number(el.price / Number(el.arcage)),
                })) || []
              }
              highlightedParcelNumber={highlightedParcelNumber}
              onPinHover={(parcelNumberNoFormatting) => {
                setHighlightedParcelNumber(parcelNumberNoFormatting);
                if (!isElementVisible(parcelNumberNoFormatting, step)) {
                  const item = document.getElementById(`calculation-${parcelNumberNoFormatting}`);
                  if (item) {
                    item.scrollIntoView();
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
export default VoltDesktop;