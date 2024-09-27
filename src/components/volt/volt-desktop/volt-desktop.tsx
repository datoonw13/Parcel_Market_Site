"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { MapInteractionModel } from "@/types/common";
import useMediaQuery from "@/hooks/useMediaQuery";
import VoltSearch from "../volt-search";
import VoltSearchResult from "../volt-search-result";
import VoltMap from "../volt-map";
import VoltCalculation from "../volt-calculation";
import VoltDesktopHeader from "./volt-desktop-header";
import VoltDesktopAdditionalButtons from "./volt-desktop-additional-buttons";
import VoltDesktopFooter from "./volt-desktop-footer";
import { breakPoints } from "../../../../tailwind.config";
import VoltFooter from "../volt-footer";
import VoltPriceCalculationAxis from "../volt-calculation-axis";

const primaryLayout = `"details map" "footer map"`;
const secondaryLayout = `"details map" "footer footer"`;

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

  return (
    <>
      <div
        style={{ gridTemplateAreas: step === VoltSteps.CALCULATION ? secondaryLayout : primaryLayout }}
        className={cn(
          "hidden lg:grid h-full w-full grid-rows-[1fr_minmax(0,_max-content)] grid-cols-[350px_1fr] lg:grid-cols-[490px_1fr] xl:grid-cols-[490px_1fr]"
        )}
      >
        <div className="h-full grid grid-rows-[minmax(0,_max-content)_1fr] overflow-hidden" style={{ gridArea: "details" }}>
          <VoltDesktopHeader />
          <div className="overflow-hidden grid">
            <ScrollArea className="pb-6" id="volt-scroll">
              <div className="overflow-hidden flex flex-col gap-8 px-5 lg:px-8 xl:px-11">
                <VoltSearch values={values} setValues={setValues} user={user} onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)} />
                {step === VoltSteps.SEARCH_RESULTS && (
                  <VoltSearchResult
                    className="pb-6"
                    values={values}
                    setValues={setValues}
                    mapInteraction={mapInteraction}
                    setMpaInteraction={setMpaInteraction}
                  />
                )}
                {step === VoltSteps.CALCULATION && (
                  <VoltCalculation values={values} user={user} mapInteraction={mapInteraction} setMpaInteraction={setMpaInteraction} />
                )}
              </div>
            </ScrollArea>
            <div className="px-5 lg:px-8 xl:px-11 pb-4 xl:hidden">
              <VoltDesktopAdditionalButtons
                user={user}
                step={step}
                values={values}
                onSucceed={(data) => {
                  setStep(VoltSteps.CALCULATION);
                  setValues({ ...values, calculation: data });
                  setMpaInteraction({
                    hoveredParcelNumber: null,
                    openPopperParcelNumber: null,
                    zoom: false,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-primary-main-100" style={{ gridArea: "map" }}>
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
        {/* <VoltDesktopFooter
          openPropertyDetailViewWarnig={() => setOpenPropertyDetailWarningModal(true)}
          step={step}
          user={user}
          voltValue={values.calculation?.price || 0}
          onCalculationSucceed={(data) => {
            setStep(VoltSteps.CALCULATION);
            setValues({ ...values, calculation: data });
            setMpaInteraction({
              hoveredParcelNumber: null,
              openPopperParcelNumber: null,
              zoom: false,
            });
          }}
          values={values}
          mapInteraction={mapInteraction}
          setMpaInteraction={setMpaInteraction}
        /> */}
        <div
          className={cn(
            "px-5 lg:px-8 xl:px-0 xl:pl-0 py-4 border-t border-t-grey-100 space-y-6 flex flex-col xl:flex-row-reverse",
            step !== VoltSteps.CALCULATION && "justify-end"
          )}
          style={{ gridArea: "footer" }}
        >
          {step === VoltSteps.CALCULATION && (
            <div style={{ gridArea: "axis" }} className="w-full xl:px-11">
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
            </div>
          )}
          <div className="xl:w-[490px] xl:min-w-[490px] flex flex-col xl:px-11 !m-0 space-y-6">
            <div className="hidden xl:flex">
              <VoltDesktopAdditionalButtons
                user={user}
                step={step}
                values={values}
                onSucceed={(data) => {
                  setStep(VoltSteps.CALCULATION);
                  setValues({ ...values, calculation: data });
                  setMpaInteraction({
                    hoveredParcelNumber: null,
                    openPopperParcelNumber: null,
                    zoom: false,
                  });
                }}
              />
            </div>
            <VoltFooter className="w-full xl:flex-col items-start h-full mt-6 xl:mt-0 xl:justify-end hidden xl:flex" />
          </div>
        </div>
      </div>
    </>
  );
};
export default VoltDesktop;
