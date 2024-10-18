"use client";

import { AutoComplete } from "@/components/ui/autocomplete";
import AutoCompleteMulti from "@/components/ui/autocomplete-multi";
import MinmaxDropdown from "@/components/ui/minmax-dropdown";
import { getAllStates, getCounties, getStateValue } from "@/helpers/states";
import { updateSearchParamsWithFilters, parseSearchParams } from "@/lib/utils";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { uniqBy } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { z } from "zod";

const RecentSearchesDesktopFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseSearchParams(userRecentSearchesValidations, searchParams), [searchParams]);
  const states = useMemo(() => getAllStates({ filterBlackList: true }).map(({ counties, ...rest }) => rest), []);
  const counties = useMemo(() => {
    const countiesList =
      filters?.states
        ?.split(",")
        .map((state) => getCounties(state).map((x) => ({ ...x, label: `${x.label}(${state.toLocaleUpperCase()})` }))) || [];
    return uniqBy(countiesList.flat(), "value");
  }, [filters?.states]);

  const changeFilter = <T extends keyof z.infer<typeof userRecentSearchesValidations>>(
    data: Array<{
      key: T;
      value?: z.infer<typeof userRecentSearchesValidations>[T] | null;
      resetKey?: T;
    }>
  ) => {
    const resetPage = { key: "page" as const, value: 1 };
    const newSearchParams = updateSearchParamsWithFilters<z.infer<typeof userRecentSearchesValidations>>(
      [...data, resetPage],
      searchParams.toString()
    );
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    filters && (
      <div className="hidden lg:grid grid-cols-[1fr_1fr_1.1fr_1.1fr] items-center gap-3">
        <AutoCompleteMulti
          clearable
          selectedValues={filters.states?.split(",") || []}
          options={states}
          placeholder="State"
          inputRootClassName="h-9 rounded-2xl"
          onValueChange={(value) => {
            changeFilter([
              {
                key: "states",
                value: value.join(","),
                resetKey: "counties",
              },
            ]);
          }}
        />
        <AutoCompleteMulti
          clearable
          selectedValues={filters.counties?.split(",") || []}
          options={counties}
          placeholder="County"
          inputRootClassName="h-9 rounded-2xl"
          disabled={!filters?.states}
          onValueChange={(value) => {
            changeFilter([
              {
                key: "counties",
                value: value.join(","),
              },
            ]);
          }}
        />
        <MinmaxDropdown
          placeholder="Acreage"
          selectedValue={{
            min: filters.acreageMin === null ? null : filters.acreageMin,
            max: filters.acreageMax === null ? null : filters.acreageMax,
          }}
          renderOption={(value) => {
            if (value?.min && !value?.max) {
              return `${value.min - 1}+ Acres`;
            }
            if (!value?.min && value?.max) {
              return `${value.max - 1}+ Acres`;
            }
            return "";
          }}
          renderInputValue={(value) => {
            if (value?.min && value?.max) {
              return `${value.min - 1} - ${value.max} Acres`;
            }
            if (value?.min && !value?.max) {
              return `${value.min - 1}+ Acres`;
            }
            if (!value?.min && value?.max) {
              return `${value.max - 1}+ Acres`;
            }
            return "";
          }}
          onChange={(value) => {
            changeFilter([
              {
                key: "acreageMin",
                value: value.min,
              },
              {
                key: "acreageMax",
                value: value.max,
              },
            ]);
          }}
          data={[
            {
              min: 1,
              max: null,
            },
            {
              min: 6,
              max: null,
            },
            {
              min: 11,
              max: null,
            },
            {
              min: 21,
              max: null,
            },
            {
              min: 51,
              max: null,
            },
          ]}
        />
        <MinmaxDropdown
          inputPrefix="$"
          placeholder="VOLT Price"
          selectedValue={{
            min: filters.voltPriceMin === null ? null : filters.voltPriceMin,
            max: filters.voltPriceMax === null ? null : filters.voltPriceMax,
          }}
          renderInputValue={(value) => {
            if (value?.min && value?.max) {
              return `$${value.min} - $${value.max}`;
            }
            if (value?.min && !value?.max) {
              return `$${value.min} - N/A`;
            }
            if (!value?.min && value?.max) {
              return `$0 - $${value.max}`;
            }
            return "";
          }}
          renderOption={(value) => {
            if (value?.min && value?.max) {
              return `$${value.min} - ${value.max}`;
            }
            if (value?.min && !value?.max) {
              return `$${value.min} - N/A`;
            }
            if (!value?.min && value?.max) {
              return `$0 - $${value.max}`;
            }
            return "";
          }}
          onChange={(value) => {
            changeFilter([
              {
                key: "voltPriceMin",
                value: value.min,
              },
              {
                key: "voltPriceMax",
                value: value.max,
              },
            ]);
          }}
          data={[
            {
              min: null,
              max: 50000,
            },
            {
              min: 50000,
              max: 100000,
            },
            {
              min: 100000,
              max: 200000,
            },
            {
              min: 200000,
              max: 500000,
            },
            {
              min: 500000,
              max: null,
            },
          ]}
        />
      </div>
    )
  );
};

export default RecentSearchesDesktopFilters;
