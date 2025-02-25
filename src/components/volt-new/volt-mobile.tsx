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
import routes from "@/helpers/routes";
import { IoChevronBack } from "react-icons/io5";
import { breakPoints } from "../../../tailwind.config";
import VoltFooter from "./volt-footer";
import VoltSearch from "./volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltSearchResultsMap from "./search-results-map";
import VoltSearchOnMap from "./search-on-map";
import { Popover, PopoverAnchor } from "../ui/popover";
import HeaderMenu from "../landing/header/menu";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltMobileProps {
  user: IDecodedAccessToken | null;
  form: UseFormReturn<VoltSearchModel>;
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
  propertiesInteraction: IPropertiesInteraction;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
}

const VoltMobile: FC<VoltMobileProps> = ({ user, form, data, propertiesInteraction, setPropertiesInteraction }) => {
  const { targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints.xl));
  const [isPending, startTransition] = useTransition();
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
      startTransition(() => {
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
      <div className="h-full flex flex-col overflow-auto w-full">
        <Popover>
          <PopoverAnchor>
            <div className="h-14 flex items-center justify-between px-5 border-b" id="header">
              <Link href={routes.volt.fullUrl}>
                <IoChevronBack className="size-6" />
              </Link>
              <Link href={routes.volt.fullUrl}>
                <Logo className="!h-6 w-full" />
              </Link>
              <HeaderMenu
                user={user}
                onAnimationStart={() => {
                  const el = document.querySelector<HTMLElement>("[data-radix-popper-content-wrapper]");
                  if (el) {
                    el.style.setProperty("--radix-popper-zIndex", "99");
                  }
                }}
              />
            </div>
          </PopoverAnchor>
        </Popover>
        <ScrollArea className="h-full [&>div>div:first-child]:h-full" id="volt-scroll" aria-hidden>
          <div className={cn("h-full py-4 px-5")}>
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
            </div>

            <VoltFooter className="flex-col mt-auto pb-20 sm:pb-0 pt-6 justify-center gap-6" />
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
export default VoltMobile;
