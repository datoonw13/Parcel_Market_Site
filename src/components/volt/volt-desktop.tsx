"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { IVoltPriceCalculationReqParams, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
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
import { breakPoints } from "../../../tailwind.config";
import VoltFooter from "./volt-footer";
import VoltSearch from "./volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltCalculation from "./volt-calculation";
import CalculationTermsDialog from "./calculation-terms/calculation-terms-dialog";
import VoltPriceCalculationAxis from "./volt-calculation-axis";
import VoltMap from "./volt-map";

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
}

const VoltDesktop: FC<VoltDesktopProps> = ({ user, setStep, step, setValues, values, setOpenPropertyDetailWarningModal }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.xl));
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const router = useRouter();
  const { notify } = useNotification();
  const [calculationPending, setCalculationPending] = useState(false);
  const [showCalculationTerms, setShowCalculationTerms] = useState(false);

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
      <CalculationTermsDialog
        onAccept={() => {
          setShowCalculationTerms(false);
          calculatePrice();
        }}
        open={showCalculationTerms}
        closeModal={() => setShowCalculationTerms(false)}
      />
      <table className="w-full h-screen">
        <thead>
          <tr>
            <th className="max-w-[420px] w-[420px] xl:max-w-[490px] xl:w-[490px] m-0 p-0 border-0 h-0" />
            <th className="m-0 p-0 border-0 h-0" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={isSmallDevice ? 1 : 2} className="">
              <div className="h-full flex flex-col overflow-auto relative">
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
                          renderContent="Save data"
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
                        onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)}
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
                        />
                      )}
                    </div>
                    <VoltFooter className="flex-col items-start mt-auto" />
                  </div>
                </ScrollArea>
                {step === VoltSteps.SEARCH_RESULTS && (
                  <div className="bg-white px-8 xl:px-11 pt-6 pb-8 xl:pb-11 border-t border-t-grey-100">
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
                  </div>
                )}
                {step === VoltSteps.CALCULATION && !user && !isSmallDevice && (
                  <div className="bg-white px-8 xl:px-11 py-6 ">
                    <Button
                      className="w-full"
                      onClick={() => {
                        router.push(`${routes.auth.signIn.fullUrl}?redirect_uri=${routes.volt.fullUrl}`);
                        sessionStorage.setItem("volt", JSON.stringify({ step, values }));
                      }}
                    >
                      Save Data
                    </Button>
                  </div>
                )}
              </div>
            </td>
            <td rowSpan={1} className="bg-primary-main-100">
              <VoltMap
                step={step}
                user={user}
                setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
                values={values}
                setValues={setValues}
                mapInteraction={mapInteraction}
                setMpaInteraction={setMpaInteraction}
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
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
export default VoltDesktop;
