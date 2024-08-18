"use client";

import { valueLandAtom } from "@/atoms/value-land-atom";
import { numFormatter } from "@/helpers/common";
import routes from "@/helpers/routes";
import FbIcon from "@/icons/FbIcon";
import TwitterIcon from "@/icons/TwitterIcon";
import { useAtom } from "jotai";
import { LatLngTuple } from "leaflet";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IDecodedAccessToken, ISignInResponse } from "@/types/auth";
import CalculationDetailsMap from "./calculated-price/calculatation-details-map";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const ValueLanSidebar = ({ user }: { user: IDecodedAccessToken | null }) => {
  const pathname = usePathname();

  return (
    <div className="hidden xl:block relative">
      <div className="sticky top-0 w-full h-screen">
        <div className="relative w-full h-full">
          {pathname === routes.valueLand.value.fullUrl ? (
            <CalculationDetailsMap user={user} />
          ) : (
            <>
              <Image alt="" src="/parcel-find-cover.png" fill style={{ objectFit: "cover" }} />
              <div className="absolute w-full h-full bg-black-400" />
              <div className="flex flex-row items-center justify-end gap-4 absolute w-full bottom-0 z-20 text-white font-medium p-6">
                <div>Let&apos;s connect</div>
                <div className="cursor-pointer [&>svg>circle]:fill-grey-30 [&>svg>circle]:strokeWhite [&>svg>path]:fill-white">
                  <FbIcon />
                </div>
                <div className="cursor-pointer [&>svg>circle]:fill-grey-30 [&>svg>circle]:strokeWhite [&>svg>path]:fill-white">
                  <TwitterIcon />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueLanSidebar;
