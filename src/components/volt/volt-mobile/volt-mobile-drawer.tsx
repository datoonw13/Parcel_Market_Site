"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/dialogs/drawer";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { IDecodedAccessToken } from "@/types/auth";
import { VoltSteps } from "@/types/volt";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";

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

interface VoltMobileDrawerProps {
  step: VoltSteps;
  user: IDecodedAccessToken | null;
  children: ReactNode;
}

const VoltMobileDrawer: FC<VoltMobileDrawerProps> = ({ step, user, children }) => {
  const { targetReached: isSmallDevice, detecting } = useMediaQuery(640);
  const [snapPoints, setSnapPoints] = useState(snapPointsEnum.primary.sm);
  const [snap, setSnap] = useState<number | string | null>(snapPointsEnum.primary.sm[0]);
  const [drawerRef, setDrawerRef] = useState<HTMLDivElement | null>(null);

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
    <div>
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
          id="drawer"
          ref={setDrawerRef}
          overlayClassName="mt-auto"
          className={cn(`fixed h-full flex flex-col bottom-0 left-0 right-0 `, snap === 1 && "rounded-none")}
        >
          <DrawerTitle className="hidden" />
          <div
            id="drawer-content"
            className={cn("overflow-auto p-4", snap !== 1 && "overflow-hidden pointer-events-none")}
            {...(snap === 1 && { "data-vaul-no-drag": "" })}
          >
            {children}
          </div>
        </DrawerContent>
      </Drawer>
      {(step === VoltSteps.SEARCH_RESULTS || (step === VoltSteps.CALCULATION && !user)) && (
        <div id="button-wrapper" className="fixed bottom-0 p-4 pb-8 w-full bg-white z-[60] border-x">
          <Button className="w-full">Some Button</Button>
        </div>
      )}
    </div>
  );
};

export default VoltMobileDrawer;
