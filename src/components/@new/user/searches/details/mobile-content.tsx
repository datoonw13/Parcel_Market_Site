import { Button } from "@/components/ui/button";
import { moneyFormatter } from "@/helpers/common";
import moment from "moment";
import React, { FC, useEffect, useState, useTransition } from "react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/dialogs/drawer";
import { cn, exportToExcel, exportToKml } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialogs/dialog";
import { IUserRecentSearches } from "@/types/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchItemDetailsMobileMap from "./map-mobile";
// import RecentSearchesMobileListItemMap from "./map";

interface SearchItemDetailsMobileContentProps {
  data: IUserRecentSearches;
  additionalDataResult: IUserRecentSearches;
  isOpen: boolean;
  canExport: boolean;
}

const SearchItemDetailsMobileContent: FC<SearchItemDetailsMobileContentProps> = ({ data, isOpen, canExport, additionalDataResult }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showExcelWarning, setExcelWarning] = useState(false);

  return (
    <>
      <Drawer open={showExcelWarning} onOpenChange={(open) => !open && setExcelWarning(false)}>
        <DrawerContent className="">
          <div className="max-w-lg mx-auto p-6 space-y-6">
            <>
              <DialogHeader>
                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-3 bg-primary-main-100 mx-auto")}>
                  <IoCloudDownloadOutline className="size-6 text-primary-main" />
                </div>
                <DialogTitle className="text-center !font-semibold !text-base !p-0">Download Data</DialogTitle>
                <DialogDescription className="text-center text-grey-800 text-sm max-w-80 mx-auto">
                  You can download the data for the lands participating in the price calculation, or all the data, including vacant lands.
                </DialogDescription>
              </DialogHeader>
              <div className="w-full justify-center items-center flex flex-col-reverse gap-3">
                <Button
                  onClick={() => {
                    exportToExcel(data, additionalDataResult);
                    setExcelWarning(false);
                  }}
                  className="w-full"
                  variant="secondary"
                >
                  Export Vacant Data
                </Button>
                <Button
                  onClick={() => {
                    exportToExcel(data);
                    setExcelWarning(false);
                  }}
                  className={cn("w-full")}
                >
                  Export Data
                </Button>
              </div>
            </>
          </div>
        </DrawerContent>
      </Drawer>
      {!showExcelWarning && isOpen && !isPending && (
        <Drawer open onOpenChange={() => {}} modal={false}>
          <DrawerContent className={cn("[&>div:first-child]:hidden")}>
            <DrawerHeader className="sr-only">
              <DialogTitle className="border-b pb-4">EXPORT DATA</DialogTitle>
            </DrawerHeader>
            <DrawerFooter className="grid grid-cols-2 w-full pb-8">
              {!canExport ? (
                <>
                  <Tooltip
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
                    onClick={() => {
                      exportToKml(data);
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
                      exportToExcel(data);
                    }}
                  >
                    <div className="flex flex-row items-center gap-3">
                      <IoCloudDownloadOutline className="size-4" />
                      Export Data
                    </div>
                  </Button>
                </>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      <div className="flex lg:hidden w-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3 w-full border-b border-b-primary-main-200 pb-2">
          <div className="space-y-1">
            <p className="font-medium text-lg">{data.owner}</p>
            <p className="text-xs text-grey-600">Business owner</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-grey-600">Parcel Number:</p>
            <p className="font-medium text-sm">#{data.parcelNumberNoFormatting}</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <li>
            <p className="text-xs text-grey-600">Acreage:</p>
            <p className="text-xs">{data.acreage.toFixed(2)}</p>
          </li>
          <li>
            <p className="text-xs text-grey-600">VOLT Value Per Acreage:</p>
            <p className="text-xs">{moneyFormatter.format(data.pricePerAcreage)}</p>
          </li>
          <li>
            <p className="text-xs text-grey-600">Volt Value:</p>
            <p className="text-xs">{moneyFormatter.format(data.price)}</p>
          </li>
          <li>
            <p className="text-xs text-grey-600">State/county:</p>
            <p className="text-xs">
              {data.state.label}/{data.county.label}
            </p>
          </li>
          <li>
            <p className="text-xs text-grey-600">Property Type:</p>
            <p className="text-xs">{data.propertyType || "N/A"}</p>
          </li>
          <li>
            <p className="text-xs text-grey-600">Search date:</p>
            <p className="text-xs">{moment(data.createdAt).format("DD/DD/yyyy")}</p>
          </li>
        </ul>
        <div style={{ aspectRatio: "2/1" }} className="bg-primary-main-100 w-full max-h-80 rounded-lg [&>div]:rounded-lg">
          <SearchItemDetailsMobileMap
            propertiesUsedForCalculation={data.propertiesUsedForCalculation
              .map((el) =>
                el.isBulked
                  ? el.data.properties.map((childEl) => ({
                      latitude: childEl.lat,
                      longitude: childEl.lon,
                      parcelNumberNoFormatting: childEl.parcelNumberNoFormatting,
                    }))
                  : {
                      latitude: el.data.lat,
                      longitude: el.data.lon,
                      parcelNumberNoFormatting: el.data.parcelNumberNoFormatting,
                    }
              )
              .flat()}
            sellingPropertyData={{
              latitude: data.lat,
              longitude: data.lon,
              parcelNumberNoFormatting: data.parcelNumberNoFormatting,
            }}
            highlightParcelNumber={data.parcelNumberNoFormatting}
          />
        </div>
        <Button
          id="user-searches-see-more-btn"
          className="h-9 w-full bg-primary-main/20 hover:bg-primary-main/30 text-primary-main"
          loading={isPending}
          onClick={() => {
            // startTransition(() => {
            const newParams = new URLSearchParams(params.toString());
            newParams.set("fullView", "true");
            router.push(`${pathname}/${data.id}`);
            // });
          }}
        >
          See More
        </Button>
      </div>
    </>
  );
};

export default SearchItemDetailsMobileContent;
