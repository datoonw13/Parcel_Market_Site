/* eslint-disable jsx-a11y/media-has-caption */

"use client";

import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import { Drawer } from "vaul";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { IPropertiesInteraction } from "@/types/volt";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import routes from "@/helpers/routes";
import Link from "next/link";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { usePathname } from "next/navigation";
import IntroVideo from "@/components/shared/intro-video";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import VoltDetailsMobileProgressLine from "./mobile-progress-line";
import { Button } from "../../ui/button";
import VoltItem from "./volt-item";
import VoltItemMulti from "./volt-item-multi";

interface VoltDetailsDrawerProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  container: HTMLDivElement | null;
  setDrawerInitialHeight: (val: number | null) => void;
  isSubscribed: boolean;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
  propertiesInteraction: IPropertiesInteraction;
  contentClassName?: string;
  filters: {
    values: z.infer<typeof voltDetailsFiltersValidations>;
    setValue: UseFormSetValue<z.infer<typeof voltDetailsFiltersValidations>>;
    reset: UseFormReset<z.infer<typeof voltDetailsFiltersValidations>>;
    isDirty: boolean;
  };
}

const VoltDetailsDrawer: FC<VoltDetailsDrawerProps> = ({
  container,
  setDrawerInitialHeight,
  data,
  isNonValidMedianHighlighted,
  isSubscribed,
  propertiesInteraction,
  setPropertiesInteraction,
  contentClassName,
  filters,
}) => {
  const pathname = usePathname();
  const [snap, setSnap] = useState<number | string | null>(0);
  const [snapPoints, setSnapPoints] = useState<Array<string | number>>([0, 1]);
  const [drawerContentRef, setDrawerContentRef] = useState<HTMLDivElement | null>(null);
  const [firstSectionRef, setFirstSectionRef] = useState<HTMLDivElement | null>(null);
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [showVideo, setVideo] = useState(true);

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
                  <VoltDetailsMobileProgressLine
                    data={data}
                    propertiesInteraction={propertiesInteraction}
                    setPropertiesInteraction={setPropertiesInteraction}
                    isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                    isSubscribed={isSubscribed}
                  />
                </div>
                <div className="bg-grey-50 border rounded-2xl border-grey-100 flex flex-col gap-3 p-4">
                  {!isSubscribed && (
                    <Link
                      className="w-full"
                      href={`${routes.user.subscription.fullUrl}?redirectUrl=${routes.volt.fullUrl}/${pathname.split("/")[2]}`}
                    >
                      <Button className="rounded-2xl w-full">Subscribe to see prices</Button>
                    </Link>
                  )}
                  <Link className="w-full" href={routes.user.recentSearches.fullUrl}>
                    <Button variant="secondary" className="w-full !bg-white text-primary-main rounded-2xl">
                      <div className="flex items-center gap-3">
                        Data Dashboard <FaExternalLinkAlt />
                      </div>
                    </Button>
                  </Link>
                </div>
                {showVideo && (
                  <div className="rounded-2xl">
                    <div className="flex items-baseline gap-4 justify-between bg-primary-main-100 border border-primary-main border-b-0 rounded-t-2xl py-3 px-4">
                      <h2 className="text-sm">
                        To see the full capabilities of the Parcel Market visit the website with a Desktop device or watch the video
                      </h2>
                      <IoClose
                        onClick={() => setVideo(false)}
                        className="cursor-pointer min-w-5 w-5 min-h-5 h-5 text-grey-600 translate-y-1"
                      />
                    </div>
                    <div className="rounded-b-2xl border border-primary-main border-t-0 aspect-[16/9] h-fit">
                      {/* <video
                        playsInline
                        controls
                        width="100%"
                        height="100%"
                        className="w-full border border-primary-main"
                        poster="/subnail.png"
                        preload="metadata"
                      >
                        <source
                          src="https://hjpblcir9dyus8x7.public.blob.vercel-storage.com/video-QpygzeA5DFEAdEKsmJD9zdki3xxwSe.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video> */}
                      <IntroVideo className="[&>*]:rounded-none [&>*]:rounded-b-2xl [&>div]:after:rounded-none [&>div]:after:rounded-b-2xl" />
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-lg font-semibold">Subject Parcel</h1>
                    <h2 className="text-grey-800 text-sm">This is the parcel of land that you searched.</h2>
                  </div>
                  <div className="flex w-full flex-col gap-4 border border-[#9FD1B3] rounded-2xl p-5 bg-primary-main-50">
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <li>
                        <p className="text-sm font-medium text-grey-600">Owner:</p>
                        <p className="text-sm">{data.owner}</p>
                      </li>
                      <li>
                        <p className="text-sm font-medium text-grey-600">Parcel ID:</p>
                        <p className="text-sm">{data.parcelNumber.formattedString}</p>
                      </li>
                      <li>
                        <p className="text-sm font-medium text-grey-600">Acreage:</p>
                        <p className="text-sm">{data.acreage.formattedString}</p>
                      </li>
                      <li>
                        <p className="text-sm font-medium text-grey-600">Price per acreage:</p>
                        <p className="text-sm">{data.voltPricePerAcreage.formattedString}</p>
                      </li>
                      <li>
                        <p className="text-sm font-medium text-grey-600">State/county:</p>
                        <p className="text-sm">
                          <span>{data.state.label} / </span>
                          <span>{data.county.label}</span>
                        </p>
                      </li>
                      <li>
                        <p className="text-sm font-medium text-grey-600">Property Type:</p>
                        <p className="text-sm">{data.propertyType}</p>
                      </li>
                      <li>
                        <p className="text-sm font-medium text-grey-600">Volt Value:</p>
                        <p className="text-sm">{data.voltPrice.formattedString}</p>
                      </li>
                    </ul>
                    {data.usedForCalculation && (
                      <li className="text-sm font-semibold text-grey-800 list-disc">The subject land was sold with other lands</li>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-lg font-semibold">Recent Sales</h1>
                    <h2 className="text-grey-800 text-sm">
                      These are vacant land parcels that have sold in the past {filters.values.soldWithin} years, within{" "}
                      {filters.values.radius} miles of the subject parcel and are of similar acreage.
                    </h2>
                  </div>
                  <div className="flex flex-col gap-2">
                    {data.assessments.data.map((property) => {
                      if (property.isBulked) {
                        return (
                          <VoltItemMulti
                            sellingPropertyId={data.id}
                            key={property.data.id}
                            data={property}
                            isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                            propertiesInteraction={propertiesInteraction}
                            setPropertiesInteraction={setPropertiesInteraction}
                          />
                        );
                      }
                      return (
                        <VoltItem
                          sellingPropertyId={data.id}
                          key={property.data.id}
                          data={property}
                          isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                          propertiesInteraction={propertiesInteraction}
                          setPropertiesInteraction={setPropertiesInteraction}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="h-[110px]" />
            </div>
            <div />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
export default VoltDetailsDrawer;
