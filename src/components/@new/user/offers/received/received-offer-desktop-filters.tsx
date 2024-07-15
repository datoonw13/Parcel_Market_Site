"use client";

import MinMaxDesktopFilters from "@/components/@new/shared/filters/desktop/MinMaxDesktopFilters";
import AutoCompleteDesktopFilters from "@/components/@new/shared/filters/desktop/AutoCompleteDesktopFilters";
import { getMinMaxFilterLabel, priceFilters } from "@/components/@new/shared/filters/filters-utils";
import { OfferStatusEnum } from "@/types/offer";
import { useEffect, useState } from "react";
import { getReceivedOffersParcelNumbersAction } from "@/server-actions/offer/actions";

const ReceivedOffersDesktopFilters = () => {
  const [parcelNumbers, setParcelNumbers] = useState<{ value: string; label: string }[] | null>([]);

  const getParcelNumbers = async () => {
    const { data } = await getReceivedOffersParcelNumbersAction();
    if (data) {
      setParcelNumbers(data.map((el) => ({ value: el, label: el })));
    }
  };

  useEffect(() => {
    getParcelNumbers();
  }, []);

  return (
    <div className="gap-3 mb-6 grid grid-cols-4">
      <AutoCompleteDesktopFilters filterKey="parcelNumber" placeholder="Parcel ID" options={parcelNumbers || []} loading={!parcelNumbers} />
      <AutoCompleteDesktopFilters
        filterKey="status"
        placeholder="Status"
        options={Object.keys(OfferStatusEnum).map((key) => ({
          value: OfferStatusEnum[key as keyof typeof OfferStatusEnum],
          label: OfferStatusEnum[key as keyof typeof OfferStatusEnum],
        }))}
      />
      <MinMaxDesktopFilters
        filterKey="offerPrice"
        options={priceFilters}
        placeHolder="Offer Price"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
      <MinMaxDesktopFilters
        filterKey="voltPrice"
        options={priceFilters}
        placeHolder="VOLT Price"
        getOptionLabel={(item) => getMinMaxFilterLabel(item.min, item.max)}
      />
    </div>
  );
};

export default ReceivedOffersDesktopFilters;
