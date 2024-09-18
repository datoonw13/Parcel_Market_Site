import { FC } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import VoltHeader from "./volt-header";
import PropertySearchDetails from "./property-search-details";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_406px)_1fr] xl:grid-cols-[minmax(0,_490px)_1fr] h-screen">
    <div className="flex flex-col overflow-hidden">
      <VoltHeader user={user} />
      <div className="flex flex-col overflow-auto h-full">
        <div className="py-6 md:py-8 px-5 md:px-8 lg:px-11">
          <PropertySearchDetails />
        </div>
        <div className="py-6 mt-auto space-y-4 md:py-8 px-5 md:px-8 lg:px-11">
          <div className="flex gap-3 items-center justify-center lg:justify-start">
            <Link href="/">
              <p className="text-sm text-gray-800">Privacy Policy</p>
            </Link>
            <div className="w-[1px] h-4 bg-gray-200" />
            <Link href="/">
              <p className="text-sm text-gray-800">Terms of use</p>
            </Link>
          </div>
          <p className="text-xs font-medium text-grey-600 text-center lg:text-start">
            ©{new Date().getFullYear()} Parcel Market. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    <div className="hidden lg:flex">
      <Map
        properties={[{ parcelNumber: "test", latitude: 39.8283459, longitude: -98.5794797, center: true, markerType: "none" }]}
        disableZoom
        zoom={4}
        dragging={false}
      />
    </div>
  </div>
);

export default VoltWrapper;
