"use client";

import React, { Dispatch, FC, TransitionStartFunction, useCallback, useMemo } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import { SetStateAction } from "jotai";
import { UseFormReset, UseFormSetValue } from "react-hook-form";
import VoltDetailsDesktopFilters from "./desktop";
import VoltMobileFilters from "./mobile";
import VoltDetailsTabletFilters from "./tablet";

interface VoltDetailsFiltersWrapperProps {
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  filters: {
    values: z.infer<typeof voltDetailsFiltersValidations>;
    setValue: UseFormSetValue<z.infer<typeof voltDetailsFiltersValidations>>;
    reset: UseFormReset<z.infer<typeof voltDetailsFiltersValidations>>;
    isDirty: boolean;
  };
  startFetchingTransition: TransitionStartFunction;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
  isDataEmpty: boolean;
}

const VoltDetailsFiltersWrapper: FC<VoltDetailsFiltersWrapperProps> = ({
  propertyTypes,
  filters,
  startFetchingTransition,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
  isDataEmpty,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { detecting: detectingSm, targetReached: isSm } = useMediaQuery(1024);
  const { detecting: detectingMd, targetReached: isMd } = useMediaQuery(1500);

  const selectedFilters = useMemo(() => {
    if (!filters) {
      return 0;
    }
    const cnt =
      Object.keys(filters)
        .filter((el) => (el as keyof typeof filters.values) !== "propertyTypes" || filters[el as keyof typeof filters])
        .reduce((acc) => acc + 1, 0) + 1;

    return cnt;
  }, [filters]);

  const updateQueryParams = useCallback(() => {
    const newQueryParams = new URLSearchParams(params.toString());

    Object.keys(filters.values).forEach((key) => {
      if (filters.values[key as keyof typeof filters.values]) {
        newQueryParams.set(key, filters.values[key as keyof typeof filters.values]!.toString());
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
          {!isSm && !isMd && <VoltDetailsDesktopFilters onSubmit={updateQueryParams} filters={filters} propertyTypes={propertyTypes} />}
          {isSm && (
            <VoltMobileFilters
              mapLayers={mapLayers}
              onSubmit={updateQueryParams}
              filters={filters}
              propertyTypes={propertyTypes}
              setSelectedLayer={setSelectedLayer}
              selectedLayer={selectedLayer}
              isDataEmpty={isDataEmpty}
            />
          )}
          {isMd && !isSm && (
            <VoltDetailsTabletFilters
              onSubmit={updateQueryParams}
              filters={filters}
              propertyTypes={propertyTypes}
              resetFilters={() => {}}
              selectedFilters={selectedFilters}
            />
          )}
        </div>
      )}
    </>
  );
};

export default VoltDetailsFiltersWrapper;
