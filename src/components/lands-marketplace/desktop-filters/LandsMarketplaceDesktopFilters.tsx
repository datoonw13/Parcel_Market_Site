import { numFormatter } from "@/helpers/common";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { getAllStates, getCounties } from "@/helpers/states";
import LandsMarketplaceFiltersAutocomplete from "./LandsMarketplaceFiltersAutocomplete";
import LandsMarketplaceFiltersMinMaxAutocomplete from "./LandsMarketplaceFiltersMinMaxAutocomplete";

const acreagesFilters = [
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
];

const priceFilters = [
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

const getAcreageLabel = (value: ILandsMarketplaceFilters["acreage"]) => {
  if (!value) {
    return "";
  }

  if (value.max && !value.min) {
    return `N/A - ${value.max} Acres`;
  }
  if (!value.max && value.min) {
    return `${value.min - 1}+ Acres`;
  }
  if (value.max && value.min) {
    return `${value.min} - ${value.max} Acres`;
  }
  return "";
};

const getPriceLabel = (value: ILandsMarketplaceFilters["acreage"]) => {
  if (!value) {
    return "";
  }

  if (typeof value.max === "number" && typeof value.min !== "number") {
    return `N/A - ${numFormatter.format(value.max)}`;
  }
  if (typeof value.max !== "number" && typeof value.min === "number") {
    return `${numFormatter.format(value.min)} +`;
  }
  if (typeof value.max === "number" && typeof value.min === "number") {
    return `${numFormatter.format(value.min)} - ${numFormatter.format(value.max)}`;
  }
  return "";
};

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceDesktopFilters = ({ filters, setFilters }: IProps) => (
  <Box sx={{ display: "flex", gap: 1.5 }}>
    <LandsMarketplaceFiltersAutocomplete
      options={getAllStates().map(({ value, label }) => ({ value, label }))}
      onSelect={(state) => setFilters({ ...filters, state })}
      placeholder="State"
    />
    <LandsMarketplaceFiltersAutocomplete
      options={getCounties(filters.state).map(({ value, label }) => ({ value, label }))}
      onSelect={(county) => setFilters({ ...filters, county })}
      placeholder="County"
      disabled={!filters.state}
    />
    <LandsMarketplaceFiltersMinMaxAutocomplete
      options={acreagesFilters}
      onSelect={(acreage) => setFilters({ ...filters, acreage })}
      placeholder="Acreage"
      getLabel={getAcreageLabel}
    />
    <LandsMarketplaceFiltersMinMaxAutocomplete
      options={priceFilters}
      onSelect={(price) => setFilters({ ...filters, price })}
      placeholder="VOLT Price"
      getLabel={getPriceLabel}
    />
  </Box>
);

export default LandsMarketplaceDesktopFilters;
