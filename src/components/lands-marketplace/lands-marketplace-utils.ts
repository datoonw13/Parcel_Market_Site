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
export const getAcreageLabel = (acreageMin: ILandsMarketplaceFilters["acreageMin"], acreageMax: ILandsMarketplaceFilters["acreageMax"]) => {
  if (!acreageMin && !acreageMax) {
    return "qwd";
  }

  if (acreageMax && !acreageMin) {
    return `N/A - ${acreageMax} Acres`;
  }
  if (!acreageMax && acreageMin) {
    return `${acreageMin - 1}+ Acres`;
  }
  if (acreageMax && acreageMin) {
    return `${acreageMin} - ${acreageMax} Acres`;
  }
  return "";
};

export const getPriceLabel = (priceMin: ILandsMarketplaceFilters["priceMin"], priceMax: ILandsMarketplaceFilters["priceMax"]) => {
  if (!priceMin && !priceMax) {
    return "";
  }

  if (typeof priceMax === "number" && typeof priceMin !== "number") {
    return `N/A - ${numFormatter.format(priceMax)}`;
  }
  if (typeof priceMax !== "number" && typeof priceMin === "number") {
    return `${numFormatter.format(priceMin)} +`;
  }
  if (typeof priceMax === "number" && typeof priceMin === "number") {
    return `${numFormatter.format(priceMin)} - ${numFormatter.format(priceMax)}`;
  }
  return "";
};
