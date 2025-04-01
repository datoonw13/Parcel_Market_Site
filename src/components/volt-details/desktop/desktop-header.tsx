"use client";

import React, { Dispatch, FC, SetStateAction, TransitionStartFunction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { IoInformationCircleOutline } from "react-icons/io5";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn, hideNumber } from "@/lib/utils";
import { moneyFormatter } from "@/helpers/common";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import Link from "next/link";
import routes from "@/helpers/routes";
import { CiSearch } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import VoltDetailsFiltersWrapper from "../filters/wrapper";
import { Tooltip } from "../../ui/tooltip";
import { Switch } from "../../ui/switch";
import { AvgDescription, VoltDescription } from "../tooltip-contents";

interface VoltDetailsDesktopHeaderProps {
  startFetchingTransition: TransitionStartFunction;
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  filters: z.infer<typeof voltDetailsFiltersValidations>;
  setFilters: Dispatch<SetStateAction<z.infer<typeof voltDetailsFiltersValidations>>>;
  isSubscribed: boolean;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
}

const VoltDetailsDesktopHeader: FC<VoltDetailsDesktopHeaderProps> = ({
  startFetchingTransition,
  data,
  isNonValidMedianHighlighted,
  setNonValidMedianHighlighted,
  propertyTypes,
  filters,
  setFilters,
  isSubscribed,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
}) => {
  const [openWarning, setWarning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // useEffect(() => {
  //   if (openWarning) {
  //     timerRef.current = setTimeout(() => {
  //       setWarning(false);
  //     }, 2500);
  //   } else {
  //     window.clearTimeout(timerRef.current);
  //   }
  //   return () => {
  //     window.clearTimeout(timerRef.current);
  //   };
  // }, [openWarning]);

  useEffect(() => {
    if (data.assessments.data.length === 0) {
      setWarning(true);
    } else {
      setWarning(false);
    }
  }, [data.assessments]);

  return (
    <div className="sticky top-0 bottom-8 w-full z-20">
      <div className={cn("grid w-full grid-cols-[1fr_minmax(0,_max-content)] py-1.5 px-2 gap-8 xl:gap-14")}>
        <VoltDetailsFiltersWrapper
          startFetchingTransition={startFetchingTransition}
          filters={filters}
          setFilters={setFilters}
          propertyTypes={propertyTypes}
          mapLayers={mapLayers}
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          isDataEmpty={data.assessments.data.length === 0}
        />
        <div className="relative z-20">
          <div className="grid grid-cols-2 gap-2">
            <div className="shadow-6 border border-grey-100 bg-white px-3 py-2 flex justify-between items-center rounded-xl gap-4 h-full">
              <p className="text-sm font-medium">
                Avg:{" "}
                <span className={cn(!isSubscribed && !(data.assessments.data.length <= 1) && "blur-[2px]")}>
                  {data.assessments.data.length <= 1 ? "$ NaN" : data.nonVoltPrice.formattedString}
                </span>
              </p>
              <Tooltip
                contentClasses="bg-transparent p-0 border-0 w-max max-w-2xl"
                renderButton={<IoInformationCircleOutline className="size-5 text-grey-600" />}
                renderContent={
                  <div
                    className="p-0.5"
                    style={{
                      background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
                      borderRadius: 12,
                      boxShadow: "0px 4px 12px 0px #0000001F",
                    }}
                  >
                    <div style={{ borderRadius: 10 }} className="bg-white">
                      <AvgDescription />
                    </div>
                  </div>
                }
              />
            </div>
            <div className="shadow-6 border border-grey-100 bg-white flex justify-between items-center rounded-xl h-full">
              <div className="p-3 border-r flex items-center gap-2">
                <p className="text-sm font-medium">
                  VOLT:
                  <span className={cn(!isSubscribed && !(data.assessments.data.length < 3) && "blur-[2px]")}>
                    {data.assessments.data.length < 3 ? " $ NaN" : data.voltPrice.formattedString}
                  </span>
                </p>
                <Tooltip
                  contentClasses="bg-transparent p-0 border-0 w-max max-w-2xl z-30"
                  renderButton={<IoInformationCircleOutline className="size-5 text-warning" />}
                  renderContent={
                    <div
                      className="p-0.5"
                      style={{
                        background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
                        borderRadius: 12,
                        boxShadow: "0px 4px 12px 0px #0000001F",
                      }}
                    >
                      <div style={{ borderRadius: 10 }} className="bg-white">
                        <VoltDescription />
                      </div>
                    </div>
                  }
                />
              </div>
              <div className="p-3 flex">
                <Tooltip
                  renderButton={
                    <Switch
                      checked={isNonValidMedianHighlighted}
                      onCheckedChange={() => setNonValidMedianHighlighted(!isNonValidMedianHighlighted)}
                      className="[&:has([data-state=checked])]:bg-warning"
                      disabled={data.assessments.data.length < 3}
                    />
                  }
                  renderContent={data.assessments.data.length < 3 ? "VOLT works only for more than 2 properties." : ""}
                />
              </div>
            </div>
          </div>
          {!isSubscribed && (
            <Link
              className="bg-white shadow-5 w-full text-center block absolute rounded-lg p-3 translate-y-2 font-medium underline text-primary-main"
              href={routes.user.subscription.fullUrl}
            >
              Subscribe to see prices
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            <div className="bg-white w-fit mx-2 fle items-center px-6 py-8 rounded-2xl shadow-4 flex gap-4 mt-4">
              <div className="size-16 bg-error-100 flex items-center justify-center rounded-full">
                <BiSearch className="size-10 text-[#F44D61]" />
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <h1 className="font-semibold">No result found</h1>
                  <h1 className="text-grey-800 text-sm max-w-96">
                    We couldn’t find any property under selected filters. You can extend the filters and try again.
                  </h1>
                </div>
                <IoMdClose onClick={() => setWarning(false)} className="size-5 cursor-pointer" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoltDetailsDesktopHeader;
