"use client";

import { FC, useState, useTransition } from "react";
import { z } from "zod";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IUserBaseInfo } from "@/types/auth";
import VoltDetailsDesktop from "./desktop/details-desktop";
import { LoadingIcon2 } from "../@new/icons/LoadingIcons";
import { breakPoints } from "../../../tailwind.config";
import VoltDetailsMobile from "./mobile/details-mobile";

interface VoltDetailsLayoutProps {
  data: z.infer<typeof PropertyDataSchema>;
  propertyTypes: Array<{ id: number; group: "vacant-land" | "other"; value: string }>;
  isSubscribed: boolean;
  user: IUserBaseInfo | null;
}

const mapLayers = [
  {
    label: "Outdoors",
    value: "mapbox://styles/mrzippo123/cm7dab21800au01r3hoz6311h",
  },
  {
    label: "Navigation Night",
    value: "mapbox://styles/mrzippo123/cm7daisum00a301sid550cdss",
  },
  {
    label: "Navigation Day",
    value: "mapbox://styles/mrzippo123/cm7damch7000001r39j4c5ism",
  },
  {
    label: "Satellite Streets",
    value: "mapbox://styles/mrzippo123/cm7daobqv009b01ryfy0857dy",
  },
  {
    label: "Streets",
    value: "mapbox://styles/mrzippo123/cm7dapd3x00a501sicvyy4sjb",
  },
  {
    label: "Monochrome Light",
    value: "mapbox://styles/mrzippo123/cm7darmad00af01r7f24rftjr",
  },
  {
    label: "Monochrome Dark",
    value: "mapbox://styles/mrzippo123/cm7dasuwp00ag01r760s6gosr",
  },
];

const VoltDetailsLayout: FC<VoltDetailsLayoutProps> = ({ data, propertyTypes, isSubscribed, user }) => {
  const params = useSearchParams();
  const [isFetching, startFetchingTransition] = useTransition();
  const { targetReached: isSm, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const [selectedLayer, setSelectedLayer] = useState("mapbox://styles/mrzippo123/cm7dab21800au01r3hoz6311h");

  const [isNonValidMedianHighlighted, setNonValidMedianHighlighted] = useState(false);
  const validatedFilters = voltDetailsFiltersValidations.safeParse(Object.fromEntries(params));
  const [filters, setFilters] = useState<z.infer<typeof voltDetailsFiltersValidations>>({
    acreageMin: data.filters.acreageMin,
    acreageMax: data.filters.acreageMax,
    radius: data.filters.radius || (10 as any),
    soldWithin: data.filters.soldWithin || (2 as any),
    ...validatedFilters.data!,
  });

  return (
    <>
      {isFetching && (
        <div className="fixed z-[99] w-full h-full top-0 left-0 bg-black-1000/70 flex items-center justify-center">
          <div className="rounded-2xl bg-white p-6 shadow-3 space-y-4 max-w-[90%] lg:max-w-md">
            <div className="relative w-fit mx-auto">
              <svg
                className="absolute -top-[-50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
                width="21"
                height="24"
                viewBox="0 0 21 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.1721 8.10277L11.3736 1.47938C11.5124 0.711291 10.9417 0 10.1852 0H1.20935C0.54185 0 0 0.559838 0 1.24949V7.24002C0 7.89182 0.484262 8.43543 1.11511 8.48411L8.8921 9.11697C9.50725 9.16835 10.0622 8.73022 10.1747 8.10277H10.1721Z"
                  fill="#0E8B40"
                />
                <path
                  d="M17.282 0H15.2586C14.6775 0 14.1775 0.427316 14.0702 1.0169L11.2562 16.5247C11.1175 17.2928 11.6881 18.0041 12.4446 18.0041H17.282C18.9756 18.0041 20.3473 16.5869 20.3473 14.837V3.167C20.3473 1.41717 18.9756 0 17.282 0Z"
                  fill="#16DB65"
                />
                <path
                  d="M8.15655 11.7192L1.30358 11.1621C0.599438 11.1053 0 11.6787 0 12.4062V22.5238C0 23.2135 0.54185 23.7733 1.20935 23.7733H6.32682C6.90794 23.7733 7.4079 23.346 7.51523 22.7537L9.25072 13.1905C9.38422 12.4603 8.87378 11.7733 8.15655 11.7138V11.7192Z"
                  fill="#05471C"
                />
              </svg>
              <LoadingIcon2 className="animate-spin size-12 text-primary-main" />
            </div>
            <p className="text-grey-800 text-center">
              Fetching{" "}
              {(filters.acreageMin || filters.acreageMax) && (
                <>
                  <span className="font-bold">{`[${filters.acreageMin || "N/A"}, ${filters.acreageMax || "N/A"}]`}</span> acre
                </>
              )}{" "}
              lands sold in last <span className="font-bold">{filters.soldWithin}</span> years in{" "}
              <span className="font-bold">{filters.radius}</span> mile radius
            </p>
          </div>
        </div>
      )}
      {!detecting && (
        <div id="details" className={cn("w-full h-full overflow-hidden relative")}>
          {isSm ? (
            <VoltDetailsMobile
              data={data}
              propertyTypes={propertyTypes}
              isNonValidMedianHighlighted={isNonValidMedianHighlighted}
              startFetchingTransition={startFetchingTransition}
              setNonValidMedianHighlighted={setNonValidMedianHighlighted}
              filters={filters}
              setFilters={setFilters}
              isSubscribed={isSubscribed}
              mapLayers={mapLayers}
              selectedLayer={selectedLayer}
              setSelectedLayer={setSelectedLayer}
              user={user}
            />
          ) : (
            <VoltDetailsDesktop
              data={data}
              propertyTypes={propertyTypes}
              isNonValidMedianHighlighted={isNonValidMedianHighlighted}
              startFetchingTransition={startFetchingTransition}
              setNonValidMedianHighlighted={setNonValidMedianHighlighted}
              filters={filters}
              setFilters={setFilters}
              isSubscribed={isSubscribed}
              mapLayers={mapLayers}
              selectedLayer={selectedLayer}
              setSelectedLayer={setSelectedLayer}
              user={user}
            />
          )}
        </div>
      )}
    </>
  );
};

export default VoltDetailsLayout;
