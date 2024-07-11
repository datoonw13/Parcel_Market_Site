import { priceFilters, getMinMaxFilterLabel } from "@/components/@new/shared/filters/filters-utils";
import FiltersDrawer from "@/components/@new/shared/filters/mobile/FiltersDrawer";
import { getReceivedOffersParcelNumbers } from "@/server-actions/user/offers-actions";
import { OfferStatusEnum } from "@/types/offer";
import { useEffect, useState } from "react";

const ReceivedOffersMobileFilters = () => {
  const [parcelNumbers, setParcelNumbers] = useState<{ value: string; label: string }[] | null>(null);

  const getParcelNumbers = async () => {
    const data = await getReceivedOffersParcelNumbers();
    if (data) {
      setParcelNumbers(data.map((el) => ({ value: el, label: el })));
    }
  };

  const filters = {
    status: {
      label: "Status",
      type: "default" as const,
      options: Object.values(OfferStatusEnum).map((value) => ({ label: value, value })),
    },
    parcelNumber: {
      label: "Parcel ID",
      type: "default" as const,
      options: parcelNumbers || [],
    },
    offerPrice: {
      label: "Offer Price",
      type: "minmax" as const,
      renderLabel: getMinMaxFilterLabel,
      options: priceFilters,
    },
    voltPrice: {
      label: "VOLT Price",
      type: "minmax" as const,
      renderLabel: getMinMaxFilterLabel,
      options: priceFilters,
    },
  };

  useEffect(() => {
    getParcelNumbers();
  }, []);

  return <FiltersDrawer data={filters} />;
};

export default ReceivedOffersMobileFilters;
