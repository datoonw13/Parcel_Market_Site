"use client";

import { AutoComplete } from "@/components/ui/autocomplete";
import { getAllStates, getCounties, getStateValue } from "@/helpers/states";
import { parseSearchParams } from "@/lib/utils";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { z } from "zod";

type a = {
  x: number;
};

const RecentSearchesDesktopFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedState = "";
  const states = useMemo(() => getAllStates({ filterBlackList: true }).map(({ counties, ...rest }) => rest), []);
  const counties = useMemo(() => getCounties(selectedState), [selectedState]);
  const filters = parseSearchParams(userRecentSearchesValidations, searchParams);

  const changeFilter = <T extends keyof z.infer<typeof userRecentSearchesValidations>>(
    key: T,
    value?: z.infer<typeof userRecentSearchesValidations>[T] | null,
    resetKey?: T
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }

    if (resetKey) {
      params.delete(resetKey);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="hidden md:grid grid-cols-[1fr_1fr_1.2fr_1.2fr] items-center gap-3">
      <AutoComplete
        selectedValue={filters?.state || null}
        options={states}
        placeholder="State"
        inputRootClassName="h-9 rounded-2xl"
        onValueChange={(value) => {
          changeFilter("state", value, "county");
          //   setValue("state", value || "", { shouldValidate: isSubmitted });
          //   setValue("county", "", { shouldValidate: isSubmitted });
        }}
        // disabled={disableSearch}
        // error={!!errors.state}
      />
      <AutoComplete
        selectedValue={filters?.state || null}
        options={states}
        placeholder="State"
        inputRootClassName="h-9 rounded-2xl"
        onValueChange={(value) => {
          changeFilter("state", value, "county");
          //   setValue("state", value || "", { shouldValidate: isSubmitted });
          //   setValue("county", "", { shouldValidate: isSubmitted });
        }}
        // disabled={disableSearch}
        // error={!!errors.state}
      />
      <AutoComplete
        selectedValue={filters?.state || null}
        options={states}
        placeholder="State"
        inputRootClassName="h-9 rounded-2xl"
        onValueChange={(value) => {
          changeFilter("state", value, "county");
          //   setValue("state", value || "", { shouldValidate: isSubmitted });
          //   setValue("county", "", { shouldValidate: isSubmitted });
        }}
        // disabled={disableSearch}
        // error={!!errors.state}
      />
      <AutoComplete
        selectedValue={filters?.state || null}
        options={states}
        placeholder="State"
        inputRootClassName="h-9 rounded-2xl"
        onValueChange={(value) => {
          changeFilter("state", value, "county");
          //   setValue("state", value || "", { shouldValidate: isSubmitted });
          //   setValue("county", "", { shouldValidate: isSubmitted });
        }}
        // disabled={disableSearch}
        // error={!!errors.state}
      />
    </div>
  );
};

export default RecentSearchesDesktopFilters;
