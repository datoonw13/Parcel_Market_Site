"use client";

import { ArrowIconDown1, ArrowIconUp1, ArrowIconsUnion1 } from "@/components/@new/icons/ArrowIcons";
import { SortIcon1 } from "@/components/@new/icons/SortIcons";
import Drawer from "@/components/@new/shared/modals/Drawer";
import Button from "@/components/@new/shared/forms/Button";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import RadioButton from "@/components/@new/shared/forms/RadioButton/";
import { getAllStates, getCounties } from "@/helpers/states";
import { ILandsFilters, SortBy } from "@/types/lands";
import TextField from "@/components/@new/shared/forms/TextField";
import { RemoveIcon1 } from "@/components/@new/icons/RemoveIcons";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../lands-filters-utils";

interface LandsMobileFiltersProps {
  setFilters: Dispatch<SetStateAction<ILandsFilters>>;
  filters: ILandsFilters;
  select?: {
    startSelect: () => void;
    totalSelected: number;
    onRemove: () => void;
    selecting: boolean;
  };
  totalCount?: number;
}

const LandsMobileFilters: FC<LandsMobileFiltersProps> = ({ filters, setFilters, select, totalCount }) => {
  const [openFilters, setOpenFilters] = useState(false);
  const [openSortBy, setOpenSortBy] = useState(false);
  const [collapsedFilter, setCollapsedFilter] = useState<"state" | "county" | "acreage" | "voltPrice" | null>(null);
  const [localFilters, setLocalFilters] = useState<ILandsFilters>({ ...filters });

  const toggleFilter = (filter: typeof collapsedFilter) => setCollapsedFilter(collapsedFilter === filter ? null : filter);
  const isCollapsed = (filter: typeof collapsedFilter) => collapsedFilter === filter;

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div
          className="flex items-center gap-1 border border-grey-100 rounded-3xl h-9 px-4 cursor-pointer"
          onClick={() => setOpenFilters(true)}
        >
          <p className="text-xs font-medium">Filter</p> <SortIcon1 className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-4">
          {select && (
            <div className="flex items-center gap-3">
              <Button
                className={clsx(
                  "!rounded-3xl !h-[30px]  !text-black !text-xs !border-0 !shadow-none !px-3",
                  select?.selecting ? "!bg-grey-200" : "!bg-grey-50"
                )}
                onClick={select.startSelect}
              >
                {select.totalSelected > 0 ? `${select.totalSelected} Selected` : "Select"}
              </Button>
              {select.totalSelected > 0 && (
                <Button
                  onClick={select.onRemove}
                  variant="text"
                  className="w-8 h-8 rounded-full hover:bg-error-100 flex items-center justify-center group focus:bg-error"
                >
                  <RemoveIcon1 className="group-hover:fill-error group-focus:fill-white" />
                </Button>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpenSortBy(true)}>
            <p className="font-medium text-xs capitalize">Sort by</p>
            <ArrowIconsUnion1 className="h-2 w-2" />
          </div>
        </div>
      </div>
      <Drawer
        closeDrawer={() => {
          setOpenFilters(false);
          setCollapsedFilter(null);
        }}
        open={openFilters}
        title="Filter"
      >
        <div className="h-[60vh] overflow-scroll px-5">
          <div className="">
            <div
              className={clsx(
                "flex justify-between items-center py-3 sticky top-0 bg-white",
                !isCollapsed("state") && "border-b border-grey-100"
              )}
              onClick={() => toggleFilter("state")}
            >
              <p>State</p>
              {isCollapsed("state") ? <ArrowIconUp1 strokeWidth={3} /> : <ArrowIconDown1 strokeWidth={3} />}
            </div>
            {isCollapsed("state") && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                // exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="border-b border-grey-100 pb-3 flex flex-col gap-4 mt-1">
                  {getAllStates().map((state) => (
                    <RadioButton
                      key={state.value}
                      checked={localFilters.state === state.value}
                      name={state.value}
                      label={state.label}
                      onChange={() => setLocalFilters({ ...localFilters, state: state.value, county: null })}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="">
            <div
              className={clsx(
                "flex justify-between items-center py-3 sticky top-0 bg-white",
                !isCollapsed("county") && "border-b border-grey-100",
                !localFilters.state && "pointer-events-none opacity-35"
              )}
              onClick={() => toggleFilter("county")}
            >
              <p>County</p>
              {isCollapsed("county") ? <ArrowIconUp1 strokeWidth={3} /> : <ArrowIconDown1 strokeWidth={3} />}
            </div>
            {isCollapsed("county") && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                // exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="border-b border-grey-100 pb-3 flex flex-col gap-4 mt-1">
                  {getCounties(localFilters.state).map((county) => (
                    <RadioButton
                      key={county.value}
                      checked={localFilters.county === county.value}
                      name={county.value}
                      label={county.label}
                      onChange={() => setLocalFilters({ ...localFilters, county: county.value })}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="">
            <div
              className={clsx(
                "flex justify-between items-center py-3 sticky top-0 bg-white",
                !isCollapsed("acreage") && "border-b border-grey-100"
              )}
              onClick={() => toggleFilter("acreage")}
            >
              <p>Acreage</p>
              {isCollapsed("acreage") ? <ArrowIconUp1 strokeWidth={3} /> : <ArrowIconDown1 strokeWidth={3} />}
            </div>
            {isCollapsed("acreage") && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                // exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.1, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="border-b border-grey-100 pb-3 flex flex-col gap-4 mt-1">
                  <div className="flex gap-2 items-center">
                    <TextField
                      onChange={(newVal) => {
                        setLocalFilters({ ...localFilters, acreageMin: newVal });
                      }}
                      placeholder="Min"
                      type="number"
                      className="!h-[38px]"
                      value={localFilters.acreageMin ? localFilters.acreageMin.toString() : ""}
                    />
                    <hr className="w-7 border-grey-100" />
                    <TextField
                      onChange={(newVal) => {
                        setLocalFilters({ ...localFilters, acreageMax: newVal });
                      }}
                      placeholder="Max"
                      type="number"
                      className="!h-[38px]"
                      value={localFilters.acreageMax ? localFilters.acreageMax.toString() : ""}
                    />
                  </div>
                  {acreagesFilters.map((acreage) => (
                    <RadioButton
                      key={acreage.min}
                      checked={localFilters.acreageMin === acreage.min && localFilters.acreageMax === acreage.max}
                      name={`acreage-${acreage.min}`}
                      label={getAcreageLabel(acreage.min, acreage.max)}
                      onChange={() => setLocalFilters({ ...localFilters, acreageMin: acreage.min, acreageMax: acreage.max })}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          <div className="">
            <div
              className={clsx(
                "flex justify-between items-center py-3 sticky top-0 bg-white",
                !isCollapsed("voltPrice") && "border-b border-grey-100"
              )}
              onClick={() => toggleFilter("voltPrice")}
            >
              <p>VOLT Value</p>
              {isCollapsed("voltPrice") ? <ArrowIconUp1 strokeWidth={3} /> : <ArrowIconDown1 strokeWidth={3} />}
            </div>
            {isCollapsed("voltPrice") && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                // exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="border-b border-grey-100 pb-3 flex flex-col gap-4 mt-1">
                  <div className="flex gap-2 items-center">
                    <TextField
                      onChange={(priceMin) => {
                        setLocalFilters({ ...localFilters, priceMin });
                      }}
                      placeholder="Min"
                      type="number"
                      className="!h-[38px]"
                      value={localFilters.priceMin ? localFilters.priceMin.toString() : ""}
                    />
                    <hr className="w-7 border-grey-100" />
                    <TextField
                      onChange={(priceMax) => {
                        setLocalFilters({ ...localFilters, priceMax });
                      }}
                      placeholder="Max"
                      type="number"
                      className="!h-[38px]"
                      value={localFilters.priceMax ? localFilters.priceMax.toString() : ""}
                    />
                  </div>
                  {priceFilters.map((price) => (
                    <RadioButton
                      key={price.min}
                      checked={localFilters.priceMin === price.min && localFilters.acreageMax === price.max}
                      name={`acreage-${price.min}`}
                      label={getPriceLabel(price.min, price.max)}
                      onChange={() => setLocalFilters({ ...localFilters, priceMin: price.min, acreageMax: price.max })}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 shadow-3 p-4 bg-white border-t border-grey-100">
          <Button
            className="justify-center"
            onClick={() => {
              setFilters({
                ...localFilters,
                acreageMin: localFilters.acreageMin ? parseFloat(localFilters.acreageMin.toString()) : null,
                acreageMax: localFilters.acreageMax ? parseFloat(localFilters.acreageMax.toString()) : null,
                priceMin: localFilters.priceMin ? parseFloat(localFilters.priceMin.toString()) : null,
                priceMax: localFilters.priceMax ? parseFloat(localFilters.priceMax.toString()) : null,
              });
              setLocalFilters({
                ...localFilters,
                acreageMin: localFilters.acreageMin ? parseFloat(localFilters.acreageMin.toString()) : null,
                acreageMax: localFilters.acreageMax ? parseFloat(localFilters.acreageMax.toString()) : null,
                priceMin: localFilters.priceMin ? parseFloat(localFilters.priceMin.toString()) : null,
                priceMax: localFilters.priceMax ? parseFloat(localFilters.priceMax.toString()) : null,
              });
              setOpenFilters(false);
              setCollapsedFilter(null);
            }}
          >
            Apply
          </Button>
          <Button
            className="justify-center h-12"
            variant="text"
            onClick={() => {
              setLocalFilters({ ...filters });
              setOpenFilters(false);
              setCollapsedFilter(null);
            }}
          >
            Reset
          </Button>
        </div>
      </Drawer>
      <Drawer
        closeDrawer={() => {
          setOpenSortBy(false);
        }}
        open={openSortBy}
        title="Sort By"
      >
        <div className="h-[60vh] overflow-scroll px-5">
          <div className="">
            <div className={clsx("flex flex-col py-4 gap-4")}>
              {Object.values(SortBy).map((sort) => (
                <RadioButton
                  key={sort}
                  checked={localFilters.sortBy === sort}
                  name={`sort-${sort}`}
                  label={sort}
                  onChange={() => setLocalFilters({ ...localFilters, sortBy: sort })}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 shadow-3 p-4 bg-white border-t border-grey-100">
          <Button
            className="justify-center"
            onClick={() => {
              setFilters({
                ...localFilters,
              });
              setOpenSortBy(false);
            }}
          >
            Apply
          </Button>
          <Button
            className="justify-center h-12"
            variant="text"
            onClick={() => {
              setLocalFilters({ ...filters });
              setOpenSortBy(false);
            }}
          >
            Reset
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default LandsMobileFilters;
