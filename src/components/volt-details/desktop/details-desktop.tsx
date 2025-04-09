"use client";

import { Dispatch, FC, SetStateAction, TransitionStartFunction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn, hideNumber } from "@/lib/utils";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import moment from "moment";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { IoMdClose } from "react-icons/io";
import { IPropertiesInteraction } from "@/types/volt";
import { Tooltip } from "@/components/ui/tooltip";
import { IUserBaseInfo } from "@/types/auth";
import { exportToExcel, exportToKml } from "@/lib/volt";
import routes from "@/helpers/routes";
import { usePathname } from "next/navigation";
import { SubscriptionType } from "@/types/subscriptions";
import { AutoComplete } from "../../ui/autocomplete";
import { Button } from "../../ui/button";
import VoltDetailsDesktopProgressLine from "./desktop-progress-line";
import VoltDetailsCalculationTable from "./calculation-table";
import VoltDetailsMap from "../map/map";
import VoltDetailsFiltersDropDown from "../filters/dropdown";
import { ScrollArea } from "../../ui/scroll-area";
import VoltDetailsDesktopHeader from "./desktop-header";
import VoltDetailsMapPopup from "../map/map-popup";

interface VoltDetailsDesktopProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  startFetchingTransition: TransitionStartFunction;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  filters: z.infer<typeof voltDetailsFiltersValidations>;
  setFilters: Dispatch<SetStateAction<z.infer<typeof voltDetailsFiltersValidations>>>;
  isSubscribed: boolean;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
  user: IUserBaseInfo | null;
}

