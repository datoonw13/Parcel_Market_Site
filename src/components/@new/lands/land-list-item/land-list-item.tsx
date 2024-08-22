import { FC } from "react";
import clsx from "clsx";
import Image from "next/image";
import dynamic from "next/dynamic";
import routes from "@/helpers/routes";
import Link from "next/link";
import { LandListItemProps } from "@/types/lands";
import { LocationIcon1 } from "../../icons/LocationIcons";
import { CalendarIcon1 } from "../../icons/CalendarIcons";
import Button from "../../shared/forms/Button";
import classes from "./styles.module.css";
import LandFollowButton from "../land-follow-button";
import { CameraIcon1 } from "../../icons/CameraIcons";
import DiscountBox from "../../icons/discount-box";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const LandListItem: FC<LandListItemProps> = ({
  view,
  data,
  sellingItemId,
  className,
  selected,
  selecting,
  onClick,
  showBookmark,
  followedListingId,
  disableDetail,
  map,
  disableZoom,
}) => (
  <div
    className={clsx(
      "pt-6 border border-grey-100 rounded-2xl w-full flex flex-col gap-4 cursor-pointer group hover:shadow-1 transition-all duration-100",
      className,
      selecting && classes.selecting,
      selected && classes.selected
    )}
    onClick={onClick}
  >
    <div className="px-6 flex justify-between items-start gap-6">
      <div className="grid gap-2">
        <Link
          className={clsx(disableDetail && "pointer-events-none cursor-not-allowed", "grid truncate")}
          href={disableDetail ? "/" : `${routes.marketplace.fullUrl}/${sellingItemId}`}
        >
          <h1 className=" font-semibold group-hover:text-primary-main transition-all duration-100 text-ellipsis whitespace-nowrap overflow-hidden">
            {data.name}
          </h1>
        </Link>
        <h2 className="text-xs text-grey-600 flex items-center gap-1.5 text-ellipsis whitespace-nowrap overflow-hidden">
          <LocationIcon1 /> {data.state}; {data.county}
        </h2>
      </div>

      {!selecting && showBookmark && (
        <LandFollowButton showTooltip onlyIcon landId={sellingItemId} initialFollowedListingId={followedListingId} />
      )}
    </div>
    <div className={clsx("px-6 grid gap-4", view === "horizontal" ? "grid-cols-2" : "grid-cols-1")}>
      <div
        className={clsx(
          "relative rounded-xl [&>div]:w-full [&>div]:h-full [&>div]:rounded-xl",
          view === "horizontal" ? "" : "xs:h-32 md:h-40"
        )}
      >
        {!map && <Image alt="" src="/property-map.png" fill className="rounded-xl" />}
        {map && map.canView && (
          <Map
            disableZoom={disableZoom}
            properties={[
              {
                latitude: map.latitude,
                longitude: map.longitude,
                center: true,
                markerType: "default",
                parcelNumber: map.parcelNumber,
              },
            ]}
            zoom={5}
          />
        )}
        {map && !map.canView && (
          <div className="relative">
            <div className="backdrop-blur-lg bg-white/30 w-full h-full z-10 absolute rounded-xl" />
            <CameraIcon1
              className="absolute"
              color="white !w-9 !h-9 z-10 m-auto top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
            />
            <Image alt="" src="/property-map.png" fill className="rounded-xl" />
          </div>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {Object.keys(data.options).map((key) => (
          <li className="flex items-center gap-1.5" key={key}>
            <div className="[&>svg]:!w-4 [&>svg]:!h-4">{data.options[key].icon}</div>
            <p className="text-sm text-grey-600 text-ellipsis whitespace-nowrap overflow-hidden">
              {data.options[key].label}:{" "}
              <span className="ext-sm font-medium text-black text-ellipsis whitespace-nowrap overflow-hidden">
                {data.options[key].value}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
    <div className="px-6 border-t border-grey-100 py-3 mt-4 flex items-center justify-between">
      <div>
        <p className="flex gap-1.5 items-center text-xs font-medium text-grey-600">
          <CalendarIcon1 className="size-3" /> Available till: <span className="text-black">{data.availableTill}</span>
        </p>
        {!Number.isNaN(Number(data?.receivedOffers)) && (
          <p className="flex gap-1.5 items-center text-xs font-medium text-grey-600">
            <DiscountBox className="size-4" /> Received Offers: <span className="text-black">{data.receivedOffers}</span>
          </p>
        )}
      </div>
      <Link
        className={clsx(disableDetail && "pointer-events-none cursor-not-allowed")}
        href={disableDetail ? "/" : `${routes.marketplace.fullUrl}/${sellingItemId}`}
      >
        <Button disabled={disableDetail}>Details</Button>
      </Link>
    </div>
  </div>
);
export default LandListItem;
