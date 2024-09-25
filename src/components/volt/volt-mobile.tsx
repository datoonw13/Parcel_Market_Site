"use client";

import Logo from "@/icons/Logo";
import Link from "next/link";
import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { cn } from "@/lib/utils";
import VoltFooter from "./volt-footer";
import ResponsiveHeaderMenu from "../app-bar/ResponsiveHeaderMenu";
import { ScrollArea } from "../ui/scroll-area";
import VoltSearch from "./volt-search";
import { Drawer, DrawerContent, DrawerOverlay, DrawerTitle } from "../ui/dialogs/drawer";
import VoltSearchResult from "./volt-search-result";

interface VoltMobileProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
  setValues: Dispatch<SetStateAction<VoltWrapperValuesModel>>;
  values: VoltWrapperValuesModel;
  setOpenPropertyDetailWarningModal: Dispatch<SetStateAction<boolean>>;
}
const VoltMobile: FC<VoltMobileProps> = ({ user, setOpenPropertyDetailWarningModal, setStep, setValues, step, values }) => {
  const [snap, setSnap] = useState<number | string | null>("140px");
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen lg:hidden w-full">
      <div className="w-full" id="volt-navbar">
        <div className="px-5 py-6 border-b border-b-grey-100 flex justify-between items-center">
          {step !== VoltSteps.SEARCH && <MdOutlineKeyboardArrowLeft className="size-6" />}
          <Link href="/">
            <Logo className="w-[84px] h-6 sm:w-24 sm:h-8" />
          </Link>
          <ResponsiveHeaderMenu user={user} rootId="volt-navbar" />
        </div>
      </div>
      <div className="overflow-hidden flex w-full">
        <ScrollArea className="w-full px-5 py-6 max-w-xl mx-auto">
          {step === VoltSteps.SEARCH && (
            <VoltSearch values={values} setValues={setValues} user={user} onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)} />
          )}
          {step > VoltSteps.SEARCH && (
            <Drawer
              snapPoints={["140px", 1]}
              activeSnapPoint={snap}
              closeThreshold={0.0000001}
              setActiveSnapPoint={setSnap}
              open
              onDrag={(e, x) => {
                if (x >= 1) {
                  e.currentTarget.style.transform = "";
                }
              }}
            >
              <DrawerContent className={cn(`fixed flex flex-col bottom-0 left-0 right-0 h-full`, snap === 1 && "rounded-none")}>
                <DrawerTitle className="" data-vaul-no-drag>
                  qwd
                </DrawerTitle>
                {step === VoltSteps.SEARCH_RESULTS && (
                  <VoltSearchResult
                    onSearchResultItemHover={(parcelNumberNoFormatting) => {}}
                    onSearchResultItemMouseLeave={() => {
                      // setHighlightedParcelNumber(null)
                    }}
                    highlightedParcelNumber=""
                    values={values}
                    setValues={setValues}
                  />
                )}
              </DrawerContent>
            </Drawer>
          )}
        </ScrollArea>
      </div>
      <div className="mt-auto py-4 border-t border-t-grey-100 px-5">
        <VoltFooter className="flex-col gap-2" />
      </div>
    </div>
  );
};
export default VoltMobile;
