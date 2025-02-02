"use client";

import useMap from "@/hooks/useMap";
import dynamic from "next/dynamic";
import { FC, Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { IVoltPriceCalculation } from "@/types/volt";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { AutoComplete } from "../ui/autocomplete";
import { Button } from "../ui/button";
import VoltDetailsProgressLine from "./progress-line";
import VoltDetailsCalculationTable from "./calculation-table";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltDetailsProps {
  data: z.infer<typeof PropertyDataSchema>;
}

const VoltDetails: FC<VoltDetailsProps> = ({ data }) => {
  const { ref, setRef } = useMap();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [propertiesInteraction, setPropertiesInteraction] = useState<{ [key: string]: "hovered" | "popup" }>({});
  const [backDrop, setBackDrop] = useState(false);

  return (
    <div className={cn("w-full h-full grid grid-cols-[1fr_min(25vw,_330px)] overflow-hidden relative")}>
      <div className={cn("overflow-hidden")} ref={setContainer}>
        <div className="w-full h-[90%]">
          <Suspense fallback={<div className="w-full h-[full] bg-primary-main-800 animate-pulse" />}>
            <Map setRef={setRef} ref={ref} />
          </Suspense>
        </div>
        {ref && (
          <div className="my-6 mx-4">
            <VoltDetailsProgressLine
              data={data}
              propertiesInteraction={propertiesInteraction}
              setPropertiesInteraction={setPropertiesInteraction}
            />
          </div>
        )}
        {ref && (
          <div className="mx-4">
            <VoltDetailsCalculationTable />
          </div>
        )}
      </div>
      <div className="h-full flex flex-col py-6 justify-between overflow-hidden relative">
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
        <div className="flex flex-col gap-4 px-4">
          <AutoComplete
            onOpenChange={setBackDrop}
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
