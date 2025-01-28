"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { IVoltPriceCalculation } from "@/types/volt";
import VoltDetailsProgressLine from "./progress-line";

const VoltDetailsDrawer = ({
  container,
  data,
  averageOfPropertiesUsedForCal,
}: {
  container: HTMLDivElement | null;
  data: IVoltPriceCalculation & { dateCreated: Date };
  averageOfPropertiesUsedForCal: number;
}) => {
  const [snap, setSnap] = useState<number | string | null>(0);
  const [snapPoints, setSnapPoints] = useState<Array<string | number>>([0, 1]);
  const [drawerContentRef, setDrawerContentRef] = useState<HTMLDivElement | null>(null);
  const [firstSectionRef, setFirstSectionRef] = useState<HTMLDivElement | null>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement | null>(null);
  const [isDragging, setDragging] = useState(false);

  const setDrawerContentDimension = useCallback(() => {
    if (!container || !drawerContentRef || !firstSectionRef || !overlayRef) return;
    const { width, height } = container.getBoundingClientRect();
    drawerContentRef.style.width = `${width + 1}px`;
    drawerContentRef.style.height = `${height}px`;

    overlayRef.style.width = `${width + 1}px`;
    overlayRef.style.height = `${height}px`;

    const { height: firstSectionHeight } = firstSectionRef.getBoundingClientRect();
    console.log(firstSectionHeight, 22);

    const minSnapPoint = firstSectionHeight / height + 0.15;

    setSnapPoints([minSnapPoint, 1]);
    setSnap(minSnapPoint);
    document.body.style.pointerEvents = "auto";
  }, [container, drawerContentRef, firstSectionRef, overlayRef]);

  useEffect(() => {
    setDrawerContentDimension();
    window.addEventListener("resize", () => setDrawerContentDimension());
    return () => {
      window.removeEventListener("resize", setDrawerContentDimension);
    };
  }, [setDrawerContentDimension]);

  return (
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
      <Drawer.Overlay ref={setOverlayRef} className={cn("absolute inset-0 bg-black/40", isDragging || snap === 1 ? "block" : "hidden")} />
      <Drawer.Portal>
        <Drawer.Content
          ref={setDrawerContentRef}
          className={cn(
            "w-0 overflow-hidden fixed flex outline-none  flex-col border-b-none bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]",
            (!container || !drawerContentRef || !firstSectionRef) && "hidden"
          )}
        >
          <div
            className={cn(
              "flex flex-col mx-auto w-full h-full relative after:content-[''] !overflow-hidden shadow-5 after:absolute after:border after:rounded-t-xl after:bg-white after:w-full after:h-full rounded-t-2xl after:translate-y-[20px] after:overflow-hidden"
            )}
          >
            {!(snap === 1) && <Drawer.Title className="w-44 h-2 rounded-xl mx-auto mb-2 bg-white" />}
            <div className="z-10 overflow-hidden">
              <div ref={setFirstSectionRef} className={cn("z-10 p-5")}>
                <div className={cn("w-44 h-2 rounded-xl mx-auto bg-grey-100 hidden my-3", snap === 1 && "block")} />
                <VoltDetailsProgressLine data={data} averageOfPropertiesUsedForCal={averageOfPropertiesUsedForCal} />
              </div>
              {/* <div className="overflow-scroll">
                <p>Test</p>
                <p>Test</p>
                <p>Test</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test2</p>
                <p>Test211</p>
              </div> */}
            </div>
            <div />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
export default VoltDetailsDrawer;
