"use client";

import { FC } from "react";
import { OfferModel } from "@/types/offer";
import clsx from "clsx";
import { LocationIcon1 } from "@/components/@new/icons/LocationIcons";
import { getCounty, getState } from "@/helpers/states";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { moneyFormatter } from "@/helpers/common";
import { receivedOffersAtom } from "@/atoms/received-offers-atom";
import { useAtom } from "jotai";
import useMediaQuery from "@/hooks/useMediaQuery";
import Link from "next/link";
import OfferDetailSection from "../details/offer-detail-section";

interface ReceivedOfferItemProps {
  data: OfferModel;
}

const ReceivedOfferItem: FC<ReceivedOfferItemProps> = ({ data }) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const isSmallDevice = useMediaQuery(1024);
  const router = useRouter();
  const pathname = usePathname();
  const [receivedOffersOptions, setReceivedOffersOption] = useAtom(receivedOffersAtom);

  const openDetail = () => {
    if (isSmallDevice) {
      router.push(`${pathname}/details/${data.id}`);
    } else {
      params.set("offerId", data.id.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
          <div className="space-y-2 grid w-full">
            <Link href={`${routes.marketplace.fullUrl}/${data.sellingProperty.id}`} className="truncate sm:w-[calc(100%-120px)] ">
              <h1 className="truncate font-semibold text-white w-full sm:text-black sm:text-lg">{data.sellingProperty.title}</h1>
            </Link>
            <div className="flex items-center gap-1.5">
              <LocationIcon1 color="white" className="w-3 h-3.5 fill-white sm:fill-grey-600" />
              <h6 className="text-xs text-white sm:text-grey-600">
                {getState(data.sellingProperty.state)?.label};{" "}
                {getCounty(data.sellingProperty.county, data.sellingProperty.state)?.short.label}
              </h6>
            </div>
          </div>
          <div className="flex justify-between sm:flex-col sm:justify-start items-center">
            <p className="text-xs font-medium sm:text-white sm:ml-auto sm:min-w-full sm:w-max">Offered Price</p>
            <p className="font-semibold text-primary-main sm:text-white sm:text-2xl sm:min-w-full sm:w-max">
              {moneyFormatter.format(Number(data.price))}
            </p>
          </div>
        </div>
        <OfferDetailSection data={data} rootClasses="mx-4 md:mx-8 mb-8" alertClasses="mt-3" />
        <Divider className="mb-4" />
        <div className="flex gap-3 px-4 md:px-8">
          <Button
            onClick={() => {
              router.push(`${routes.user.messages.fullUrl}?userId=${data?.offerGivenBy?.id}`);
            }}
            className="w-full sm:w-fit !h-10 sm:!h-auto sm:mr-auto"
            variant="secondary"
          >
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
