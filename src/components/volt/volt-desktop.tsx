"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { IVoltPriceCalculation, IVoltPriceCalculationReqParams, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapInteractionModel } from "@/types/common";
import { useRouter } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import { IoBookmarkOutline } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import Link from "next/link";
import Logo from "@/icons/Logo";
import { getAdditionalSearchDetails } from "@/server-actions/user-searches/actions";
import { breakPoints } from "../../../tailwind.config";
import VoltFooter from "./volt-footer";
import VoltSearch from "./volt-search/volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltCalculation from "./volt-calculation";
import VoltPriceCalculationAxis from "./volt-calculation-axis";
import VoltMap from "./volt-map";
import { TermsConditionsDialog } from "../shared/terms-conditions";

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
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

const VoltDesktop: FC<VoltDesktopProps> = ({ user, setStep, step, setValues, values, setOpenPropertyDetailWarningModal, setDataSaved }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.xl));
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const router = useRouter();
  const { notify } = useNotification();
  const [calculationPending, setCalculationPending] = useState(false);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);
  const [showAdditionalData, setShowAdditionalData] = useState(false);

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
      const { data: additionalDataResult } = await getAdditionalSearchDetails(Number(data!.id));

      setStep(VoltSteps.CALCULATION);
      setValues((prev) => ({ ...prev, calculation: data, additionalDataResult }));
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
      <TermsConditionsDialog
        open={showCalculationTerms}
        closeModal={() => setShowCalculationTerms(false)}
        showAgree
        onOk={() => {
          calculatePrice();
          setShowCalculationTerms(false);
        }}
      />
      <table className="w-full h-full">
        <thead>
          <tr>
            <th className="max-w-[420px] w-[420px] xl:max-w-[490px] xl:w-[490px] m-0 p-0 border-0 h-0" />
            <th className="m-0 p-0 border-0 h-0" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={isSmallDevice ? 1 : 2} className="relative h-full">
              <div className="h-full flex flex-col overflow-auto absolute top-0">
                <div className="px-14 xl:px-16 pt-14 xl:pt-16 pb-14">
                  <Link href="/">
                    <Logo className="w-[141px] h-10" />
                  </Link>
                </div>
                <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
                  <div
                    className={cn(
                      "h-full flex flex-col px-8 xl:px-11 gap-12 relative",
                      (step === VoltSteps.CALCULATION && !user && !isSmallDevice) || (step === VoltSteps.CALCULATION && isSmallDevice)
                        ? ""
                        : "pb-6"
                    )}
                  >
                    {step === VoltSteps.CALCULATION && !user && isSmallDevice && (
                      <div className="absolute w-fit h-full right-3 z-10">
                        <Tooltip
                          renderButton={
                            <div
                              onClick={() => {
                                router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
                                sessionStorage.setItem("volt", JSON.stringify({ step, values }));
                              }}
                              className="border border-grey-200 rounded-md flex items-center justify-center size-9 bg-white cursor-pointer"
                            >
                              <IoBookmarkOutline />
                            </div>
                          }
                          renderContent="View Sales Data"
                          buttonClassName="sticky top-0"
                        />
                      </div>
                    )}
                    <div className="overflow-auto flex flex-col gap-8">
                      <VoltSearch
                        setStep={setStep}
                        values={values}
                        setValues={setValues}
                        user={user}
                        onSuccess={() => {
                          setStep(VoltSteps.SEARCH_RESULTS);
                          setDataSaved(false);
                        }}
                      />

                      {step === VoltSteps.SEARCH_RESULTS && (
                        <VoltSearchResult
                          values={values}
                          setValues={setValues}
                          mapInteraction={mapInteraction}
                          setMpaInteraction={setMpaInteraction}
                        />
                      )}
                      {step === VoltSteps.CALCULATION && (
                        <VoltCalculation
                          values={values}
                          user={user}
                          mapInteraction={mapInteraction}
                          setMpaInteraction={setMpaInteraction}
                          showAdditionalData={showAdditionalData}
                          setShowAdditionalData={setShowAdditionalData}
                        />
                      )}
                    </div>
                    <VoltFooter className="flex-col items-start mt-auto" />
                  </div>
                </ScrollArea>
                {step === VoltSteps.SEARCH_RESULTS && (
                  <div className="bg-white px-8 xl:px-11 pt-6 pb-8 xl:pb-11 border-t border-t-grey-100">
                    <Button
                      id="volt-get-value-button"
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
                      Get Value
                    </Button>
                  </div>
                )}
                {step === VoltSteps.CALCULATION && !user && !isSmallDevice && (
                  <div className="bg-white px-8 xl:px-11 py-6 ">
                    <Button
                      id="volt-view-sales-data-button"
                      className="w-full"
                      onClick={() => {
                        router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
                        sessionStorage.setItem("volt", JSON.stringify({ step, values }));
                      }}
                    >
                      View Sales Data
                    </Button>
                  </div>
                )}
              </div>
            </td>
            <td rowSpan={1} className="bg-primary-main-100 h-full">
              <VoltMap
                step={step}
                user={user}
                setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
                values={values}
                setValues={setValues}
                mapInteraction={mapInteraction}
                setMpaInteraction={setMpaInteraction}
                showAdditionalData={showAdditionalData}
              />
            </td>
          </tr>
          {step === VoltSteps.CALCULATION && (
            <tr>
              <td className="h-0 py-6 px-4" colSpan={isSmallDevice ? 2 : 1}>
                <VoltPriceCalculationAxis
                  voltValue={values.calculation?.price || 0}
                  user={user}
                  mapInteraction={mapInteraction}
                  setMpaInteraction={setMpaInteraction}
                  setOpenPropertyDetailWarningModal={() => setOpenPropertyDetailWarningModal(true)}
                  data={getAxisData(values.calculation?.propertiesUsedForCalculation, values.selectedItem?.parcelNumberNoFormatting)}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
export default VoltDesktop;
