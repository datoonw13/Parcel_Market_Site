"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerTitle } from "@/components/ui/dialogs/drawer";
import { cn } from "@/lib/utils";
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { IDecodedAccessToken } from "@/types/auth";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { removeParcelNumberFormatting } from "@/helpers/common";
import VoltSearchResult from "../volt-search-result";
import { breakPoints } from "../../../../tailwind.config";
import VoltCalculation from "../volt-calculation";
import VoltPriceCalculationAxis from "../volt-calculation-axis";

interface VoltMobileDrawerProps {
  step: VoltSteps;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  user: IDecodedAccessToken | null;
  isButtonVisible?: boolean;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
}

const VoltMobileDrawer: FC<VoltMobileDrawerProps> = ({
  setValues,
  step,
  user,
  values,
  isButtonVisible,
  setOpenPropertyDetailWarningModal,
}) => {
  const { targetReached: isXs, detecting } = useMediaQuery(parseFloat(breakPoints.sm));
  const [drawerMaxHeight, setDrawerMaxHeight] = useState(0);
  const [snapPoints, setSnapPoints] = useState(["230px", 1]);
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  const handleDrawerMaxHeightChange = () => {
    const voltMobleHeader = document.getElementById("volt-navbar");
    if (voltMobleHeader) {
      const { height } = voltMobleHeader.getBoundingClientRect();
      setDrawerMaxHeight(window.innerHeight - height);
    }
  };

  useEffect(() => {
    handleDrawerMaxHeightChange();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleDrawerMaxHeightChange);
    return () => {
      window.removeEventListener("resize", handleDrawerMaxHeightChange);
    };
  }, []);

  useEffect(() => {
    if (!detecting) {
      if (isXs) {
        setSnapPoints(["220px", 1]);
        setSnap("220px");
      } else {
        setSnapPoints(["230px", 1]);
        setSnap("230px");
      }
    }
  }, [isXs, detecting]);

  return (
    <>
      <Drawer
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        closeThreshold={0.0000001}
        setActiveSnapPoint={setSnap}
        snapToSequentialPoint
        open
        onDrag={(e, x) => {
          if (x >= 1) {
            e.currentTarget.style.transform = "";
          }
        }}
        dismissible
        modal={false}
      >
        <DrawerContent
          overlayClassName="mt-auto"
          className={cn(`fixed flex flex-col bottom-0 left-0 right-0 h-full`, snap === 1 && "rounded-none")}
          style={{ maxHeight: drawerMaxHeight }}
          overlayStyle={{ maxHeight: drawerMaxHeight }}
        >
          <DrawerTitle className="hidden" data-vaul-no-drag />
          <div
            className={cn("px-4 py-2 flex w-full flex overflow-hidden", isButtonVisible && "pb-24")}
            {...(snap === 1 && { "data-vaul-no-drag": "" })}
          >
            <ScrollArea className={cn("flex w-full", snap !== 1 && "pointer-events-none")}>
              <div className="flex flex-col gap-6 overflow-hidden">
                {step === VoltSteps.SEARCH_RESULTS && (
                  <VoltSearchResult
                    onSearchResultItemHover={(parcelNumberNoFormatting) => {}}
                    onSearchResultItemMouseLeave={() => {}}
                    highlightedParcelNumber=""
                    values={values}
                    setValues={setValues}
                  />
                )}
                {step === VoltSteps.CALCULATION && (
                  <>
                    <VoltPriceCalculationAxis
                      voltValue={values.calculation?.price || 0}
                      user={user}
                      setOpenPropertyDetailWarningModal={setOpenPropertyDetailWarningModal}
                      data={
                        values.calculation?.properties.map((el) => ({
                          parcelNumber: el.parselId || "",
                          acreage: Number(Number(el.arcage).toFixed(2)),
                          price: el.price,
                          pricePerAcre: Number(el.price / Number(el.arcage)),
                          isMainLand:
                            removeParcelNumberFormatting(el.parselId) === values.selectedItem?.properties.fields.parcelnumb_no_formatting,
                        })) || []
                      }
                      highlightedParcelNumber={null}
                      onPinHover={(parcelNumberNoFormatting) => {
                        // setHighlightedParcelNumber(parcelNumberNoFormatting);
                        // if (!isElementVisible(parcelNumberNoFormatting, step)) {
                        //   const item = document.getElementById(`calculation-${parcelNumberNoFormatting}`);
                        //   if (item) {
                        //     item.scrollIntoView();
                        //   }
                        // }
                      }}
                    />
                    <VoltCalculation
                      onSearchResultItemHover={(parcelNumberNoFormatting) => {}}
                      onSearchResultItemMouseLeave={() => {
                        // setHighlightedParcelNumber(null)
                      }}
                      highlightedParcelNumber={null}
                      values={values}
                      setValues={setValues}
                      user={user}
                    />
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VoltMobileDrawer;
