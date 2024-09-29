"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { VoltSteps, VoltWrapperValuesModel } from "@/types/volt";
import { Drawer, DrawerContent, DrawerFooter, DrawerTitle } from "@/components/ui/dialogs/drawer";
import { Button } from "@/components/ui/button";
import { calculateLandPriceAction } from "@/server-actions/volt/actions";
import useNotification from "@/hooks/useNotification";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/hooks/useMediaQuery";
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
  const [snapPoints, setSnapPoints] = useState(snapPointsEnum.primary.sm);
  const [snap, setSnap] = useState<number | string | null>(snapPointsEnum.primary.sm[0]);
  const [drawerRef, setDrawerRef] = useState<HTMLDivElement | null>(null);
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(640);

  const onResize = useCallback(() => {
    const navbarEl = document.getElementById("volt-navbar");
    if (drawerRef && navbarEl) {
      const { height } = navbarEl.getBoundingClientRect();
      drawerRef.style.maxHeight = `calc(100vh - ${height - 1}px)`;

      if (step === VoltSteps.SEARCH_RESULTS || (step === VoltSteps.CALCULATION && !user)) {
        drawerRef.style.paddingBottom = `${height + 16}px`;
        setSnapPoints(isSmallDevice ? snapPointsEnum.secondary.sm : snapPointsEnum.secondary.lg);
        setSnap(isSmallDevice ? snapPointsEnum.secondary.sm[0] : snapPointsEnum.secondary.lg[0]);
      } else {
        drawerRef.style.paddingBottom = "16px";
        setSnapPoints(isSmallDevice ? snapPointsEnum.primary.sm : snapPointsEnum.primary.lg);
        setSnap(isSmallDevice ? snapPointsEnum.primary.sm[0] : snapPointsEnum.primary.lg[0]);
      }
    }
  }, [drawerRef, isSmallDevice, step, user]);

  const resetDrawerScroll = useCallback(() => {
    if (drawerRef) {
      const drawerContentEl = drawerRef.querySelector("#drawer-content");
      if (drawerContentEl) {
        drawerContentEl.scrollTo(0, 0);
      }
    }
  }, [drawerRef]);

  useEffect(() => {
    if (snap !== 1 && drawerRef) {
      resetDrawerScroll();
    }
  }, [snap, drawerRef, resetDrawerScroll]);

  useEffect(() => {
    if (drawerRef) {
      onResize();
      window.addEventListener("resize", onResize);
    } else {
      window.removeEventListener("resize", onResize);
    }
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [drawerRef, onResize, step]);

  return (
    <>
      <div className="flex flex-col h-screen lg:hidden w-full">
        <VoltMobileHeader step={step} user={user} />
        {step === VoltSteps.SEARCH && (
          <VoltSearch
            setStep={setStep}
            values={values}
            setValues={setValues}
            user={user}
            onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)}
          />
        )}
        {step > VoltSteps.SEARCH && (
          <VoltMobileDrawer step={step} user={user}>
            qwd
          </VoltMobileDrawer>
        )}
      </div>
    </>
  );
};
export default VoltMobile;
