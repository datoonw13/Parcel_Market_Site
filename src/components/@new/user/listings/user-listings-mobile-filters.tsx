import { priceFilters, getMinMaxFilterLabel } from "@/components/@new/shared/filters/filters-utils";
import FiltersDrawer from "@/components/@new/shared/filters/mobile/FiltersDrawer";
import { getAllStates } from "@/helpers/states";
import { acreagesFilters, getAcreageLabel } from "../../lands/filters/lands-filters-utils";

const UserListingsMobileFilter = () => {
  const filters = {
    state: {
      label: "State",
      type: "default" as const,
      options: getAllStates().map((value) => ({ label: value.label, value: value.value })),
    },
    county: {
      label: "County",
      type: "default" as const,
      options: [],
    },
    acreage: {
      label: "Acreage",
      type: "minmax" as const,
      renderLabel: getAcreageLabel,
      options: acreagesFilters,
    },
    voltPrice: {
      label: "VOLT Price",
      type: "minmax" as const,
      renderLabel: getMinMaxFilterLabel,
      options: priceFilters,
    },
  };

  return <FiltersDrawer data={filters} />;
};

export default UserListingsMobileFilter;
