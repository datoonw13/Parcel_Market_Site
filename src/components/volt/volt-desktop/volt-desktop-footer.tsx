import { VoltPriceCalculationRes, VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import React, { Dispatch, FC, SetStateAction } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import { removeParcelNumberFormatting } from "@/helpers/common";
import { isElementVisible } from "@/lib/utils";
import VoltPriceCalculationAxis from "../volt-calculation-axis";
import VoltDesktopAdditionalButtons from "./volt-desktop-additional-buttons";
import VoltFooter from "../volt-footer";

interface VoltDesktopFooterProps {
  step: VoltSteps;
  voltValue: number;
  user: IDecodedAccessToken | null;
  openPropertyDetailViewWarnig: () => void;
  highlightedParcelNumber: string | null;
  setHighlightedParcelNumber: Dispatch<SetStateAction<string | null>>;
  values: VoltWrapperValuesModel;
  onCalculationSucceed: (data: VoltPriceCalculationRes | null) => void;
}
const VoltDesktopFooter: FC<VoltDesktopFooterProps> = ({
  step,
  voltValue,
  user,
  openPropertyDetailViewWarnig,
  highlightedParcelNumber,
  setHighlightedParcelNumber,
  values,
  onCalculationSucceed,
}) => (
  <div
    className="px-5 lg:px-8 xl:px-0 xl:pl-0 py-4 border-t border-t-grey-100 space-y-6 flex flex-col xl:flex-row-reverse"
    style={{ gridArea: "footer" }}
  >
    {step === VoltSteps.CALCULATION && (
      <div style={{ gridArea: "axis" }} className="w-full xl:px-11">
        <VoltPriceCalculationAxis
          voltValue={voltValue}
          user={user}
          setOpenPropertyDetailWarningModal={openPropertyDetailViewWarnig}
          data={
            values.calculation?.properties.map((el) => ({
              parcelNumber: el.parselId || "",
              acreage: Number(Number(el.arcage).toFixed(2)),
              price: el.price,
              pricePerAcre: Number(el.price / Number(el.arcage)),
              isMainLand: removeParcelNumberFormatting(el.parselId) === values.selectedItem?.properties.fields.parcelnumb_no_formatting,
            })) || []
          }
          highlightedParcelNumber={highlightedParcelNumber}
          onPinHover={(parcelNumberNoFormatting) => {
            setHighlightedParcelNumber(parcelNumberNoFormatting);

            if (
              !isElementVisible(
                parcelNumberNoFormatting,
                ` ${step === VoltSteps.CALCULATION ? "search-result-" : "calculation-"}${parcelNumberNoFormatting}`
              )
            ) {
              const item = document.getElementById(`calculation-${parcelNumberNoFormatting}`);
              if (item) {
                item.scrollIntoView();
              }
            }
          }}
        />
      </div>
    )}
    <div className="xl:w-[490px] xl:min-w-[490px] flex flex-col xl:px-11 !m-0">
      <div className="hidden xl:flex">
        <VoltDesktopAdditionalButtons user={user} step={step} values={values} onSucceed={onCalculationSucceed} />
      </div>
      <VoltFooter className="w-full xl:flex-col xl:justify-end items-start h-full mt-6 xl:mt-0" />
    </div>
  </div>
);

export default VoltDesktopFooter;
