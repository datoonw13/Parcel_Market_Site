"use client";

import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { Dispatch, FC, SetStateAction } from "react";
import clsx from "clsx";
import Popper from "@/components/@new/shared/Popper";
import { ArrowIconsUnion1 } from "@/components/@new/icons/ArrowIcons";
import Button from "@/components/@new/shared/forms/Button";
import AutoCompleteListBox from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListBox";
import { ILandsFilters, SortBy } from "@/types/lands";
import AutoCompleteListItem from "@/components/@new/shared/forms/AutoComplete/AutoCompleteListItem";
import AutoComplete from "../../../shared/forms/AutoComplete";
import LandsDesktopFiltersMinMax from "./LandsDesktopFiltersMinMax";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../lands-filters-utils";

interface LandsDesktopFiltersProps {
  setFilters: Dispatch<SetStateAction<ILandsFilters>>;
  filters: ILandsFilters;
}

const LandsDesktopFilters: FC<LandsDesktopFiltersProps> = ({ filters, setFilters }) => (
  <div className="flex flex-col gap-7">
    <div className="grid gap-3 grid-cols-4">
      <AutoComplete
        inputRootClassName={clsx(
          "!h-[36px] [&>input::placeholder]:text-black",
          filters.state && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
        )}
        options={getAllStates()}
        getOptionLabel={(item) => item.label}
        getOptionKey={(item) => item.value}
        onChange={(item) => setFilters({ ...filters, state: item?.value || null, county: null })}
        placeholder="State"
        value={getStateValue(filters.state)}
        onFilter={(searchValue, items) => items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))}
      />
      <AutoComplete
        inputRootClassName={clsx(
          "!h-[36px] [&>input::placeholder]:text-black",
          filters.county && "[&>input]:bg-primary-main-100 [&>input]:!border-primary-main-400"
        )}
        options={getCounties(filters.state)}
        getOptionLabel={(item) => item.label}
        getOptionKey={(item) => item.value}
        onChange={(item) => setFilters({ ...filters, county: item?.value || null })}
        placeholder="County"
        value={getCountyValue(filters.county, filters.state)}
        disabled={!filters.state}
        onFilter={(searchValue, items) => items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))}
      />
      <LandsDesktopFiltersMinMax
        options={acreagesFilters}
        value={{ min: filters.acreageMin, max: filters.acreageMax }}
        onChange={(acreages) => setFilters({ ...filters, acreageMin: acreages.min, acreageMax: acreages.max })}
        placeHolder="Acreage"
        getOptionLabel={(item) => getAcreageLabel(Number(item.min), Number(item.max))}
      />
      <LandsDesktopFiltersMinMax
        options={priceFilters}
        value={{ min: filters.priceMin, max: filters.priceMax }}
        onChange={(volt) => setFilters({ ...filters, priceMin: volt.min, priceMax: volt.max })}
        placeHolder="VOLT Price"
        getOptionLabel={(item) => getPriceLabel(Number(item.min), Number(item.max))}
      />
    </div>
    <div className="flex items-center justify-between">
      <Button className="!rounded-3xl !h-[30px] !bg-grey-50 !text-black !text-xs !border-0 !shadow-none">Select</Button>
      <div className="flex items-center gap-4">
        <p className="text-medium text-xs text-grey-600">467,000 Lands</p>
        <Popper
          disableSameWidth
          renderButton={(setReferenceElement, referenceElement) => (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
            >
              <p className="font-medium text-xs capitalize">{filters.sortBy ? filters.sortBy : "Sort by"}</p>
              <ArrowIconsUnion1 className="h-2 w-2" />
            </div>
          )}
          renderContent={(setReferenceElement) => (
            <AutoCompleteListBox className="!w-32">
              {Object.values(SortBy).map((el) => (
                <AutoCompleteListItem
                  className="!w-full capitalize"
                  key={el}
                  id={el}
                  onClick={() => {
                    setFilters({ ...filters, sortBy: el });
                    setReferenceElement(null);
                  }}
                >
                  {el}
                </AutoCompleteListItem>
              ))}
            </AutoCompleteListBox>
          )}
        />
      </div>
    </div>
  </div>
);

export default LandsDesktopFilters;
