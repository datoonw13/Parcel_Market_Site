import { priceFilters, getMinMaxFilterLabel } from "@/components/@new/shared/filters/filters-utils";
import FiltersDrawer from "@/components/@new/shared/filters/mobile/FiltersDrawer";
import { getAllStates } from "@/helpers/states";
import { OfferStatusEnum } from "@/types/offer";
import { acreagesFilters, getAcreageLabel } from "../../../lands/filters/lands-filters-utils";

const SentOffersMobileFilter = () => {
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
    offeredPrice: {
      label: "Offered Price",
      type: "minmax" as const,
      renderLabel: getMinMaxFilterLabel,
      options: priceFilters,
    },
    status: {
      label: "Status",
      type: "default" as const,
      options: Object.values(OfferStatusEnum).map((value) => ({ label: value, value })),
    },
  };

  return <FiltersDrawer data={filters} />;
};

export default SentOffersMobileFilter;
