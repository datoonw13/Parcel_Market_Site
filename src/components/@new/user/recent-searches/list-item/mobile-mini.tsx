import { Button } from "@/components/ui/button";
import { moneyFormatter } from "@/helpers/common";
import { IBulkPropertiesUsedForCalculation, IPropertyPolygon, IPropertyUsedForCalculation } from "@/types/property";
import moment from "moment";
import React, { FC } from "react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/dialogs/drawer";
import { exportToExcel, exportToKml } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import useMediaQuery from "@/hooks/useMediaQuery";
import { DialogTitle } from "@/components/ui/dialogs/dialog";
import RecentSearchesMobileListItemMap from "./map";
import { breakPoints } from "../../../../../../tailwind.config";

interface RecentSearchesLitItemMobileMiniProps {
  data: {
    owner: string;
    parcelNumberNoFormatting: string;
    acreage: number;
    pricePerAcre: number;
    voltPrice: number;
    state: string;
    county: string;
    propertyType: string;
    searchDate: Date;
    lat: number;
    lon: number;
    polygon: IPropertyPolygon["polygon"];
    price: number;
    pricePerAcreage: number;
  };
  isOpen: boolean;
  propertiesUsedForCalculation: (IPropertyUsedForCalculation | IBulkPropertiesUsedForCalculation)[];
  onView: () => void;
  canExport: boolean;
}

const RecentSearchesLitItemMobileMini: FC<RecentSearchesLitItemMobileMiniProps> = ({
  data,
  propertiesUsedForCalculation,
  onView,
  isOpen,
  canExport,
}) => {
  const { targetReached: isVisible } = useMediaQuery(parseFloat(breakPoints.lg));
  const { acreage, county, owner, pricePerAcre, propertyType, searchDate, state, voltPrice, parcelNumberNoFormatting } = data;

  return (
    isVisible && (
      <>
        {isOpen && (
          <Drawer open onOpenChange={() => {}} modal={false}>
            <DrawerContent className="[&>div:first-child]:hidden">
              <DrawerHeader className="sr-only">
                <DialogTitle className="border-b pb-4">EXPORT DATA</DialogTitle>
              </DrawerHeader>
              <DrawerFooter className="flex flex-row w-full pb-8">
                {!canExport ? (
                  <>
                    <Tooltip
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
                        // exportToKml(
                        //   {
                        //     acreage: data.acreage,
                        //     county: data.county,
                        //     lat: data.lat,
                        //     lon: data.lon,
                        //     owner: data.owner,
                        //     parcelNumberNoFormatting: data.parcelNumberNoFormatting,
                        //     price: data.price,
                        //     pricePerAcreage: data.pricePerAcreage,
                        //     state: data.state,
                        //   },
                        //   propertiesUsedForCalculation.map(
                        //     ({ acreage, lat, lon, lastSaleDate, parcelNumberNoFormatting, pricePerAcreage }) => ({
                        //       acreage,
                        //       lastSaleDate,
                        //       lat,
                        //       lon,
                        //       parcelNumberNoFormatting,
                        //       pricePerAcreage,
                        //     })
                        //   )
                        // );
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
                        //  exportToExcel(propertiesUsedForCalculation)
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
              <p className="font-medium text-lg">{owner}</p>
              <p className="text-xs text-grey-600">Business owner</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-grey-600">Parcel Number:</p>
              <p className="font-medium text-sm">#{parcelNumberNoFormatting}</p>
            </div>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <li>
              <p className="text-xs text-grey-600">Acreage:</p>
              <p className="text-xs">{acreage.toFixed(2)}</p>
            </li>
            <li>
              <p className="text-xs text-grey-600">VOLT Value Per Acreage:</p>
              <p className="text-xs">{moneyFormatter.format(pricePerAcre)}</p>
            </li>
            <li>
              <p className="text-xs text-grey-600">Volt Value:</p>
              <p className="text-xs">{moneyFormatter.format(voltPrice)}</p>
            </li>
            <li>
              <p className="text-xs text-grey-600">State/county:</p>
              <p className="text-xs">
                {state}/{county}
              </p>
            </li>
            <li>
              <p className="text-xs text-grey-600">Property Type:</p>
              <p className="text-xs">{propertyType || "N/A"}</p>
            </li>
            <li>
              <p className="text-xs text-grey-600">Search date:</p>
              <p className="text-xs">{moment(searchDate).format("DD/DD/yyyy")}</p>
            </li>
          </ul>
          <div style={{ aspectRatio: "2/1" }} className="bg-primary-main-100 w-full max-h-80 rounded-lg [&>div]:rounded-lg">
            <RecentSearchesMobileListItemMap
              propertiesUsedForCalculation={propertiesUsedForCalculation
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
          <Button className="h-9 w-full bg-primary-main/20 hover:bg-primary-main/30 text-primary-main" onClick={onView}>
            See More
          </Button>
        </div>
      </>
    )
  );
};

export default RecentSearchesLitItemMobileMini;
