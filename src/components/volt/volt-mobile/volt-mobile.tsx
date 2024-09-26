"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { VoltPriceCalculationReq, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { DrawerFooter } from "@/components/ui/dialogs/drawer";
import { Button } from "@/components/ui/button";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import useNotification from "@/hooks/useNotification";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import VoltFooter from "../volt-footer";
import { ScrollArea } from "../../ui/scroll-area";
import VoltMobileHeader from "./volt-mobile-header";
import VoltMobileDrawer from "./volt-mobile-drawer";
import VoltSearch from "../volt-search";
import CalculationTerms from "../calculation-terms/calculation-terms";
import VoltMap from "../volt-map";

interface VoltMobileProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
}
const VoltMobile: FC<VoltMobileProps> = ({ user, setOpenPropertyDetailWarningModal, setStep, setValues, step, values }) => {
  const router = useRouter();
  const { notify } = useNotification();
  const [calculationPending, setCalculationPending] = useState(false);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);
  const [agreCalculationTerm, setAgreeCalculationTerm] = useState(!!user);

  const isButtonVisible = step === VoltSteps.SEARCH_RESULTS || (step === VoltSteps.CALCULATION && !user);

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
      // setHighlightedParcelNumber(null);
    }
    setCalculationPending(false);
  };

  return (
    <>
      <div className="flex flex-col h-screen lg:hidden w-full">
        <VoltMobileHeader step={step} user={user} />
        {showCalculationTerms && (
          <div className="p-5 pb-36">
            <CalculationTerms onValueChange={(val) => setAgreeCalculationTerm(val)} />
            <div className="flex flex-col gap-3 fixed bottom-0 bg-white w-full left-0 px-5 py-4">
              <Button variant="secondary">Cancel</Button>
              <Button
                disabled={!agreCalculationTerm}
                onClick={() => {
                  setShowCalculationTerms(false);
                  calculatePrice();
                }}
              >
                Agree
              </Button>
            </div>
          </div>
        )}
        {step > VoltSteps.SEARCH && (
          <div className="bg-primary-main-100 w-full h-[calc(100vh-220px)]" style={{ gridArea: "map" }}>
            <VoltMap
              step={step}
              user={user}
              setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
              highlightedParcelNumber={null}
              onMarkerMouseEnter={(parcelNumberNoFormatting) => {
                // setHighlightedParcelNumber(parcelNumberNoFormatting);
                // if (!isElementVisible(parcelNumberNoFormatting, step)) {
                //   const item = document.getElementById(
                //     `${step === VoltSteps.SEARCH_RESULTS ? "search-result-" : "calculation-"}${parcelNumberNoFormatting}`
                //   );
                //   if (item) {
                //     item.scrollIntoView();
                //   }
                // }
              }}
              values={values}
              setValues={setValues}
              onMarkerMouseLeave={() => {
                // setHighlightedParcelNumber(null);
              }}
            />
          </div>
        )}
        <div className={cn("overflow-hidden flex w-full", showCalculationTerms && "hidden")}>
          <ScrollArea className="w-full px-5 py-6 max-w-xl mx-auto">
            {step === VoltSteps.SEARCH && (
              <VoltSearch values={values} setValues={setValues} user={user} onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)} />
            )}
            {step > VoltSteps.SEARCH && !showCalculationTerms && (
              <>
                <VoltMobileDrawer
                  isButtonVisible={isButtonVisible}
                  setValues={setValues}
                  values={values}
                  step={step}
                  user={user}
                  setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
                />
                {isButtonVisible && (
                  <div className="p-4 w-full bg-white border border-grey-100 border-b-0 mt-0 fixed bottom-0 left-0" style={{ zIndex: 100 }}>
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
                    {step === VoltSteps.CALCULATION && !user && (
                      <Button
                        className="w-full"
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
              </>
            )}
          </ScrollArea>
        </div>
        <div className={cn("mt-auto py-4 border-t border-t-grey-100 px-5", showCalculationTerms && "hidden")}>
          <VoltFooter className="flex-col gap-2" />
        </div>
      </div>
    </>
  );
};
export default VoltMobile;
