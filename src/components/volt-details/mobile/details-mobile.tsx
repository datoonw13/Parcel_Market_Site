"use client";

import routes from "@/helpers/routes";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, TransitionStartFunction, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import { IPropertiesInteraction } from "@/types/volt";
import { IoChevronBack, IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import Logo from "@/icons/Logo";
import HeaderMenu from "@/components/landing/header/menu";
import { IUserBaseInfo } from "@/types/auth";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { exportToExcel, exportToKml } from "@/lib/volt";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialogs/dialog";
import { AlertDialog } from "@/components/ui/dialogs/alert-dialog";
import { cn } from "@/lib/utils";
import { LuSearch } from "react-icons/lu";
import { SubscriptionType } from "@/types/subscriptions";
import { usePathname } from "next/navigation";
import { Button } from "../../ui/button";
import VoltDetailsDrawer from "./drawer";
import VoltDetailsMobileHeader from "./mobile-header";
import VoltDetailsMap from "../map/map";
import VoltDetailsFiltersWrapper from "../filters/wrapper";

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
  user: IUserBaseInfo | null;
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
  user,
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [drawerInitialHeight, setDrawerInitialHeight] = useState<null | number>(null);
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });
  const [exportMapPending, setExportMapPending] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const pathname = usePathname();

  const onMarkerInteraction = useCallback((data: Partial<IPropertiesInteraction>) => {
    setPropertiesInteraction((prev) => ({ ...prev, ...data }));
  }, []);

  useEffect(() => {
    if (data.assessments.data.length === 0) {
      setShowWarningModal(true);
    }
  }, [data]);

  return (
    <>
      <Dialog open={showWarningModal}>
        <DialogContent
          className={cn("border-0 bg-white shadow-4 max-w-[90%] rounded-2xl")}
          closeModal={() => {
            setShowWarningModal(false);
          }}
        >
          <div className="flex flex-col gap-2 items-center">
            <div className="size-12 rounded-full bg-error-100 items-center justify-center flex mx-auto">
              <LuSearch
                onClick={() => {
                  setShowWarningModal(false);
                }}
                className="text-error size-6"
              />
            </div>
            <h1 className="text-center font-semibold pt-2">No result found</h1>
            <h2 className="text-center text-sm">You can extend filters and try again.</h2>
            <Button
              onClick={() => {
                setShowWarningModal(false);
              }}
              className="w-full mt-3 max-w-[80%]"
            >
              Extend Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col h-dvh" id="mobile-root" ref={setContainerRef}>
        <Popover>
          <PopoverAnchor className="qdqwdqwd">
            <div className="h-14 flex items-center justify-between px-5" id="header">
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
        <div className="h-full flex flex-col">
          <VoltDetailsMobileHeader
            data={data}
            isNonValidMedianHighlighted={isNonValidMedianHighlighted}
            isSubscribed={isSubscribed}
            setNonValidMedianHighlighted={setNonValidMedianHighlighted}
          />
          {!isSubscribed && (
            <Link
              href={`${routes.checkout.fullUrl}?redirectUrl=${routes.volt.fullUrl}/${pathname.split("/")[2]}&plan=${
                SubscriptionType.Annual
              }`}
            >
              Subscribe to see prices
            </Link>
          )}
          <div className="h-full" id="map">
            {drawerInitialHeight && (
              <div className="map-wrapper relative" style={{ height: `calc(103% - ${drawerInitialHeight}px)` }}>
                <VoltDetailsMap
                  propertiesInteraction={propertiesInteraction}
                  onMouseLeave={() => {}}
                  onMarkerInteraction={onMarkerInteraction}
                  data={data}
                  isNonValidMedianHighlighted={isNonValidMedianHighlighted}
                  selectedLayer={selectedLayer}
                />
                <VoltDetailsFiltersWrapper
                  filters={filters}
                  mapLayers={mapLayers}
                  propertyTypes={propertyTypes}
                  selectedLayer={selectedLayer}
                  setFilters={setFilters}
                  setSelectedLayer={setSelectedLayer}
                  startFetchingTransition={startFetchingTransition}
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
            filters={filters}
          />
          <div className="flex gap-3 border-t pb-6 pt-4 fixed bottom-0 bg-white z-50 w-full px-3">
            {!user?.isSubscribed ? (
              <>
                <Tooltip
                  buttonClassName="w-full"
                  contentClasses="w-full"
                  renderButton={
                    <Button disabled className="w-full" variant="secondary">
                      <div className="flex flex-row items-center gap-3">
                        <IoEarthSharp className="size-4 text-info" />
                        Export Map
                      </div>
                    </Button>
                  }
                  renderContent="You cannot export this data with the free plan"
                />

                <Tooltip
                  buttonClassName="w-full"
                  renderButton={
                    <Button disabled className="w-full">
                      <div className="flex flex-row items-center gap-3">
                        <IoCloudDownloadOutline className="size-4" />
                        Export Data
                      </div>
                    </Button>
                  }
                  renderContent="You cannot export this data with the free plan"
                />
              </>
            ) : (
              <>
                <Button
                  className="w-full"
                  variant="secondary"
                  loading={exportMapPending}
                  onClick={async () => {
                    setExportMapPending(true);
                    await exportToKml(data, isNonValidMedianHighlighted);
                    setExportMapPending(false);
                  }}
                >
                  <div className="flex flex-row items-center gap-3">
                    <IoEarthSharp className="size-4 text-info" />
                    Export Map
                  </div>
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    exportToExcel(data, isNonValidMedianHighlighted);
                  }}
                >
                  <div className="flex flex-row items-center gap-3">
                    <IoCloudDownloadOutline className="size-4" />
                    Export Data
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VoltDetailsMobile;