const VoltDetailsDesktop: FC<VoltDetailsDesktopProps> = ({
  data,
  isNonValidMedianHighlighted,
  propertyTypes,
  setNonValidMedianHighlighted,
  startFetchingTransition,
  filters,
  setFilters,
  isSubscribed,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
  user,
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });
  const tableRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<ReturnType<typeof setTimeout>>();
  const sortedAssessments = useRef<z.infer<typeof PropertyDataSchema>["assessments"]["data"]>([]);
  const [exportMapPending, setExportMapPending] = useState(false);
  const [scrollAnimationEnd, setScrollAnimationEnd] = useState(false);
  const pathname = usePathname();

  const mapPopupRef = useRef<HTMLDivElement>(null);

  const onMarkerInteraction = useCallback((data: Partial<IPropertiesInteraction>) => {
    setPropertiesInteraction((prev) => ({ ...prev, ...data }));
  }, []);

  const onMouseLeave = useCallback(() => {
    setPropertiesInteraction((prev) => ({ ...prev, hover: null }));
  }, []);

  const onPopupClose = useCallback(() => {
    setPropertiesInteraction((prev) => ({ ...prev, popup: null }));
  }, []);

  const handleResize = useCallback(() => {
    const el = document.getElementById("volt-progress-line");
    if (el && tableRef.current) {
      const { height } = el.getBoundingClientRect();
      tableRef.current.style.height = `calc(100vh - ${height + 17}px)`;
    }
  }, []);

  const openPopupDetails = useMemo(() => {
    const id = propertiesInteraction.popup?.openId;

    if (!id) {
      return null;
    }

    if (data.id === id) {
      const salesHistory = data.assessments.data
        .map((el) => (el.isBulked ? el.data.properties : el.data))
        .flat()
        .find((el) => el.id === data.id);

      const details = {
        type: "main-property" as const,
        lat: data.lat,
        lon: data.lon,
        salesHistory: salesHistory
          ? {
              blur: !isSubscribed,
              lastSaleDate: moment(salesHistory.lastSaleDate).format("MM-DD-YYYY"),
              lastSalesPrice: salesHistory.lastSalePrice.formattedString,
            }
          : null,
        data: {
          owner: {
            label: "Owner",
            value: data.owner,
          },
          parcelNumber: {
            label: "Parcel ID",
            value: data.parcelNumber.formattedString,
          },
          acreage: {
            label: "Acreage",
            value: data.acreage.formattedString,
          },
          stateAndCounty: {
            label: "State/County",
            value: `${data.state.label}/${data.county.label}`,
          },
          voltValue: {
            label: "Volt Value",
            value: data.voltPrice.formattedString,
            blur: !isSubscribed,
          },
          pricePerAcreage: {
            label: "Price Per Acreage",
            value: data.voltPrice.formattedString,
            blur: !isSubscribed,
          },
        },
      };
      return details;
    }

    const property = data.assessments.data.find((el) => el.data.id === id);

    if (!property) {
      return null;
    }

    if (property.isBulked) {
      const hasSellingProperty = !!property.data.properties.find((el) => el.id === data.id);

      const details = {
        type: "bulk" as const,
        lat: hasSellingProperty ? data.lat : property.data.properties[0].latitude,
        lon: hasSellingProperty ? data.lon : property.data.properties[0].longitude,
        hasSellingProperty,
        data: {
          parcelNumber: {
            label: "Parcel ID",
            value: `Multiple(${property.data.group.toLocaleUpperCase()})`,
          },
          acreage: {
            label: "Acreage",
            value: property.data.acreage.formattedString,
          },
          stateAndCounty: {
            label: "State/County",
            value: `${property.data.state.label}/${property.data.county.label}`,
          },
          lastSalePrice: {
            label: "Last Sale Price",
            value: property.data.lastSalePrice.formattedString,
            blur: !isSubscribed,
          },
          lastSaleDate: {
            label: "Last Sale Date",
            value: moment(property.data.lastSaleDate).format("MM-DD-YYYY"),
          },
          pricePerAcreage: {
            label: "Price Per Acreage",
            value: property.data.pricePerAcreage.formattedString,
            blur: !isSubscribed,
          },
        },
      };
      return details;
    }

    if (!property.isBulked) {
      const details = {
        type: "default" as const,
        lat: property.data.latitude,
        lon: property.data.longitude,
        data: {
          parcelNumber: {
            label: "Parcel ID",
            value: property.data.parcelNumber.formattedString,
          },
          acreage: {
            label: "Acreage",
            value: property.data.acreage.formattedString,
          },
          stateAndCounty: {
            label: "State/County",
            value: `${property.data.state.label}/${property.data.county.label}`,
          },
          lastSalePrice: {
            label: "Last Sale Price",
            value: property.data.lastSalePrice.formattedString,
            blur: !isSubscribed,
          },
          lastSaleDate: {
            label: "Last Sale Date",
            value: moment(property.data.lastSaleDate).format("MM-DD-YYYY"),
          },
          pricePerAcreage: {
            label: "Price Per Acreage",
            value: property.data.pricePerAcreage.formattedString,
            blur: !isSubscribed,
          },
        },
      };

      return details;
    }

    return null;
  }, [
    data.acreage.formattedString,
    data.assessments.data,
    data.county.label,
    data.id,
    data.lat,
    data.lon,
    data.owner,
    data.parcelNumber.formattedString,
    data.state.label,
    data.voltPrice.formattedString,
    isSubscribed,
    propertiesInteraction.popup?.openId,
  ]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        mapPopupRef.current &&
        (event.target as Element).classList.contains("mapboxgl-canvas") &&
        !mapPopupRef.current.contains(event.target as Node)
      ) {
        onPopupClose();
      }
    },
    [onPopupClose]
  );

  const renderSubjectParcelContent = useCallback(
    () => (
      <ul className="min-w-[--radix-popper-anchor-width] p-4 space-y-4">
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          Owner: <span className="text-sm font-medium text-black">{data?.owner}</span>
        </li>
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          Parcel ID: <span className="text-sm font-medium text-black">{data?.parcelNumber.formattedString}</span>
        </li>
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          Acreage: <span className="text-sm font-medium text-black">{data?.acreage.formattedString}</span>
        </li>
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          State/County:{" "}
          <span className="text-sm font-medium text-black">
            {data.state.label}/{data.county.label}
          </span>
        </li>
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          Volt Value: <span className="text-sm font-medium text-black">{data?.voltPrice.formattedString}</span>
        </li>
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          Price Per Acreage: <span className="text-sm font-medium text-black">{data.voltPricePerAcreage.formattedString}</span>
        </li>
        <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
          Property Type: <span className="text-sm font-medium text-black">{data?.propertyType || "N/A"}</span>
        </li>
        {data.usedForCalculation && (
          <li className="text-grey-900 font-semibold text-sm ml-4 list-disc marker:text-primary-main-400">
            The subject land was sold with other lands
          </li>
        )}
      </ul>
    ),
    [
      data?.acreage.formattedString,
      data.county.label,
      data?.owner,
      data?.parcelNumber.formattedString,
      data?.propertyType,
      data.state.label,
      data.usedForCalculation,
      data?.voltPrice.formattedString,
      data.voltPricePerAcreage.formattedString,
    ]
  );

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  useEffect(
    () => () => {
      window.clearTimeout(timeRef.current);
    },
    []
  );

  useEffect(() => {
    if (propertiesInteraction.popup?.openId === data.id || propertiesInteraction.popup?.clickId === data.id) {
      window.subjectParcelPopupToggle(true);
    }
  }, [data.id, propertiesInteraction]);

  return (
    <div className={cn("w-full h-full grid grid-cols-[1fr_min(20vw,_260px)] overflow-hidden relative")}>
      {!scrollAnimationEnd && <div className="fixed top-0 w-full h-full bg-black/20 z-30 !m-0" />}
      <div className={cn("overflow-hidden space-y-4")} ref={setContainer}>
        <div>
          <div className="w-full h-screen grid grid-rows-[1fr_minmax(0,_max-content)]" id="map">
            <div className="h-full relative">
              <div className="absolute h-[calc(100%-60px)] w-full">
                <VoltDetailsDesktopHeader
                  data={data}
                  startFetchingTransition={startFetchingTransition}
                  isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                  setNonValidMedianHighlighted={setNonValidMedianHighlighted}
                  propertyTypes={propertyTypes}
                  filters={filters}
                  setFilters={setFilters}
                  isSubscribed={isSubscribed}
                  mapLayers={mapLayers}
                  selectedLayer={selectedLayer}
                  setSelectedLayer={setSelectedLayer}
                />
              </div>
              <VoltDetailsMap
                propertiesInteraction={propertiesInteraction}
                onMouseLeave={onMouseLeave}
                onMarkerInteraction={onMarkerInteraction}
                data={data}
                isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                selectedLayer={selectedLayer}
              />
              <AnimatePresence>
                {openPopupDetails && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "linear" }}
                    ref={mapPopupRef}
                  >
                    <div
                      style={{
                        boxShadow: "0px 4px 22px 0px rgba(0, 0, 0, 0.25)",
                      }}
                      className="bg-white w-fit h-fit rounded-2xl absolute bottom-8 left-4 z-10 overflow-hidden pr-1 py-4"
                    >
                      <ScrollArea className="flex max-h-96 max-w-lg flex-col overflow-y-auto">
                        <div className="flex items-center gap-4 justify-between px-4 sticky top-0 bg-white pb-4">
                          <h1 className="font-medium text-sm">Selected land information</h1>
                          <IoMdClose className="size-6 cursor-pointer" onClick={onPopupClose} />
                        </div>
                        <div className="px-4">
                          <VoltDetailsMapPopup data={openPopupDetails} />
                        </div>
                      </ScrollArea>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div
              onWheel={() => {
                const elements = document.getElementsByClassName("scroll-arrow");
                Array.from(elements).forEach((el) => {
                  if (!el.classList.contains("animate-scroll")) {
                    el.classList.add("animate-scroll");
                    timeRef.current = setTimeout(() => {
                      el.classList.remove("animate-scroll");
                    }, 1000);
                  }
                });
              }}
            >
              <VoltDetailsDesktopProgressLine
                data={data}
                propertiesInteraction={propertiesInteraction}
                setPropertiesInteraction={setPropertiesInteraction}
                isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                isSubscribed={isSubscribed}
              />
            </div>
          </div>
        </div>
        <motion.div
          className="relative bg-white"
          initial={{ y: "-30%", zIndex: 9999 }}
          animate={{ y: 0, zIndex: 9999 }}
          exit={{ y: 0, zIndex: 0 }}
          transition={{
            duration: 0.6,
            delay: 3,
          }}
          onAnimationComplete={(e) => {
            setScrollAnimationEnd(true);
          }}
        >
          <div ref={tableRef} className="h-screen overflow-hidden">
            <ScrollArea className="h-full [&>div>div:first-child]:h-full">
              <VoltDetailsCalculationTable
                data={data}
                propertiesInteraction={propertiesInteraction}
                setPropertiesInteraction={setPropertiesInteraction}
                isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                isSubscribed={isSubscribed}
                onSortChange={(data) => {
                  sortedAssessments.current = data;
                }}
              />
            </ScrollArea>
          </div>
        </motion.div>
      </div>
      <div className="h-full flex flex-col py-6 pt-1.5 justify-between overflow-auto  shadow-2 relative z-10">
        <div id="map-options" className="flex flex-col gap-4 px-4">
          <VoltDetailsFiltersDropDown
            align="end"
            label={`${data.acreage.formattedString} Acre, ${data.propertyType || "N/A"}`}
            value="Subject Parcel"
            setStateHandler={(handler) => {
              window.subjectParcelPopupToggle = handler;
            }}
            renderContent={renderSubjectParcelContent}
          />
          <AutoComplete
            options={mapLayers}
            onValueChange={(item) => {
              setSelectedLayer(item || "");
            }}
            placeholder="BaseMap"
            selectedValue={selectedLayer}
          />
          <AutoComplete
            options={["BaseMap 1", "BaseMap 2", "BaseMap 3", "BaseMap 4", "BaseMap 5"].map((el) => ({ label: el, value: el }))}
            onValueChange={(item) => {
              // if (item) {
              //   searchParams.set("state", item);
              //   searchParams.delete("county");
              //   router.push(`${pathname}?${searchParams.toString()}`);
              // }
            }}
            disabled
            placeholder="Layovers"
            selectedValue={null}
          />
          <Link href={routes.user.recentSearches.fullUrl}>
            <Button variant="secondary" className="w-full !text-primary-main [&>span]:flex [&>span]:items-center [&>span]:gap-2">
              Data Dashboard <RiExternalLinkFill className="!text-primary-main size-5" />
            </Button>
          </Link>
          {!isSubscribed && (
            <Link href={`${routes.user.subscription.fullUrl}?redirectUrl=${routes.volt.fullUrl}/${pathname.split("/")[2]}`}>
              <Button variant="default" className="w-full ">
                Subscribe to see price
              </Button>
            </Link>
          )}
          <Link className="underline text-primary-main font-medium text-center" href={routes.volt.fullUrl}>
            Search another land
          </Link>
        </div>
        <div className="my-3 overflow-hidden relative">
          <div
            onScroll={(e) => {
              if (container) {
                const scrollRatio =
                  (container.scrollHeight - container.clientHeight) / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight);
                container.scrollTop = e.currentTarget.scrollTop * scrollRatio;
              }
            }}
            className="overflow-y-auto w-[calc(100%+18px)] h-full overflow-x-hidden cursor-n-resize"
          >
            {container && (
              <div className="flex sticky top-0 h-full items-center justify-center">
                <div className="flex flex-col items-center gap-5">
                  <div className="scroll-arrow w-0 h-10 border border-grey-800 relative after:content-[''] after:rotate-180 after:-translate-y-full after:block after:absolute after:top-0 after:-left-[5px] after:w-[1px] after:h-2.5 after:border-t-[10px] after:border-t-grey-800 after:border-l-[5px] after:border-l-transparent after:border-r-[5px] after:border-r-transparent" />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1], // Scale up to 1.05 and back to 1
                    }}
                    transition={{
                      duration: 1.3, // Duration of one pulse cycle
                      repeat: 2,
                      ease: "linear", // Smooth easing
                      delay: 2,
                    }}
                  >
                    <p className={cn("text-center px-4 mx-auto", scrollAnimationEnd && "text-grey-800")}>
                      Place your cursor here and <span className="font-bold">Scroll Up</span> or{" "}
                      <span className="font-bold">Scroll Down</span>
                    </p>
                  </motion.div>
                  <div className="scroll-arrow w-0 h-10 border border-grey-800 relative after:content-[''] after:block after:absolute after:top-[100%] after:-left-[5px] after:w-[1px] after:h-2.5 after:border-t-[10px] after:border-t-grey-800 after:border-l-[5px] after:border-l-transparent after:border-r-[5px] after:border-r-transparent" />
                </div>
              </div>
            )}
            {container && <div className="" style={{ height: container.scrollHeight }} />}
          </div>
        </div>
        <div className="px-4 py-3 border rounded-2xl mx-4 flex flex-col gap-3">
          {!user?.isSubscribed ? (
            <>
              <Tooltip
                contentClasses="w-full"
                renderButton={
                  <Button disabled className="w-full" variant="secondary">
                    <div className="flex flex-row items-center gap-3">
                      <IoEarthSharp className="size-4 text-info" />
                      Export Map
                    </div>
                  </Button>
                }
                buttonClassName="w-full"
                renderContent="You cannot export this data with the free plan"
              />

              <Tooltip
                renderButton={
                  <Button disabled className="w-full">
                    <div className="flex flex-row items-center gap-3">
                      <IoCloudDownloadOutline className="size-4" />
                      Export Data
                    </div>
                  </Button>
                }
                buttonClassName="w-full"
                renderContent="You cannot export this data with the free plan"
              />
            </>
          ) : (
            <>
              <Button
                className="w-full"
                variant="secondary"
                loading={exportMapPending}
                onClick={async () => {
                  setExportMapPending(true);
                  await exportToKml(
                    { ...data, assessments: { ...data.assessments, data: sortedAssessments.current } },
                    isNonValidMedianHighlighted
                  );
                  setExportMapPending(false);
                }}
              >
                <div className="flex flex-row items-center gap-3">
                  <IoEarthSharp className="size-4 text-info" />
                  Export Map
                </div>
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  exportToExcel(
                    { ...data, assessments: { ...data.assessments, data: sortedAssessments.current } },
                    isNonValidMedianHighlighted
                  );
                }}
              >
                <div className="flex flex-row items-center gap-3">
                  <IoCloudDownloadOutline className="size-4" />
                  Export Data
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoltDetailsDesktop;
