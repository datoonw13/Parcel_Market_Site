"use client";

import { FC, useState, useTransition } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import VoltDetails from "./details";
import VoltDetailsHeaderLogo from "./logo";
import VoltDetailsHeader from "./header";
import { LoadingIcon1 } from "../@new/icons/LoadingIcons";

interface VoltDetailsLayoutProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  loading?: boolean;
  data: z.infer<typeof PropertyDataSchema>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
}

const VoltDetailsLayout: FC<VoltDetailsLayoutProps> = ({ initialFilters, searchParams, loading, data, propertyTypes }) => {
  const [isFetching, startFetchingTransition] = useTransition();
  const [isNonValidMedianHighlighted, setNonValidMedianHighlighted] = useState(false);

  return (
    <>
      {isFetching && (
        <div className="fixed w-full h-full top-0 left-0 bg-black-100 z-50 flex items-center justify-center">
          <LoadingIcon1 className="!w-8 !h-8 text-primary-main" />
        </div>
      )}
      <VoltDetailsHeader
        data={data}
        initialFilters={initialFilters}
        searchParams={searchParams}
        startFetchingTransition={startFetchingTransition}
        isNonValidMedianHighlighted={isNonValidMedianHighlighted}
        setNonValidMedianHighlighted={setNonValidMedianHighlighted}
        propertyTypes={propertyTypes}
      />
      <div id="details" className={cn("w-full h-full overflow-hidden relative")}>
        <VoltDetails data={data} isNonValidMedianHighlighted={isNonValidMedianHighlighted} />;
      </div>
    </>
  );
};

export default VoltDetailsLayout;
