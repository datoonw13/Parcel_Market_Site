"use client";

import React, { Dispatch, FC, TransitionStartFunction, useCallback } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import { SetStateAction } from "jotai";
import VoltDetailsDesktopFilters from "./desktop";
import VoltMobileFilters from "../mobile/volt-mobile-filters";
import VoltDetailsTabletFilters from "./tablet";

interface VoltDetailsFiltersWrapperProps {
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  filters: z.infer<typeof voltDetailsFiltersValidations>;
  setFilters: Dispatch<SetStateAction<z.infer<typeof voltDetailsFiltersValidations>>>;
  startFetchingTransition: TransitionStartFunction;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
}

const VoltDetailsFiltersWrapper: FC<VoltDetailsFiltersWrapperProps> = ({
  propertyTypes,
  filters,
  setFilters,
  startFetchingTransition,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { detecting: detectingSm, targetReached: isSm } = useMediaQuery(1024);
  const { detecting: detectingMd, targetReached: isMd } = useMediaQuery(1440);

  const updateQueryParams = useCallback(() => {
    const newQueryParams = new URLSearchParams(params.toString());

    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters]) {
        newQueryParams.set(key, filters[key as keyof typeof filters]!.toString());
      } else {
        newQueryParams.delete(key);
      }
      startFetchingTransition(() => {
        router.push(`${pathname}?${newQueryParams.toString()}`);
      });
    });
  }, [filters, params, pathname, router, startFetchingTransition]);

  return (
    <>
      {!detectingSm && !detectingMd && (
        <div>
          {!isSm && !isMd && (
            <VoltDetailsDesktopFilters
              onSubmit={updateQueryParams}
              filters={filters}
              setFilters={setFilters}
              propertyTypes={propertyTypes}
            />
          )}
          {isSm && (
            <VoltMobileFilters
              mapLayers={mapLayers}
              onSubmit={updateQueryParams}
              filters={filters}
              setFilters={setFilters}
              propertyTypes={propertyTypes}
              setSelectedLayer={setSelectedLayer}
              selectedLayer={selectedLayer}
            />
          )}
          {isMd && !isSm && (
            <VoltDetailsTabletFilters
              onSubmit={updateQueryParams}
              filters={filters}
              setFilters={setFilters}
              propertyTypes={propertyTypes}
              resetFilters={() => {}}
            />
          )}
        </div>
      )}
    </>
  );
};

export default VoltDetailsFiltersWrapper;
