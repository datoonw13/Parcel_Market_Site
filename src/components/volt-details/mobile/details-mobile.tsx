"use client";

import routes from "@/helpers/routes";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, TransitionStartFunction, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { IPropertiesInteraction } from "@/types/volt";
import { Button } from "../../ui/button";
import VoltDetailsDrawer from "./drawer";
import VoltDetailsMobileHeader from "./mobile-header";
import VoltDetailsMap from "../map/map";

interface VoltDetailsMobileProps {
  startFetchingTransition: TransitionStartFunction;
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  filters: z.infer<typeof voltDetailsFiltersValidations>;
  setFilters: Dispatch<SetStateAction<z.infer<typeof voltDetailsFiltersValidations>>>;
  isSubscribed: boolean;
  mapLayers: {
    label: string;
    value: string;
  }[];
  setSelectedLayer: Dispatch<SetStateAction<string>>;
  selectedLayer: string;
}

const VoltDetailsMobile: FC<VoltDetailsMobileProps> = ({
  data,
  filters,
  isNonValidMedianHighlighted,
  isSubscribed,
  propertyTypes,
  setFilters,
  setNonValidMedianHighlighted,
  startFetchingTransition,
  mapLayers,
  selectedLayer,
  setSelectedLayer,
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [drawerInitialHeight, setDrawerInitialHeight] = useState<null | number>(null);
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });

  return (
    <div className="flex flex-col h-dvh" id="mobile-root" ref={setContainerRef}>
      <div className="h-14" id="header">
        Header
      </div>
      <div className="h-full flex flex-col">
        <VoltDetailsMobileHeader
          data={data}
          filters={filters}
          isNonValidMedianHighlighted={isNonValidMedianHighlighted}
          isSubscribed={isSubscribed}
          propertyTypes={propertyTypes}
          setFilters={setFilters}
          startFetchingTransition={startFetchingTransition}
          setNonValidMedianHighlighted={setNonValidMedianHighlighted}
          mapLayers={mapLayers}
          setSelectedLayer={setSelectedLayer}
          selectedLayer={selectedLayer}
        />
        {!isSubscribed && (
          <Link
            className="border-b border-b-primary-main-200 bg-white w-full text-center block px-3 py-2 font-semibold text-xs underline text-primary-main"
            href={routes.user.subscription.fullUrl}
          >
            Subscribe to see prices
          </Link>
        )}
        <div className="h-full" id="map">
          {drawerInitialHeight && (
            <div className="map-wrapper" style={{ height: `calc(100% - ${drawerInitialHeight}px)` }}>
              <VoltDetailsMap
                propertiesInteraction={propertiesInteraction}
                onMouseLeave={() => {}}
                onMarkerInteraction={() => {}}
                data={data}
                isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                selectedLayer={selectedLayer}
              />
            </div>
          )}
        </div>
        <VoltDetailsDrawer
          propertiesInteraction={propertiesInteraction}
          setPropertiesInteraction={setPropertiesInteraction}
          container={containerRef}
          setDrawerInitialHeight={setDrawerInitialHeight}
          data={data}
          isNonValidMedianHighlighted={isNonValidMedianHighlighted}
          isSubscribed={isSubscribed}
        />
        <div className="flex gap-3 border-t pb-6 pt-4 fixed bottom-0 bg-white z-50 w-full px-4">
          <Button className="w-full">Test</Button>
          <Button className="w-full">Test</Button>
        </div>
      </div>
    </div>
  );
};

export default VoltDetailsMobile;
