"use client";

import { FC, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { moneyFormatter } from "@/helpers/common";
import moment from "moment";
import { AutoComplete } from "../ui/autocomplete";
import { Button } from "../ui/button";
import VoltDetailsProgressLine from "./progress-line";
import VoltDetailsCalculationTable from "./calculation-table";
import VoltDetailsMap from "./map/map";
import VoltDetailsFiltersDropDown from "./filters/dropdown";
import { ScrollArea } from "../ui/scroll-area";

interface VoltDetailsProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
}

const mapLayers = [
  {
    label: "Navigation Day",
    value: "mapbox://styles/mapbox/navigation-day-v1",
  },
  {
    label: "Standart",
    value: "mapbox://styles/mapbox/standard",
  },
  {
    label: "Standard Satellite",
    value: "mapbox://styles/mapbox/standard-satellite",
  },
  {
    label: "Streets",
    value: "mapbox://styles/mapbox/streets-v12",
  },
  {
    label: "Outdoors",
    value: "mapbox://styles/mapbox/outdoors-v12",
  },
  {
    label: "Light",
    value: "mapbox://styles/mapbox/light-v11",
  },
  {
    label: "Dark",
    value: "mapbox://styles/mapbox/dark-v11",
  },
  {
    label: "Satellite",
    value: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    label: "Satellite Streets",
    value: "mapbox://styles/mapbox/satellite-streets-v12",
  },
  {
    label: "Navigation Night",
    value: "mapbox://styles/mapbox/navigation-night-v1",
  },
];

