"use client";

import React, { Dispatch, FC, TransitionStartFunction, useCallback, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import { LoadingIcon2 } from "@/components/@new/icons/LoadingIcons";
import { SetStateAction } from "jotai";
import VoltDetailsDesktopFilters from "./desktop";
import VoltMobileFilters from "../mobile/volt-mobile-filters";

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
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(1440);

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
      {!detecting && (
        <div>
          {!isSmallDevice && (
            <VoltDetailsDesktopFilters
              onSubmit={updateQueryParams}
              filters={filters}
              setFilters={setFilters}
              propertyTypes={propertyTypes}
            />
          )}
          {isSmallDevice && (
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
        </div>
      )}
    </>
  );
};

export default VoltDetailsFiltersWrapper;
