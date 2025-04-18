"use client";

import { CalendarIcon1 } from "@/components/@new/icons/CalendarIcons";
import { IdIcon1 } from "@/components/@new/icons/IdIcons";
import { LocationIcon1 } from "@/components/@new/icons/LocationIcons";
import { MoneyIcon1 } from "@/components/@new/icons/MoneyIcons";
import { ResizeIcon1 } from "@/components/@new/icons/ResizeIcons";
import Divider from "@/components/@new/shared/Divider";
import Button from "@/components/@new/shared/forms/Button";
import { moneyFormatter } from "@/helpers/common";
import { states } from "@/helpers/states";
import { OfferModel } from "@/types/offer";
import moment from "moment";
import clsx from "clsx";
import { useAtom } from "jotai";
import { sentOffersAtom } from "@/atoms/sent-offers-atom";
import useMediaQuery from "@/hooks/useMediaQuery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import routes from "@/helpers/routes";
import OfferStatus from "../offer-status";

const SentOfferItem = ({ data }: { data: OfferModel }) => {
  const isSmallDevice = useMediaQuery(1024);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [sentOffersOptions, setSentOffersOption] = useAtom(sentOffersAtom);

  const states: any = [];
  const counties: any = [];
  const handleSelect = () => {
    if (!sentOffersOptions.selecting) {
      return;
    }
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
      router.push(`${pathname}/details/${data.id}`);
    } else {
      params.set("offerId", data.id.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  return (
    <>
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
            <Link href={`${routes.marketplace.fullUrl}/${data.sellingProperty.id}`}>
              <h1 className="font-semibold truncate">{data.sellingProperty.title}</h1>
            </Link>
            <h2 className="text-xs text-grey-600 flex items-center gap-1.5 text-ellipsis whitespace-nowrap overflow-hidden">
              {/* <LocationIcon1 /> {state?.label}; {county} */}
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
                    <span className="text-sm text-black font-medium">{moneyFormatter.format(Number(data.sellingProperty.salePrice))}</span>
                  </p>
                </div>
              </div>
              <Divider />
              <div className="space-y-3">
                <p className="font-semibold text-sm">Offered Price</p>
                <p className="text-sm text-grey-600">
                  Offered Price: <span className="text-sm text-black font-medium">{moneyFormatter.format(Number(data.price))}</span>
                </p>
                <p className="text-sm text-grey-600">
                  Offered VOLT Value Per Acre:{" "}
                  <span className="text-sm text-black font-medium">
                    {moneyFormatter.format(Number(data.price) / Number(data.sellingProperty.acrage))}
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
          <Link className="w-full" href={`${routes.user.messages.fullUrl}?userId=${data.offerGivenTo?.id}`}>
            <Button className="w-full" variant="secondary">
              Contact Seller
            </Button>
          </Link>
          <Button className="w-full" onClick={openDetail}>
            Details
          </Button>
        </div>
      </div>
    </>
  );
};

export default SentOfferItem;