const VoltDetails: FC<VoltDetailsProps> = ({ data, isNonValidMedianHighlighted }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [propertiesInteraction, setPropertiesInteraction] = useState<{ [key: string]: "hovered" | "popup" }>({});
  const [backDrop, setBackDrop] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("mapbox://styles/mapbox/navigation-day-v1");

  const onMarkerInteraction = useCallback((parcelNumberNoFormatting: string, action: "hover" | "popup") => {
    // if (action === "hover") {
    //   const newData = { ...propertiesInteraction };
    //   Object.keys(newData).forEach((key) => {
    //     if (newData[key] === "hovered") {
    //       delete newData[key];
    //     }
    //   });

    //   if (propertiesInteraction[parcelNumberNoFormatting] !== "popup") {
    //     newData[parcelNumberNoFormatting] = "hovered";
    //   }
    //   setPropertiesInteraction({ ...newData });
    // } else {
    //   setPropertiesInteraction({ [parcelNumberNoFormatting]: "popup" });
    // }
    setPropertiesInteraction((prev) => {
      if (action === "hover") {
        const newData = { ...prev };
        Object.keys(newData).forEach((key) => {
          if (newData[key] === "hovered") {
            delete newData[key];
          }
        });

        if (newData[parcelNumberNoFormatting] !== "popup") {
          newData[parcelNumberNoFormatting] = "hovered";
        }
        return { ...newData };
      }
      return { [parcelNumberNoFormatting]: "popup" };
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    // const newData = { ...propertiesInteraction };
    // Object.keys(newData).forEach((key) => {
    //   if (newData[key] === "hovered") {
    //     delete newData[key];
    //   }
    // });
    setPropertiesInteraction((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((key) => {
        if (newData[key] === "hovered") {
          delete newData[key];
        }
      });
      return newData;
    });
  }, []);

  const onPopupClose = useCallback(() => {
    const newData = { ...propertiesInteraction };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === "popup") {
        delete newData[key];
      }
    });
    setPropertiesInteraction({ ...newData });
  }, [propertiesInteraction]);

  return (
    <div className={cn("w-full h-full grid grid-cols-[1fr_min(20vw,_260px)] overflow-hidden relative")}>
      <div className={cn("overflow-hidden space-y-4")} ref={setContainer}>
        <div>
          <div className="w-full h-screen grid grid-rows-[1fr_minmax(0,_max-content)]" id="map">
            <div className="h-full">
              <VoltDetailsMap
                propertiesInteraction={propertiesInteraction}
                onMouseLeave={onMouseLeave}
                onMarkerInteraction={onMarkerInteraction}
                data={data}
                isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                onPopupClose={onPopupClose}
                selectedLayer={selectedLayer}
              />
            </div>
            <VoltDetailsProgressLine
              data={data}
              propertiesInteraction={propertiesInteraction}
              setPropertiesInteraction={setPropertiesInteraction}
              isNonValidMedianHighlighted={isNonValidMedianHighlighted}
            />
          </div>
        </div>
        <div className="h-screen overflow-hidden">
          <ScrollArea className="h-full [&>div>div:first-child]:h-full">
            <VoltDetailsCalculationTable
              data={data}
              propertiesInteraction={propertiesInteraction}
              setPropertiesInteraction={setPropertiesInteraction}
              isNonValidMedianHighlighted={isNonValidMedianHighlighted}
            />
          </ScrollArea>
        </div>
      </div>
      <div className="h-full flex flex-col py-6 pt-1.5 justify-between overflow-auto  shadow-2 relative z-10">
        <AnimatePresence>
          {backDrop && (
            <motion.div
              exit={{
                opacity: 0,
                filter: "blur(5px)",
                transition: { ease: "easeIn", duration: 0.22 },
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { type: "spring", duration: 0.7 },
              }}
              className="absolute bg-black/40 h-full w-full content-[''] z-10 top-0"
            />
          )}
        </AnimatePresence>
        <div id="map-options" className="flex flex-col gap-4 px-4">
          <VoltDetailsFiltersDropDown
            onClose={() => {
              setBackDrop(false);
            }}
            onOpen={() => {
              setBackDrop(true);
            }}
            label={`${data.acreage.toFixed(2)} Acre, ${data.propertyType || "N/A"}`}
            value="Subject Parcel"
            renderContent={() => (
              <ul className="min-w-[--radix-popper-anchor-width] p-4 space-y-4">
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Owner: <span className="text-sm font-medium text-black">{data?.owner}</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Parcel ID: <span className="text-sm font-medium text-black">{data?.parcelNumber}</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Acreage: <span className="text-sm font-medium text-black">{data?.acreage}</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  State/County: <span className="text-sm font-medium text-black">ae</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Volt Value: <span className="text-sm font-medium text-black">{data?.price && moneyFormatter.format(data?.price)}</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Price Per Acreage:{" "}
                  <span className="text-sm font-medium text-black">{moneyFormatter.format(data.price / data.acreage)}</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Property Type: <span className="text-sm font-medium text-black">{data?.propertyType || "N/A"}</span>
                </li>
                <li className="text-grey-600 font-medium text-sm marker:text-primary-main-400  ml-4 list-disc">
                  Search Date: <span className="text-sm font-medium text-black">{moment(data.dateCreated).format("MM-DD-YYYY")}</span>
                </li>
              </ul>
            )}
          />
          <AutoComplete
            onOpenChange={setBackDrop}
            options={mapLayers}
            onValueChange={(item) => {
              setSelectedLayer(item || "");
              // if (item) {
              //   searchParams.set("state", item);
              //   searchParams.delete("county");
              //   router.push(`${pathname}?${searchParams.toString()}`);
              // }
            }}
            placeholder="Layers"
            selectedValue={selectedLayer}
          />
          <AutoComplete
            onOpenChange={setBackDrop}
            options={["BaseMap 1", "BaseMap 2", "BaseMap 3", "BaseMap 4", "BaseMap 5"].map((el) => ({ label: el, value: el }))}
            onValueChange={(item) => {
              // if (item) {
              //   searchParams.set("state", item);
              //   searchParams.delete("county");
              //   router.push(`${pathname}?${searchParams.toString()}`);
              // }
            }}
            placeholder="BaseMap"
            selectedValue={null}
          />
          <Button variant="secondary" className="w-full !text-primary-main [&>span]:flex [&>span]:items-center [&>span]:gap-2">
            Data Dashboard <RiExternalLinkFill className="!text-primary-main size-5" />
          </Button>
          <Button variant="default" className="w-full ">
            Subscribe to see price
          </Button>
          <Link className="underline text-primary-main font-medium text-center" href="/">
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
            {container && <div className="" style={{ height: container.scrollHeight }} />}
          </div>
        </div>
        <div className="px-4 py-3 border rounded-2xl mx-4 flex flex-col gap-3">
          <Button
            onClick={() => {
              // exportToKml(data);
            }}
            className="w-full"
            variant="secondary"
          >
            <div className="flex flex-row items-center gap-3">
              <IoEarthSharp className="size-4 text-info" />
              Export Map
            </div>
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              // exportToExcel(data, additionalDataResult);
              // setExcelWarning(true);
            }}
          >
            <div className="flex flex-row items-center gap-3">
              <IoCloudDownloadOutline className="size-4" />
              Export Data
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoltDetails;
