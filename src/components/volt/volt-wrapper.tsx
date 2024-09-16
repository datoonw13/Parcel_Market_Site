import { IDecodedAccessToken } from "@/types/auth";
import { FC, Suspense } from "react";
import dynamic from "next/dynamic";
import VoltHeader from "./volt-header";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_406px)_1fr] xl:grid-cols-[minmax(0,_490px)_1fr] h-screen">
    <div className="">
      <VoltHeader user={user} />
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
