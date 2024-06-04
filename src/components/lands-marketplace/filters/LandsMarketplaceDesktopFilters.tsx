import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Box } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { getAllStates, getCounties } from "@/helpers/states";
import LandsMarketplaceFiltersAutocomplete from "./LandsMarketplaceFiltersAutocomplete";
import LandsMarketplaceFiltersMinMaxAutocomplete from "./LandsMarketplaceFiltersMinMaxAutocomplete";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../lands-marketplace-utils";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceDesktopFilters = ({ filters, setFilters }: IProps) => (
  <Box sx={{ display: "flex", gap: 1.5 }}>
    <LandsMarketplaceFiltersAutocomplete
      options={getAllStates().map(({ value, label }) => ({ value, label }))}
      onSelect={(state) => setFilters({ ...filters, state, ...(!state && { county: null }) })}
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
