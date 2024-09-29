"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { IVoltPriceCalculationReqParams, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { Drawer, DrawerContent, DrawerFooter, DrawerTitle } from "@/components/ui/dialogs/drawer";
import { Button } from "@/components/ui/button";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import useNotification from "@/hooks/useNotification";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
import { MapInteractionModel } from "@/types/common";
import VoltFooter from "../volt-footer";
import { ScrollArea } from "../../ui/scroll-area";
import VoltMobileHeader from "./volt-mobile-header";
import VoltMobileDrawer from "./volt-mobile-drawer";
import VoltSearch from "../volt-search/volt-search";
import CalculationTerms from "../calculation-terms/calculation-terms";
import VoltMap from "../volt-map";
import VoltSearchResult from "../volt-search-result";
import VoltPriceCalculationAxis from "../volt-calculation-axis";
import VoltCalculation from "../volt-calculation";

interface VoltMobileProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
}

const drawerPx = 13;

const snapPointsEnum = {
  primary: {
    sm: ["135px", 1],
    lg: ["140px", 1],
  },
  secondary: {
    sm: ["240px", 1],
    lg: ["245px", 1],
  },
};

const VoltMobile: FC<VoltMobileProps> = ({ user, setOpenPropertyDetailWarningModal, setStep, setValues, step, values }) => {
  const router = useRouter();
  const { notify } = useNotification();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const [calculationPending, setCalculationPending] = useState(false);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);
  const [agreeTerm, setAgreeTerm] = useState(false);

  const calculatePrice = async () => {
    if (!values.selectedItem) {
      return;
    }
    const reqData: IVoltPriceCalculationReqParams = {
      body: {
        county: values.selectedItem?.county.value,
        state: values.selectedItem?.state.value,
        parcelNumber: values.selectedItem?.parcelNumberNoFormatting,
        owner: values.selectedItem.owner,
        propertyType: values.selectedItem.propertyType || "",
        coordinates: JSON.stringify(values.selectedItem.polygon),
        locality: values.selectedItem.city,
      },
      queryParams: {
        acre: values.selectedItem.acreage.toString(),
        lat: values.selectedItem.lat.toString(),
        lon: values.selectedItem.lon.toString(),
      },
    };
    setCalculationPending(true);

    const { errorMessage, data } = await calculateLandPriceAction(reqData);
    if (errorMessage) {
      notify({ title: "Error", description: errorMessage }, { variant: "error" });
    } else {
      setStep(VoltSteps.CALCULATION);
      setValues({ ...values, calculation: data });
      setMpaInteraction({
        hoveredParcelNumber: null,
        openPopperParcelNumber: null,
        zoom: false,
      });
    }
    setCalculationPending(false);
  };

  return (
    <>
      <div className="flex flex-col h-screen lg:hidden w-full relative">
        <VoltMobileHeader step={step} user={user} />
        {showCalculationTerms && (
          <div className="p-5 overflow-auto space-y-8">
            <CalculationTerms className="h-max" onValueChange={(val) => setAgreeTerm(val)} />
            <div className="flex flex-col-reverse w-full gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  setShowCalculationTerms(false);
                  setAgreeTerm(false);
                }}
                className="w-full"
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                disabled={!agreeTerm}
                onClick={() => {
                  setShowCalculationTerms(false);
                  setAgreeTerm(false);
                  calculatePrice();
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        )}
        {!showCalculationTerms && (
          <div className={cn("flex flex-col overflow-auto ")}>
            {step === VoltSteps.SEARCH && (
              <VoltSearch
                className="p-5"
                setStep={setStep}
                values={values}
                setValues={setValues}
                user={user}
                onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)}
              />
            )}
            {step > VoltSteps.SEARCH && (
              <>
                <div className="w-full h-screen">
                  <VoltMap
                    step={step}
                    user={user}
                    setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
                    values={values}
                    setValues={setValues}
                    mapInteraction={mapInteraction}
                    setMpaInteraction={setMpaInteraction}
                  />
                </div>
                <VoltMobileDrawer
                  step={step}
                  user={user}
                  renderButton={
                    <>
                      {(step === VoltSteps.SEARCH_RESULTS || (step === VoltSteps.CALCULATION && !user)) && (
                        <div id="button-wrapper" className="fixed bottom-0 p-4 pb-8 w-full bg-white z-[60] border-x">
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
                  }
                >
                  {step === VoltSteps.SEARCH_RESULTS && (
                    <VoltSearchResult
                      values={values}
                      setValues={setValues}
                      mapInteraction={mapInteraction}
                      setMpaInteraction={setMpaInteraction}
                    />
                  )}
                  {step === VoltSteps.CALCULATION && (
                    <div className="space-y-8">
                      <VoltPriceCalculationAxis
                        voltValue={values.calculation?.price || 0}
                        user={user}
                        mapInteraction={mapInteraction}
                        setMpaInteraction={setMpaInteraction}
                        setOpenPropertyDetailWarningModal={() => setOpenPropertyDetailWarningModal(true)}
                        data={
                          values.calculation?.propertiesUsedForCalculation.map((el) => ({
                            parcelNumberNoFormatting: el.parcelNumberNoFormatting,
                            acreage: el.acreage,
                            price: el.lastSalePrice,
                            pricePerAcre: el.pricePerAcreage,
                            isMainLand: el.parcelNumberNoFormatting === values.selectedItem?.parcelNumberNoFormatting,
                          })) || []
                        }
                      />
                      <VoltCalculation values={values} user={user} mapInteraction={mapInteraction} setMpaInteraction={setMpaInteraction} />
                    </div>
                  )}
                </VoltMobileDrawer>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default VoltMobile;
