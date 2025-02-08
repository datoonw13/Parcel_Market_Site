"use client";

import React, { FC, TransitionStartFunction, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";
import VoltDetailsDesktopFilters from "./desktop";
import VoltDetailsMobileFilters from "./mobile";
import { breakPoints } from "../../../../tailwind.config";

type IFilters = z.infer<typeof voltDetailsFiltersValidations>;

interface VoltDetailsFiltersWrapperProps {
  startFetchingTransition: TransitionStartFunction;
  onFilterToggle?: (value: boolean) => void;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
}

const VoltDetailsFiltersWrapper: FC<VoltDetailsFiltersWrapperProps> = ({ startFetchingTransition, onFilterToggle, propertyTypes }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(1440);
  const validatedFilters = voltDetailsFiltersValidations.safeParse(Object.fromEntries(params));

  const [filters, setFilters] = useState<IFilters>({ ...validatedFilters.data! });

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
    !detecting && (
      <div>
        {!isSmallDevice && (
          <VoltDetailsDesktopFilters
            onFilterToggle={onFilterToggle}
            onSubmit={updateQueryParams}
            filters={filters}
            setFilters={setFilters}
            propertyTypes={propertyTypes}
          />
        )}
        {/* {isSmallDevice && (
          <VoltDetailsMobileFilters
            propertyTypes={propertyTypes}
            resetFilters={resetFilters}
            onSubmit={updateQueryParams}
            filters={filters}
            setFilters={setFilters}
          />
        )} */}
      </div>
    )
  );
};

export default VoltDetailsFiltersWrapper;
