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
import SignInForm from "@/app/auth/sign-in/sign-in";
import { breakPoints } from "../../../tailwind.config";
import VoltFooter from "./volt-footer";
import VoltSearch from "./volt-search";
import VoltSearchResult from "./volt-search-result";
import VoltSearchResultsMap from "./search-results-map";
import VoltSearchOnMap from "./search-on-map";
import { Popover, PopoverAnchor } from "../ui/popover";
import HeaderMenu from "../landing/header/menu";
import VoltDrawer from "./drawer";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";

const Map = dynamic(() => import("@/components/maps/mapbox/mapbox-base"), { ssr: false });

interface VoltMobileProps {
  user: IDecodedAccessToken | null;
  form: UseFormReturn<VoltSearchModel>;
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
  propertiesInteraction: IPropertiesInteraction;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
}

const VoltMobile: FC<VoltMobileProps> = ({ user, form, data, propertiesInteraction, setPropertiesInteraction }) => {
  const [isPending, startTransition] = useTransition();
  const [searchError, setSearchError] = useState<"limit" | "notFound" | null>(null);
  const [searchMapRef, setSearchMapRef] = useState<MapBoX | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [drawerInitialHeight, setDrawerInitialHeight] = useState<null | number>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (data?.errorMessage) {
      setSearchError(data.errorMessage === "Search limit exceeded for this month." ? "limit" : "notFound");
    } else {
      setSearchError(null);
    }
  }, [data?.errorMessage, isPending]);

  useEffect(() => {
    if (data?.data && data?.data.length === 1) {
      setPropertiesInteraction((prevData) => ({
        ...prevData,
        popup: {
          clickId: data.data![0].parcelNumberNoFormatting,
          isBulked: false,
          openId: data.data![0].parcelNumberNoFormatting,
        },
      }));
    } else {
      setPropertiesInteraction((prevData) => ({
        ...prevData,
        popup: null,
      }));
    }
  }, [data, setPropertiesInteraction]);

  return (
    <>
      <div className="grid grid-rows-[minmax(0,_max-content)_1fr] overflow-auto w-full h-dvh relative" ref={setContainerRef}>
        <Popover>
          <PopoverAnchor className="h-fit">
            <div className="h-14 flex items-center justify-between px-5 border-b" id="header">
              {data?.data && (
                <Link href={routes.volt.fullUrl}>
                  <IoChevronBack className="size-6" />
                </Link>
              )}
              {showMap && <IoChevronBack onClick={() => setShowMap(false)} className="size-6" />}
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
        {(!data?.data || isPending) && !showMap && (
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
                    showMobileMap={() => {
                      setShowMap(true);
                    }}
                  />
                </div>
              </div>

              <VoltFooter className="flex-col mt-auto pb-20 sm:pb-0 pt-6 justify-center gap-6" />
            </div>
          </ScrollArea>
        )}
        {data?.data && !isPending && (
          <div className="w-full">
            {drawerInitialHeight && (
              <div className="map-wrapper relative w-full" style={{ height: `calc(103% - ${drawerInitialHeight}px)` }}>
                <VoltSearchResultsMap
                  data={data.data}
                  onMarkerInteraction={() => {}}
                  onMouseLeave={() => {}}
                  propertiesInteraction={propertiesInteraction}
                />
              </div>
            )}
            <VoltDrawer
              container={containerRef}
              data={data.data}
              propertiesInteraction={propertiesInteraction}
              setPropertiesInteraction={setPropertiesInteraction}
              setDrawerInitialHeight={setDrawerInitialHeight}
              user={user}
            />
          </div>
        )}
        <div className={cn("absolute bottom-0 w-full invisible h-[calc(100%-56px)]", showMap && "visible")}>
          <VoltSearchOnMap user={user} mapRef={searchMapRef} setMapRef={setSearchMapRef} />
        </div>
      </div>
    </>
  );
};
export default VoltMobile;
