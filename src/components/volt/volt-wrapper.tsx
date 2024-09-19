"use client";

import { FC, useState } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";
import VoltHeader from "./volt-header";
import VoltSearchDetails from "./volt-search-details";
import VoltPriceCalculation from "./volt-price-calculation/volt-price-calculation";
import VoltFooter from "./volt-footer";
import { ScrollArea } from "../ui/scroll-area";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

enum VoltSteps {
  SEARCH_PROPERTY,
  SELECT_PROPERTY,
  PRICE_CALCULATION,
}
interface VoltWrapperProps {
  user: IDecodedAccessToken | null;
}

const paddingX = "px-5 md:px-8 lg:px-11";

const VoltWrapper: FC<VoltWrapperProps> = ({ user }) => {
  const [step, setStep] = useState(VoltSteps.SEARCH_PROPERTY);
  return (
    <div className="flex flex-col h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_406px)_1fr] xl:grid-cols-[minmax(0,_490px)_1fr] h-full overflow-hidden">
        <div className="flex flex-col overflow-hidden h-screen relative">
          <VoltHeader user={user} />
          <ScrollArea>
            <div className="flex flex-col overflow-auto h-full pb-6">
              {step === VoltSteps.SEARCH_PROPERTY && <VoltSearchDetails user={user} className={cn("pt-6 md:pt-8", paddingX)} />}
              {step === VoltSteps.PRICE_CALCULATION && <VoltPriceCalculation />}
            </div>
          </ScrollArea>
          <VoltFooter className={cn(paddingX)} />
        </div>
        <div className={cn("w-full hidden lg:flex h-full flex-col")}>
          <Map
            properties={[{ parcelNumber: "test", latitude: 39.8283459, longitude: -98.5794797, center: true, markerType: "none" }]}
            disableZoom
            zoom={4}
            dragging={false}
          />
        </div>
      </div>
    </div>
  );
};
export default VoltWrapper;
