"use client";

import useMap from "@/hooks/useMap";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

const VoltSearchByMap = () => {
  const { ref, setRef, showRegridTiles } = useMap();

  useEffect(() => {
    if (ref) {
    }
  }, [ref]);

  return (
    <Suspense fallback={<div className="w-full h-full bg-primary-main-100 animate-pulse" />}>
      <Map setRef={setRef} ref={ref} />
    </Suspense>
  );
};

export default VoltSearchByMap;
