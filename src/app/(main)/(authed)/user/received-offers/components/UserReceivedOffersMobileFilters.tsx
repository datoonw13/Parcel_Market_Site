"use client";

import FiltersDrawer from "@/components/@new/shared/filters/mobile/FiltersDrawer";
import useMediaQuery from "@/hooks/useMediaQuery";

const UserReceivedOffersMobileFilters = () => {
  const isSmallDevice = useMediaQuery(640);

  return isSmallDevice ? <FiltersDrawer /> : null;
};

export default UserReceivedOffersMobileFilters;
