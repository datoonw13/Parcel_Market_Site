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
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  startFetchingTransition: TransitionStartFunction;
  onFilterToggle?: (value: boolean) => void;
  propertyTypes: { [key: string]: string };
}

const VoltDetailsFiltersWrapper: FC<VoltDetailsFiltersWrapperProps> = ({
  searchParams,
  initialFilters,
  startFetchingTransition,
  onFilterToggle,
  propertyTypes,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(1440);
  const partialFiltersSchema = voltDetailsFiltersValidations.partial();
  const validateFilters = partialFiltersSchema.safeParse(searchParams);

  const [filters, setFilters] = useState<IFilters>({
    ...initialFilters,
    ...(validateFilters.data && { ...validateFilters.data }),
  });

  useEffect(() => {
    if (validateFilters.error) {
      router.push(pathname);
    }
  }, [pathname, router, validateFilters]);

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

  const resetFilters = useCallback(() => {
    setFilters({
      ...initialFilters,
      ...(validateFilters.data && { ...validateFilters.data }),
    });
  }, [initialFilters, validateFilters.data]);

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
        {isSmallDevice && (
          <VoltDetailsMobileFilters
            propertyTypes={propertyTypes}
            resetFilters={resetFilters}
            onSubmit={updateQueryParams}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </div>
    )
  );
};

export default VoltDetailsFiltersWrapper;
