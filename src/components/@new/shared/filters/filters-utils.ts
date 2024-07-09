import { numFormatter } from "@/helpers/common";

export const getMinMaxFilterLabel = (priceMin: number | null, priceMax: number | null) => {
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
];
