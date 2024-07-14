"use client";

import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FilterIcon1 } from "@/components/@new/icons/FilterIcons";
import clsx from "clsx";
import { ArrowIconDown1, ArrowIconUp1 } from "@/components/@new/icons/ArrowIcons";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCounties } from "@/helpers/states";
import Button from "../../forms/Button";
import Divider from "../../Divider";
import TextField from "../../forms/TextField";
import RadioButton from "../../forms/RadioButton";

const Drawer = dynamic(() => import("@/components/@new/shared/modals/Drawer"), { ssr: false });

interface RenderMinMaxFilterProps {
  options: Array<MinMaxFilterType>;
  filterKey: string;
  localFilters: { [key: string]: string | number | null } | null;
  setLocalFilters: Dispatch<SetStateAction<{ [key: string]: string | number | null } | null>>;
  renderLabel: (priceMin: MinMaxFilterType["min"], priceMax: MinMaxFilterType["max"]) => string;
}
const RenderMinMaxFilter: FC<RenderMinMaxFilterProps> = ({ options, filterKey, localFilters, setLocalFilters, renderLabel }) => {
  const handleMinValueChange = (value: string) => {
    setLocalFilters({ ...localFilters, [`${filterKey}Min`]: value || null });
  };

  const handleMaxValueChange = (value: string) => {
    setLocalFilters({ ...localFilters, [`${filterKey}Max`]: value || null });
  };

  const isError = !!(
    localFilters?.[`${filterKey}Min`] &&
    localFilters?.[`${filterKey}Max`] &&
    Number(localFilters?.[`${filterKey}Min`]) >= Number(localFilters?.[`${filterKey}Max`])
  );

  return (
    <>
      <div className="flex gap-2 items-center">
        <TextField
          onChange={(newVal) => {
            handleMinValueChange(newVal);
          }}
          placeholder="Min"
          type="number"
          className="!h-[38px]"
          value={localFilters?.[`${filterKey}Min`]?.toString() || ""}
          error={isError}
        />
        <hr className="w-7 border-grey-100" />
        <TextField
          onChange={(newVal) => {
            handleMaxValueChange(newVal);
          }}
          placeholder="Max"
          type="number"
          className="!h-[38px]"
          value={localFilters?.[`${filterKey}Max`]?.toString() || ""}
          error={isError}
        />
      </div>
      {options.map((option) => (
        <RadioButton
          key={option.min}
          checked={
            (Number(localFilters?.[`${filterKey}Min`]) || null) === option.min &&
            (Number(localFilters?.[`${filterKey}Max`]) || null) === option.max
          }
          name={`acreage-${option.min}`}
          label={renderLabel(option.min, option.max)}
          onChange={() =>
            setLocalFilters({
              ...localFilters,
              [`${filterKey}Min`]: option.min,
              [`${filterKey}Max`]: option.max,
            })
          }
        />
      ))}
    </>
  );
};

type MinMaxFilterType = { min: number | null; max: number | null };
type DefaultFilterType = { label: string; value: string };

interface FiltersDrawerProps {
  data: {
    [key: string]: {
      type: "default" | "minmax";
      label: string;
      options: Array<DefaultFilterType | MinMaxFilterType>;
      renderLabel?: (priceMin: MinMaxFilterType["min"], priceMax: MinMaxFilterType["max"]) => string;
    };
  };
}

