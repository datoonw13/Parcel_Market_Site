"use client";

import VoltPriceCalculationAxis from "@/components/volt/volt-calculation-axis";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import RecentSearchesMap from "../map";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface RecentSearchesLitItemDesktopProps {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  openSubscriptionWarning: () => void;
}

const RecentSearchesLitItemDesktop: FC<RecentSearchesLitItemDesktopProps> = ({ data, user, openSubscriptionWarning }) => {
  const router = useRouter();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });

  return (
    <div className="hidden lg:flex py-3 px-6 gap-6 flex-col">
      <ul className="list-disc marker:primary-main-400 px-4 grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-3 gap-y-3 gap-x-10">
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Owner: <span className="text-sm text-black font-medium">{data.owner}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Property Type: <span className="text-sm text-black font-medium">{data.propertyType}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Price per acreage: <span className="text-sm text-black font-medium">{moneyFormatter.format(data.pricePerAcreage)}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            State/County:{" "}
            <span className="text-sm text-black font-medium">
              {data.state.label}/{data.county.label}
            </span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Acreage: <span className="text-sm text-black font-medium">{data.acreage.toFixed(2)}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Search date: <span className="text-sm text-black font-medium">{moment(data.createdAt).format("MM-DD-YYYY")}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Parcel ID: <span className="text-sm text-black font-medium">{data.parcelNumberNoFormatting}</span>
          </p>
        </li>
        <li className="text-primary-main-400">
          <p className="truncate text-sm text-grey-600 font-medium">
            Volt Value: <span className="text-sm text-black font-medium">{moneyFormatter.format(data.price)}</span>
          </p>
        </li>
      </ul>
      <div style={{ aspectRatio: "2/1" }} className="bg-primary-main-100 w-full max-h-80 rounded-lg [&>div]:rounded-lg">
        <RecentSearchesMap
          data={data}
          mapInteraction={mapInteraction}
          setMpaInteraction={setMpaInteraction}
          openWarningModal={openSubscriptionWarning}
          user={user}
        />
      </div>
      <VoltPriceCalculationAxis
        responsiveBreakpoint="2xl"
        voltValue={data.price}
        user={user}
        mapInteraction={mapInteraction}
        setMpaInteraction={setMpaInteraction}
        setOpenPropertyDetailWarningModal={openSubscriptionWarning}
        data={
          data.propertiesUsedForCalculation.map((el) => ({
            parcelNumberNoFormatting: el.parcelNumberNoFormatting,
            acreage: el.acreage,
            price: el.lastSalePrice,
            pricePerAcre: el.pricePerAcreage,
            isMainLand: el.parcelNumberNoFormatting === data.parcelNumberNoFormatting,
          })) || []
        }
      />
    </div>
  );
};

export default RecentSearchesLitItemDesktop;
