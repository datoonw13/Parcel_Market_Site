"use client";

import { IUserBaseInfo } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { IVoltPriceCalculation, IVoltPriceCalculationReqParams, VoltSearchModel, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { Button } from "@/components/ui/button";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import useNotification from "@/hooks/useNotification";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";
import TermsConditions from "@/components/shared/terms-conditions";
import VoltFooter from "../volt-footer";
import VoltMobileHeader from "./volt-mobile-header";
import VoltMobileDrawer from "./volt-mobile-drawer";
import VoltSearch from "../volt-search/volt-search";
import VoltMap from "../volt-map";
import VoltSearchResult from "../volt-search-result";
import VoltPriceCalculationAxis from "../volt-calculation-axis";
import VoltCalculation from "../volt-calculation";
import VoltSearchMap from "../search-map";

interface VoltMobileProps {
  user: IUserBaseInfo | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
  setDataSaved: Dispatch<SetStateAction<boolean>>;
}

const getAxisData = (data?: IVoltPriceCalculation["propertiesUsedForCalculation"], sellingLandParcelNumberNoFormatting?: string) => {
  const result: Array<{
    parcelNumberNoFormatting: string;
    acreage: number;
    price: number;
    pricePerAcre: number;
    isMainLand: boolean;
  }> = [];

  if (!data || !sellingLandParcelNumberNoFormatting) {
    return [];
  }

  data.forEach((property) => {
    if (property.isBulked) {
      result.push({
        acreage: property.data.acreage,
        isMainLand: property.data.parcelNumberNoFormatting.includes(sellingLandParcelNumberNoFormatting),
        parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
        price: property.data.price,
        pricePerAcre: property.data.pricePerAcreage,
      });
    } else {
      result.push({
        acreage: property.data.acreage,
        isMainLand: property.data.parcelNumberNoFormatting === sellingLandParcelNumberNoFormatting,
        parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
        price: property.data.lastSalePrice,
        pricePerAcre: property.data.pricePerAcreage,
      });
    }
  });

  return result;
};

const VoltMobile: FC<VoltMobileProps> = ({ user, setOpenPropertyDetailWarningModal, setStep, setValues, step, values, setDataSaved }) => {
  const router = useRouter();
  const { notify } = useNotification();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const [calculationPending, setCalculationPending] = useState(false);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);
  const [agreeTerm, setAgreeTerm] = useState(false);
  const [selectedSearchType, setSearchType] = useState<VoltSearchModel["searchType"]>("fullName");
  const [showSearchMap, setSearchMap] = useState(false);

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
      setDataSaved(false);
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

  useEffect(() => {
    if (step !== VoltSteps.SEARCH) {
      setSearchMap(false);
    }
  }, [step]);

  return (
    <>
      {showSearchMap && (
        <div className="z-10 fixed top-0 left-0 bg-white w-screen h-screen">
          <VoltMobileHeader goBack={() => setSearchMap(false)} step={2} user={user} />
          <VoltSearchMap setStep={setStep} data={values.searchDetails} values={values} setValues={setValues} />
        </div>
      )}
      <div className="flex flex-col h-full lg:hidden w-full relative">
        <VoltMobileHeader
          step={step}
          user={user}
          goBack={() => {
            setStep(VoltSteps.SEARCH);
          }}
        />
        {showCalculationTerms && (
          <div className="p-5 overflow-auto space-y-8">
            <TermsConditions
              showAgree
              closeModal={() => setShowCalculationTerms(false)}
              onOk={() => {
                setShowCalculationTerms(false);
                setAgreeTerm(false);
                calculatePrice();
              }}
              modal={false}
            />
          </div>
        )}
        {!showCalculationTerms && (
          <div className={cn("flex flex-col overflow-auto h-full")}>
            {step === VoltSteps.SEARCH && (
              <>
                <VoltSearch
                  className="p-5"
                  setStep={setStep}
                  values={values}
                  setValues={setValues}
                  user={user}
                  onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)}
                  selectedSearchType={selectedSearchType}
                  setSearchType={setSearchType}
                  setMobileSearchMap={() => setSearchMap(true)}
                />
                <VoltFooter className="flex-col py-6" />
              </>
            )}
            {step > VoltSteps.SEARCH && (
              <>
                <div className="w-full h-full">
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
                              id="volt-mobile-get-value-button"
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
                              Get Data
                            </Button>
                          )}
                          {step === VoltSteps.CALCULATION && !user && (
                            <Button
                              id="volt-mobile-view-sales-data-button"
                              className="w-full"
                              onClick={() => {
                                router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
                                sessionStorage.setItem("volt", JSON.stringify({ step, values }));
                              }}
                            >
                              View Sales Data
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
                        data={getAxisData(values.calculation?.propertiesUsedForCalculation, values.selectedItem?.parcelNumberNoFormatting)}
                      />
                      <VoltCalculation values={values} user={user} mapInteraction={mapInteraction} setMpaInteraction={setMpaInteraction} />
                    </div>
                  )}
                  <VoltFooter className="flex-col py-6 mt-auto" />
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
