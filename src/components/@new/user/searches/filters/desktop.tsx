"use client";

import { AutoComplete } from "@/components/ui/autocomplete";
import AutoCompleteMulti from "@/components/ui/autocomplete-multi";
import MinmaxDropdown from "@/components/ui/minmax-dropdown";
import { getCountiesByState } from "@/helpers/states";
import useStates from "@/hooks/useStates";
import { updateSearchParamsWithFilters, parseSearchParams } from "@/lib/utils";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import { uniqBy } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TransitionStartFunction, useMemo } from "react";
import { z } from "zod";

const SearchesDesktopFilters = ({ startTransition }: { startTransition: TransitionStartFunction }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseSearchParams(userSearchesValidations, searchParams), [searchParams]);
  const { states } = useStates({ hideBlackListedStated: true });

  const countiesList = useMemo(() => {
    const countiesList =
      filters?.states
        ?.split(",")
        .map((state) => getCountiesByState(state || "")?.map((x) => ({ ...x, label: `${x.label}(${state.toLocaleUpperCase()})` })) || []) ||
      [];
    return uniqBy(countiesList.flat(), "value");
  }, [filters?.states]);

  const changeFilter = <T extends keyof z.infer<typeof userSearchesValidations>>(
    data: Array<{
      key: T;
      value?: z.infer<typeof userSearchesValidations>[T] | null;
      resetKey?: T;
    }>
  ) => {
    const resetPage = { key: "page" as const, value: 1 };
    const newSearchParams = updateSearchParamsWithFilters<z.infer<typeof userSearchesValidations>>(
      [...data, resetPage],
      searchParams.toString()
    );
    newSearchParams.delete("viewId");
    startTransition(() => {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
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
          options={countiesList}
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
          placeholder="VOLT Value"
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

export default SearchesDesktopFilters;
