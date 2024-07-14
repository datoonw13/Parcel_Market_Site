import { ImarketlpaceFilters } from "@/types/lands";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { getAllStates, getCounties } from "@/helpers/states";
import marketlpaceFiltersAutocomplete from "./marketlpaceFiltersAutocomplete";
import marketlpaceFiltersMinMaxAutocomplete from "./marketlpaceFiltersMinMaxAutocomplete";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../../lands-marketplace-utils";

interface IProps {
  filters: ImarketlpaceFilters;
  setFilters: Dispatch<SetStateAction<ImarketlpaceFilters>>;
}

const marketlpaceDesktopFilters = ({ filters, setFilters }: IProps) => (
  <Box sx={{ display: "flex", gap: 1.5 }}>
    <marketlpaceFiltersAutocomplete
      options={getAllStates({ filterBlackList: true }).map(({ value, label }) => ({ value, label }))}
      onSelect={(state) => setFilters({ ...filters, state, ...(!state && { county: null }) })}
      placeholder="State"
    />
    <marketlpaceFiltersAutocomplete
      options={getCounties(filters.state).map(({ value, label }) => ({ value, label }))}
      onSelect={(county) => setFilters({ ...filters, county })}
      placeholder="County"
      disabled={!filters.state}
    />
    <marketlpaceFiltersMinMaxAutocomplete
      options={acreagesFilters}
      onSelect={(acreage) => setFilters({ ...filters, acreageMin: acreage?.min || null, acreageMax: acreage?.max || null })}
      placeholder="Acreage"
      getLabel={(value) => getAcreageLabel(value?.min || null, value?.max || null)}
    />
    <marketlpaceFiltersMinMaxAutocomplete
      options={priceFilters}
      onSelect={(price) => setFilters({ ...filters, priceMin: price?.min || null, priceMax: price?.max || null })}
      placeholder="VOLT Price"
      getLabel={(value) => getPriceLabel(value?.min || null, value?.max || null)}
    />
  </Box>
);

export default marketlpaceDesktopFilters;
