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

interface VoltDetailsLayoutProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  loading?: boolean;
  data: z.infer<typeof PropertyDataSchema>;
}

const VoltDetailsLayout: FC<VoltDetailsLayoutProps> = ({ initialFilters, searchParams, loading, data }) => {
  const [isFetching, startFetchingTransition] = useTransition();
  const [backDrop, setBackDrop] = useState(false);
  const [isNonValidMedianHighlighted, setNonValidMedianHighlighted] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <VoltDetailsHeaderLogo />
      <VoltDetailsHeader
        data={data}
        initialFilters={initialFilters}
        searchParams={searchParams}
        startFetchingTransition={startFetchingTransition}
        setBackDrop={setBackDrop}
        isNonValidMedianHighlighted={isNonValidMedianHighlighted}
        setNonValidMedianHighlighted={setNonValidMedianHighlighted}
      />
      <div className={cn("w-full h-full overflow-hidden relative")}>
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
        <VoltDetails data={data} isNonValidMedianHighlighted={isNonValidMedianHighlighted} />;
      </div>
    </div>
  );
};

export default VoltDetailsLayout;
