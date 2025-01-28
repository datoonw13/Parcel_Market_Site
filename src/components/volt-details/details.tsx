"use client";

import useMap from "@/hooks/useMap";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import LoadingCircle from "@/icons/LoadingCircle";
import { ScrollArea } from "../ui/scroll-area";
import { LoadingIcon1 } from "../@new/icons/LoadingIcons";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const VoltDetails = ({ loading }: { loading?: boolean }) => {
  const { ref, setRef } = useMap();

  return (
    <div className={cn("w-full h-full grid grid-cols-[1fr_min(25vw,_330px)] overflow-hidden relative")}>
      {loading && (
        <div className="w-full h-full z-10 absolute flex items-center justify-center">
          <LoadingIcon1 className="!size-10 [&>path]:fill-primary-main-800 z-10" />
        </div>
      )}
      <div className={cn(!ref && "bg-grey-100 animate-pulse")}>
        <Suspense fallback={<div className="w-full h-full bg-primary-main-800 animate-pulse" />}>
          <Map setRef={setRef} ref={ref} />
        </Suspense>
      </div>
      <div className="bg-white overflow-hidden">
        <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default VoltDetails;
