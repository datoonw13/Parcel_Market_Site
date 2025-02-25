"use client";

import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState, useTransition } from "react";
import { IPropertiesInteraction, VoltSearchModel } from "@/types/volt";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/icons/Logo";
import { UseFormReturn } from "react-hook-form";
import { ResponseModel } from "@/types/common";
import { IMainPropertyBaseInfo } from "@/types/property";
import dynamic from "next/dynamic";
import useMap from "@/hooks/useMap";
import { Map as MapBoX } from "mapbox-gl";
import { calculateLandPriceAction2 } from "@/server-actions/volt/actions";
import { useRouter } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { breakPoints } from "../../../tailwind.config";
import VoltFooter from "./volt-footer";
import VoltSearch from "./volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltSearchResultsMap from "./search-results-map";
import VoltSearchOnMap from "./search-on-map";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
  form: UseFormReturn<VoltSearchModel>;
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
  propertiesInteraction: IPropertiesInteraction;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
}

const VoltDesktop: FC<VoltDesktopProps> = ({ user, form, data, propertiesInteraction, setPropertiesInteraction }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.xl));
  const [isPending, startTransition] = useTransition();
  const [isGetDataPending, startGetDataTransition] = useTransition();
  const [searchError, setSearchError] = useState<"limit" | "notFound" | null>(null);
  const { ref, setRef } = useMap();
  const [searchMapRef, setSearchMapRef] = useState<MapBoX | null>(null);
  const router = useRouter();
  const [calculationPending, setCalculationPending] = useState(false);
  const { notify } = useNotification();

  const onMarkerInteraction = useCallback(
    (data: Partial<IPropertiesInteraction>) => {
      setPropertiesInteraction((prev) => ({ ...prev, ...data }));
    },
    [setPropertiesInteraction]
  );

  const calculatePrice = async () => {
    const property = data?.data?.find((el) => el.id === propertiesInteraction.popup?.openId);
    if (!property) {
      return;
    }
    setCalculationPending(true);

    const res = await calculateLandPriceAction2({
      county: property.county.value,
      state: property.state.value,
      parcelNumber: property.parcelNumber,
      owner: property.owner,
      propertyType: property.propertyType,
      coordinates: JSON.stringify(property.polygon),
      locality: "",
      acrage: property.acreage.toString(),
      lat: property.lat.toString(),
      lon: property.lon.toString(),
    });

    if (res.data) {
      startGetDataTransition(() => {
        router.push(`/volt/${res.data}`);
      });
    }

    if (res?.errorMessage || !res?.data) {
      notify({ title: "Error", description: res?.errorMessage || "Unknown" }, { variant: "error" });
    }
    setCalculationPending(false);
  };

  const onMouseLeave = useCallback(() => {
    setPropertiesInteraction((prev) => ({ ...prev, hover: null }));
  }, [setPropertiesInteraction]);

  useEffect(() => {
    if (data?.errorMessage) {
      setSearchError(data.errorMessage === "Search limit exceeded for this month." ? "limit" : "notFound");
    } else {
      setSearchError(null);
    }
  }, [data?.errorMessage, isPending]);

  useEffect(() => {
    if (ref) {
      ref.dragPan.disable();
      ref.doubleClickZoom.disable();
      ref.scrollZoom.disable();
    }
  }, [ref]);

  return (
    <>
      <table className="w-full h-full">
        <thead>
          <tr>
            <th className="max-w-[410px] w-[410px] xl:max-w-[490px] xl:w-[490px] m-0 p-0 border-0 h-0" />
            <th className="m-0 p-0 border-0 h-0" />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={isSmallDevice ? 1 : 2} className="relative h-full">
              <div className="h-full flex flex-col overflow-auto absolute top-0">
                <div className="px-14 xl:px-16 pt-14 xl:pt-16 pb-14">
                  <Link href="/">
                    <Logo className="w-[141px] h-10" />
                  </Link>
                </div>
                <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll">
                  <div className={cn("h-full flex flex-col px-8 xl:px-11 gap-12 relative pb-6")}>
                    <div className="overflow-auto flex flex-col gap-8">
                      <div className="space-y-6">
                        <VoltSearch
                          isSearchLimitError={searchError === "limit"}
                          isPending={isPending}
                          form={form}
                          startTransition={startTransition}
                          searchError={searchError}
                          setSearchError={setSearchError}
                          searchMapRef={searchMapRef}
                        />
                      </div>
                      {data?.data && !isPending && (
                        <VoltSearchResult
                          data={data.data}
                          propertiesInteraction={propertiesInteraction}
                          setPropertiesInteraction={setPropertiesInteraction}
                        />
                      )}

                      {isPending && (
                        <div id="loader" className="space-y-4">
                          <div className="space-y-1">
                            <div className="max-w-40 w-full h-6 rounded-2xl bg-grey-100 animate-pulse" />
                            <div className="max-w-64 w-full h-5 rounded-2xl bg-grey-100 animate-pulse" />
                          </div>
                          <div className="w-full h-64 rounded-2xl bg-grey-100 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <VoltFooter className="flex-col items-start mt-auto" />
                  </div>
                </ScrollArea>
                {!!data?.data && !isPending && (
                  <div className="bg-white px-8 xl:px-11 pt-6 pb-8 xl:pb-11 border-t border-t-grey-100">
                    <Button
                      id="volt-get-value-button"
                      loading={calculationPending || isGetDataPending}
                      onClick={calculatePrice}
                      disabled={!propertiesInteraction.popup}
                      className="w-full"
                    >
                      Get Data
                    </Button>
                  </div>
                )}
              </div>
            </td>
            <td rowSpan={1} className="bg-primary-main-100 h-full relative">
              {form.watch("searchType") === "map" && <VoltSearchOnMap mapRef={searchMapRef} setMapRef={setSearchMapRef} />}
              {!data?.data && form.watch("searchType") !== "map" && <Map setRef={setRef} ref={ref} />}
              {data?.data && form.watch("searchType") !== "map" && (
                <VoltSearchResultsMap
                  data={data.data}
                  onMarkerInteraction={onMarkerInteraction}
                  onMouseLeave={onMouseLeave}
                  propertiesInteraction={propertiesInteraction}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default VoltDesktop;
