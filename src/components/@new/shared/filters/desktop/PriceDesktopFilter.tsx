"use client";

import { ILandsMarketplaceFilters } from "@/types/lands";
import { numFormatter } from "@/helpers/common";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MinMaxFilters from "./MinMaxFilters";

export const getPriceLabel = (priceMin: ILandsMarketplaceFilters["priceMin"], priceMax: ILandsMarketplaceFilters["priceMax"]) => {
  if (!priceMin && !priceMax) {
    return "";
  }

  if (typeof priceMax === "number" && (typeof priceMin !== "number" || priceMin === 0)) {
    return `N/A - ${numFormatter.format(priceMax)}`;
  }
  if ((typeof priceMax !== "number" || priceMax === 0) && typeof priceMin === "number") {
    return `${numFormatter.format(priceMin)} +`;
  }
  if (typeof priceMax === "number" && typeof priceMin === "number") {
    return `${numFormatter.format(priceMin)} - ${numFormatter.format(priceMax)}`;
  }
  return "";
};

export const priceFilters = [
  {
    min: 0,
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
];

const PriceDesktopFilter = ({
  filterKey,
  placeholder,
  options,
}: {
  filterKey: string;
  placeholder: string;
  options?: typeof priceFilters;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const selectedValue = { min: Number(params.get(`${filterKey}Min`)) || null, max: Number(params.get(`${filterKey}Max`)) || null };

  const handleSelect = (newValue: { min: number | null; max: number | null }) => {
    if (newValue?.min) {
      params.set(`${filterKey}Min`, newValue.min.toString());
    } else {
      params.delete(`${filterKey}Min`);
    }
    if (newValue?.max) {
      params.set(`${filterKey}Max`, newValue.max.toString());
    } else {
      params.delete(`${filterKey}Max`);
    }
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <MinMaxFilters
      options={options || priceFilters}
      value={selectedValue}
      onChange={handleSelect}
      placeHolder={placeholder}
      getOptionLabel={(item) => getPriceLabel(Number(item.min), Number(item.max))}
    />
  );
};

export default PriceDesktopFilter;
