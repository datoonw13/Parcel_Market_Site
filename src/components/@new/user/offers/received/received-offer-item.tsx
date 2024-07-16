"use client";

import React, { FC, useState } from "react";
import { OfferModel } from "@/types/offer";
import clsx from "clsx";
import { LocationIcon1 } from "@/components/@new/icons/LocationIcons";
import { getCountyValue, getStateValue } from "@/helpers/states";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { numFormatter } from "@/helpers/common";
import { receivedOffersAtom } from "@/atoms/received-offers-atom";
import { useAtom } from "jotai";
import useMediaQuery from "@/hooks/useMediaQuery";
import Link from "next/link";
import OfferDetailSection from "../details/offer-detail-section";
import ReceivedOfferDetailsModal from "./received-offer-details-modal";

interface ReceivedOfferItemProps {
  data: OfferModel;
}

const ReceivedOfferItem: FC<ReceivedOfferItemProps> = ({ data }) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const isSmallDevice = useMediaQuery(1024);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedOffer, setSelectedOffer] = useState<OfferModel | null>(null);
  const [receivedOffersOptions, setReceivedOffersOption] = useAtom(receivedOffersAtom);

  const openDetail = () => {
    if (isSmallDevice) {
      router.push(`${pathname}/details/${data.id}`);
    } else {
      setSelectedOffer(data);
    }
  };

  const handleSelect = () => {
    if (!receivedOffersOptions.selecting) {
      return;
    }
    if (receivedOffersOptions.selectedOffersIds?.includes(data.id)) {
      setReceivedOffersOption((prev) => ({
        ...prev,
        selectedOffersIds: receivedOffersOptions.selectedOffersIds?.filter((id) => id !== data.id) || null,
      }));
    } else {
      setReceivedOffersOption((prev) => ({ ...prev, selectedOffersIds: [...(prev.selectedOffersIds || []), data.id] }));
    }
  };

  return (
    <>
      <ReceivedOfferDetailsModal data={selectedOffer} closeModal={() => setSelectedOffer(null)} />
      <div
        className={clsx(
          `border border-grey-100 w-full bg-[url('/offer-box-mobile-gradient.png')] bg-[length:100%_115px] bg-no-repeat pt-6 pb-4 rounded-2xl
        sm:bg-[url('/offer-box-desktop-gradient.png')] sm:bg-[length:284px_120px] md:bg-[length:328px_140px] sm:bg-right-top md:pt-8 `,
          receivedOffersOptions.selectedOffersIds?.includes(data.id) && "selected",
          receivedOffersOptions.selecting && "selecting"
        )}
        onClick={handleSelect}
      >
        <div className="flex flex-col sm:flex-row gap-9 px-4 md:px-8 mb-3 sm:mb-4">
          <div className="space-y-2 grid">
            <Link href={`${routes.marketplace.fullUrl}/${data.sellingProperty.id}`}>
              <h1 className="font-semibold text-white truncate max-w-[80%] sm:max-w-[40%] md:sm:max-w-[50%] lg:max-w-[calc(100%-160px)] sm:text-black sm:text-lg">
                long names with 3 dots long names with 3 dot long names with 3 dot...
              </h1>
            </Link>
            <div className="flex items-center gap-1.5">
              <LocationIcon1 color="white" className="w-3 h-3.5 fill-white sm:fill-grey-600" />
              <h6 className="text-xs text-white sm:text-grey-600">
                {getStateValue(data.sellingProperty.state)?.label};{" "}
                {getCountyValue(data.sellingProperty.county, data.sellingProperty.state)?.label}
              </h6>
            </div>
          </div>
          <div className="flex justify-between sm:flex-col sm:justify-start items-center">
            <p className="text-xs font-medium sm:text-white sm:ml-auto">Offered Price</p>
            <p className="font-semibold text-primary-main sm:text-white sm:text-2xl">{numFormatter.format(Number(data.price))}</p>
          </div>
        </div>
        <OfferDetailSection data={data} rootClasses="mx-4 md:mx-8 mb-8" alertClasses="mt-3" />
        <Divider className="mb-4" />
        <div className="flex gap-3 px-4 md:px-8">
          <Button className="w-full sm:w-fit !h-10 sm:!h-auto sm:mr-auto" variant="secondary">
            Contact Buyer
          </Button>
          <Button
            className="hidden sm:block w-full sm:w-fit !h-10 sm:!h-auto"
            variant="secondary"
            onClick={() => {
              push(`${routes.marketplace.fullUrl}/${data.sellingPropertyId}`);
            }}
          >
            View Land
          </Button>
          <Button className="w-full sm:w-fit !h-10 sm:!h-auto" onClick={openDetail}>
            Details
          </Button>
        </div>
      </div>
    </>
  );
};

export default ReceivedOfferItem;
