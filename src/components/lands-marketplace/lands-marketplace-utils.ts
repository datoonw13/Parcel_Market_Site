import { numFormatter } from "@/helpers/common";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";

export const acreagesFilters = [
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
export const getAcreageLabel = (value: ILandsMarketplaceFilters["acreage"]) => {
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

export const getPriceLabel = (value: ILandsMarketplaceFilters["acreage"]) => {
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
