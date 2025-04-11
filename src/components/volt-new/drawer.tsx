"use client";

import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Drawer } from "vaul";
import { IPropertiesInteraction } from "@/types/volt";
import { IMainPropertyBaseInfo } from "@/types/property";
import { useRouter } from "next/navigation";
import { calculateLandPriceAction2 } from "@/server-actions/volt/actions";
import useNotification from "@/hooks/useNotification";
import { IUserBaseInfo } from "@/types/auth";
import VoltSearchResult from "./volt-search-result";
import { Button } from "../ui/button";

interface VoltDrawerProps {
  data: IMainPropertyBaseInfo[];
  container: HTMLDivElement | null;
  setDrawerInitialHeight: (val: number | null) => void;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
  propertiesInteraction: IPropertiesInteraction;
  contentClassName?: string;
  user: IUserBaseInfo | null;
  setAuthModal: (id: number) => void;
}

const VoltDrawer: FC<VoltDrawerProps> = ({
  container,
  setDrawerInitialHeight,
  data,
  propertiesInteraction,
  setPropertiesInteraction,
  contentClassName,
  user,
  setAuthModal,
}) => {
  const [snap, setSnap] = useState<number | string | null>(0);
  const [snapPoints, setSnapPoints] = useState<Array<string | number>>([0, 1]);
  const [drawerContentRef, setDrawerContentRef] = useState<HTMLDivElement | null>(null);
  const [firstSectionRef, setFirstSectionRef] = useState<HTMLDivElement | null>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [calculationPending, setCalculationPending] = useState(false);
  const [isGetDataPending, startGetDataTransition] = useTransition();
  const router = useRouter();
  const { notify } = useNotification();

  const setDrawerContentDimension = useCallback(() => {
    const headerEl = document.getElementById("header");

    if (!container || !drawerContentRef || !firstSectionRef || !overlayRef || !headerEl) return;

    const { width, height } = container.getBoundingClientRect();
    const { height: headerElHeight } = headerEl.getBoundingClientRect();

    drawerContentRef.style.width = `${width + 1}px`;
    drawerContentRef.style.height = `${height}px`;
    drawerContentRef.style.maxHeight = `calc(100% - ${headerElHeight}px)`;

    overlayRef.style.width = `${width + 1}px`;
    overlayRef.style.height = `${height}px`;

    const { height: firstSectionHeight } = firstSectionRef.getBoundingClientRect();
    const firstSectionHeightFormatted = firstSectionHeight + 89;
    const minSnapPoint = (firstSectionHeightFormatted + 25 + headerElHeight) / height;

    setSnapPoints([minSnapPoint, 1]);
    setSnap(minSnapPoint);
    setDrawerInitialHeight(firstSectionHeightFormatted);
    document.body.style.pointerEvents = "auto";
  }, [container, drawerContentRef, firstSectionRef, overlayRef, setDrawerInitialHeight]);

  const calculatePrice = async () => {
    const property = data.find((el) => el.id === propertiesInteraction.popup?.openId);
    if (!property) {
      return;
    }
    setCalculationPending(true);

    const res = await calculateLandPriceAction2({
      county: property.county.value,
      state: property.state.value,
      parcelNumber: property.parcelNumber,
      owner: property.owner,
      propertyType: property.propertyType,
      coordinates: JSON.stringify(property.polygon),
      locality: "",
      acrage: property.acreage.toString(),
      lat: property.lat.toString(),
      lon: property.lon.toString(),
    });

    if (res.data) {
      if (user) {
        startGetDataTransition(() => {
          router.push(`/volt/${res.data}`);
        });
      } else {
        setAuthModal(res.data);
      }
    }

    if (res?.errorMessage || !res?.data) {
      notify({ title: "Error", description: res?.errorMessage || "Unknown" }, { variant: "error" });
    }
    setCalculationPending(false);
  };

  useEffect(() => {
    setDrawerContentDimension();
    window.addEventListener("resize", () => setDrawerContentDimension());
    return () => {
      window.removeEventListener("resize", setDrawerContentDimension);
    };
  }, [setDrawerContentDimension]);

  return (
    <>
      <Drawer.Root
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        fadeFromIndex={1}
        open
        snapToSequentialPoint
        onRelease={(e) => {
          setDragging(false);
        }}
        onDrag={(e, x) => {
          setDragging(true);
          if (x >= 1) {
            e.currentTarget.style.transform = "";
          }
        }}
      >
        <Drawer.Overlay
          ref={setOverlayRef}
          className={cn("absolute inset-0 bg-black/40 !hidden", isDragging || snap === 1 ? "block" : "hidden")}
        />
        <Drawer.Portal>
          <Drawer.Content
            onInteractOutside={() => {
              setSnap(snapPoints[0]);
            }}
            ref={setDrawerContentRef}
            className={cn(
              "w-0 z-10 overflow-hidden fixed flex outline-none  flex-col border-b-none bottom-0 left-0 right-0 h-full mx-[-1px]",
              (!container || !drawerContentRef || !firstSectionRef) && "hidden",
              contentClassName
            )}
          >
            <div
              className={cn(
                "flex flex-col mx-auto w-full h-full !overflow-hidden shadow-5 bg-white rounded-t-2xl border",
                snap === 1 && "rounded-none"
              )}
            >
              <Drawer.Title className="w-44 h-2 rounded-xl mx-auto bg-white hidden" />
              <div className={cn(snap === 1 ? "overflow-auto" : "overflow-hidden", "grid")} id="drawer-content">
                <div className={cn("z-10 px-3 space-y-4", snap === 1 ? "overflow-auto" : "overflow-hidden")} id="drawer-wrapper">
                  <div ref={setFirstSectionRef} className={cn("z-10")}>
                    <div className={cn("w-44 h-2 rounded-xl mx-auto bg-grey-100 my-3")} />
                  </div>
                  <VoltSearchResult
                    data={data}
                    propertiesInteraction={propertiesInteraction}
                    setPropertiesInteraction={setPropertiesInteraction}
                  />
                  <Button
                    id="volt-get-value-button"
                    loading={calculationPending || isGetDataPending}
                    onClick={calculatePrice}
                    disabled={!propertiesInteraction.popup}
                    className="w-full"
                  >
                    Get part of the data <span className="font-extrabold">For Free</span>
                  </Button>
                </div>
              </div>
              <div />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};
export default VoltDrawer;
