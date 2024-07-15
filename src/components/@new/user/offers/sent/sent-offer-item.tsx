"use client";

import { CalendarIcon1 } from "@/components/@new/icons/CalendarIcons";
import { IdIcon1 } from "@/components/@new/icons/IdIcons";
import { LocationIcon1 } from "@/components/@new/icons/LocationIcons";
import { MoneyIcon1 } from "@/components/@new/icons/MoneyIcons";
import { ResizeIcon1 } from "@/components/@new/icons/ResizeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import { numFormatter } from "@/helpers/common";
import { getAllStates } from "@/helpers/states";
import { OfferModel } from "@/types/offer";
import moment from "moment";
import clsx from "clsx";
import { useAtom } from "jotai";
import { sentOffersAtom } from "@/atoms/sent-offers-atom";
import { useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import OfferStatus from "../offer-status";
import SentOfferDetailsModal from "./sent-offer-details-modal";

const SentOfferItem = ({ data }: { data: OfferModel }) => {
  const isSmallDevice = useMediaQuery(1024);

  const [sentOffersOptions, setSentOffersOption] = useAtom(sentOffersAtom);
  const [selectedOffer, setSelectedOffer] = useState<OfferModel | null>(null);

  const state = getAllStates().find((el) => el.value === data.sellingProperty.state.toLocaleLowerCase());
  const county =
    state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === data.sellingProperty.county.toLocaleLowerCase()) || "";

  const handleSelect = () => {
    if (sentOffersOptions.selectedOffersIds?.includes(data.id)) {
      setSentOffersOption((prev) => ({
        ...prev,
        selectedOffersIds: sentOffersOptions.selectedOffersIds?.filter((id) => id !== data.id) || null,
      }));
    } else {
      setSentOffersOption((prev) => ({ ...prev, selectedOffersIds: [...(prev.selectedOffersIds || []), data.id] }));
    }
  };

  const openDetail = () => {
    if (isSmallDevice) {
    } else {
      setSelectedOffer(data);
    }
  };

  return (
    <>
      <SentOfferDetailsModal data={selectedOffer} closeModal={() => setSelectedOffer(null)} />
      <div
        className={clsx(
          "border border-grey-100 rounded-2xl",
          sentOffersOptions.selectedOffersIds?.includes(data.id) && "selected",
          sentOffersOptions.selecting && "selecting"
        )}
        onClick={handleSelect}
      >
        <div className="px-6 pt-6 pb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="font-semibold truncate">
              land in Los Angeles County, California, USA. County, California, USA. County, California, USA.
            </h1>
            <h2 className="text-xs text-grey-600 flex items-center gap-1.5 text-ellipsis whitespace-nowrap overflow-hidden">
              <LocationIcon1 /> {state?.label}; {county}
            </h2>
          </div>
          <div className="space-y-3">
            <div className="bg-grey-30 rounded-2xl p-4 space-y-4">
              <div className="space-y-3">
                <p className="font-semibold text-sm">Land Information</p>
                <div className="flex items-center gap-1.5">
                  <IdIcon1 color="grey-600" />
                  <p className="text-sm text-grey-600">
                    Parcel ID: <span className="text-sm text-black font-medium">{data.sellingProperty.parcelNumber}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <ResizeIcon1 color="grey-600" />
                  <p className="text-sm text-grey-600">
                    Acreage: <span className="text-sm text-black font-medium">{data.sellingProperty.acrage} Acres</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <MoneyIcon1 color="grey-600" />
                  <p className="text-sm text-grey-600">
                    VOLT Value:{" "}
                    <span className="text-sm text-black font-medium">{numFormatter.format(Number(data.sellingProperty.marketPrice))}</span>
                  </p>
                </div>
              </div>
              <Divider />
              <div className="space-y-3">
                <p className="font-semibold text-sm">Offered Price</p>
                <p className="text-sm text-grey-600">
                  Offered Price: <span className="text-sm text-black font-medium">{numFormatter.format(Number(data.price))}</span>
                </p>
                <p className="text-sm text-grey-600">
                  Offered price per acre:{" "}
                  <span className="text-sm text-black font-medium">
                    {numFormatter.format(Number(data.price) / Number(data.sellingProperty.acrage))}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row items-center gap-1">
                <CalendarIcon1 color="grey-600" />
                <p className="text-xs text-grey-600">
                  Active Until:
                  <span className="text-black font-semibold ml-1">{moment(data.activeUntil, "YYYY-MM-DD").format("DD MMM")}</span>
                </p>
              </div>
              <OfferStatus status={data.offerStatus} />
            </div>
          </div>
        </div>
        <div className="py-4 px-6 flex gap-3 border-t border-grey-100">
          <Button className="w-full" variant="secondary">
            Contact Seller
          </Button>
          <Button className="w-full" onClick={openDetail}>
            Details
          </Button>
        </div>
      </div>
    </>
  );
};

export default SentOfferItem;
