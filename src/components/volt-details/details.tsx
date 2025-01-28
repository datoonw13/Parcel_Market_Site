"use client";

import useMap from "@/hooks/useMap";
import dynamic from "next/dynamic";
import { FC, Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { IVoltPriceCalculation } from "@/types/volt";
import { RiExternalLinkFill } from "react-icons/ri";
import { ScrollArea } from "../ui/scroll-area";
import { LoadingIcon1 } from "../@new/icons/LoadingIcons";
import VoltDetailsDrawer from "./drawer";
import { AutoComplete } from "../ui/autocomplete";
import { Button } from "../ui/button";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltDetailsProps {
  data: {
    data: IVoltPriceCalculation & { dateCreated: Date };
    additionalData: IVoltPriceCalculation & { dateCreated: Date };
  } | null;
  loading?: boolean;
  averageOfPropertiesUsedForCal?: number;
}

const VoltDetails: FC<VoltDetailsProps> = ({ loading, data, averageOfPropertiesUsedForCal }) => {
  const { ref, setRef } = useMap();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className={cn("w-full h-full grid grid-cols-[1fr_min(25vw,_330px)] overflow-hidden relative")}>
      {loading && (
        <div className="w-full h-full z-10 absolute flex items-center justify-center">
          <LoadingIcon1 className="!size-10 [&>path]:fill-primary-main-800 z-10" />
        </div>
      )}
      <div className={cn(!ref && "bg-grey-100 animate-pulse", "relative")} ref={setContainer}>
        <Suspense fallback={<div className="w-full h-full bg-primary-main-800 animate-pulse" />}>
          <Map setRef={setRef} ref={ref} />
        </Suspense>
        {container && data?.data && averageOfPropertiesUsedForCal && (
          <VoltDetailsDrawer averageOfPropertiesUsedForCal={averageOfPropertiesUsedForCal} data={data.data} container={container} />
        )}
      </div>
      <div className="bg-white overflow-hidden">
        <ScrollArea className="h-full [&>div>div:first-child]:h-full pt-8 pb-12" id="volt-scroll">
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-4 px-4">
              <AutoComplete
                options={["Layover 1", "Layover 2", "Layover 3", "Layover 4", "Layover 5"].map((el) => ({ label: el, value: el }))}
                onValueChange={(item) => {
                  // if (item) {
                  //   searchParams.set("state", item);
                  //   searchParams.delete("county");
                  //   router.push(`${pathname}?${searchParams.toString()}`);
                  // }
                }}
                placeholder="Layovers"
                selectedValue={null}
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
                placeholder="BaseMap"
                selectedValue={null}
              />
              <Button variant="secondary" className="w-full !text-primary-main [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                Data Dashboard <RiExternalLinkFill className="!text-primary-main size-5" />
              </Button>
              <Button variant="default" className="w-full ">
                Search another land
              </Button>
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default VoltDetails;