const FiltersDrawer: FC<FiltersDrawerProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const [localFilters, setLocalFilters] = useState<{ [key: string]: string | number | null } | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isFilterOpen = (filterKey: string) => filterKey === openFilter;

  const toggleFilter = (filterKey: string) => setOpenFilter(filterKey === openFilter ? null : filterKey);

  const isError = Object.keys(data).some(
    (key) =>
      data[key].type === "minmax" &&
      localFilters?.[`${key}Min`] &&
      localFilters?.[`${key}Max`] &&
      Number(localFilters[`${key}Min`]!) >= Number(localFilters[`${key}Max`]!)
  );

  const setInitialLocalFilters = useCallback(() => {
    const filters: { [key: string]: string } = {};
    Object.keys(data).forEach((key) => {
      if (data[key].type === "default" && params.get(key)) {
        filters[key] = params.get(key)!;
      } else {
        if (params.get(`${key}Min`)) {
          filters[`${key}Min`] = params.get(`${key}Min`)!;
        }
        if (params.get(`${key}Max`)) {
          filters[`${key}Max`] = params.get(`${key}Max`)!;
        }
      }
    });

    if (JSON.stringify(filters) !== JSON.stringify(localFilters)) {
      setLocalFilters(filters);
    }
  }, [data, localFilters, params]);

  const handleChange = () => {
    setOpen(false);
    if (localFilters) {
      Object.keys(localFilters).forEach((key) => {
        if (localFilters[key]) {
          params.set(key, localFilters[key]!.toString());
        } else {
          params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };

  useEffect(() => {
    if (open && !localFilters) {
      setInitialLocalFilters();
    }
    if (!open) {
      setLocalFilters(null);
      setOpenFilter(null);
    }
  }, [localFilters, open, setInitialLocalFilters]);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="!py-2 !px-4 !rounded-3xl">
        <div className="flex items-center gap-2 font-medium text-xs ">
          Filter <FilterIcon1 className="!w-3.5 !h-2.5" />
        </div>
      </Button>
      <Drawer
        closeDrawer={() => {
          setOpen(false);
        }}
        open={open}
        title="Filter"
      >
        <div className="overflow-scroll px-5 h-[55vh]">
          {Object.keys(data).map((filterKey) => (
            <div key={filterKey}>
              <div
                className={clsx(
                  "flex justify-between items-center py-3 sticky top-0 bg-white",
                  !isFilterOpen(filterKey) && "border-b border-grey-100",
                  filterKey === "county" && !localFilters?.state && "pointer-events-none opacity-50"
                )}
                onClick={() => toggleFilter(filterKey)}
              >
                <p>{data[filterKey].label}</p>
                {isFilterOpen(filterKey) ? <ArrowIconUp1 strokeWidth={3} /> : <ArrowIconDown1 strokeWidth={3} />}
              </div>
              {isFilterOpen(filterKey) && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  variants={{
                    open: { opacity: 1 },
                    collapsed: { opacity: 0 },
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="border-b border-grey-100 pb-3 flex flex-col gap-4 mt-1">
                    {data[filterKey].type === "minmax" && (
                      <RenderMinMaxFilter
                        filterKey={filterKey}
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                        renderLabel={data[filterKey].renderLabel!}
                        options={data[filterKey].options as MinMaxFilterType[]}
                      />
                    )}
                    {data[filterKey].type === "default" && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        variants={{
                          open: { opacity: 1 },
                          collapsed: { opacity: 0 },
                        }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="pb-3 flex flex-col gap-4 mt-1">
                          {[filterKey === "county" ? getCounties(localFilters?.state?.toString() ?? "") : data[filterKey].options]
                            .flat()
                            .map((option) => (
                              <RadioButton
                                key={(option as DefaultFilterType).value}
                                checked={localFilters?.[filterKey] === (option as DefaultFilterType).value}
                                name={(option as DefaultFilterType).value}
                                label={(option as DefaultFilterType).label}
                                onChange={() => {
                                  const newFilters = {
                                    ...localFilters,
                                    [filterKey]: (option as DefaultFilterType).value,
                                    ...(filterKey === "state" && { county: null }),
                                  };
                                  setLocalFilters({ ...newFilters });
                                }}
                              />
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <Divider className="mt-2" />
        <div className="flex flex-col gap-3 p-4">
          <Button disabled={isError} onClick={handleChange}>
            Apply
          </Button>
          <Button
            className="!outline-none"
            variant="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Reset
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default FiltersDrawer;
