"use client";

import VoltPriceCalculationAxis from "@/components/volt/volt-calculation-axis";
import { moneyFormatter } from "@/helpers/common";
import { IUserBaseInfo } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, exportToExcel, exportToKml } from "@/lib/utils";
import { IVoltPriceCalculation } from "@/types/volt";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialogs/dialog";
import NoAuthorizationSvg from "../../../../../../public/no-authorization.svg";
import SearchItemDetailsDesktopContentMap from "./map-desktop";
import SearchItemDetailsTable from "./calculation-table";

interface SearchItemDetailsDesktopContentProps {
  data: IUserRecentSearches;
  additionalDataResult: IUserRecentSearches;
  user: IUserBaseInfo | null;
  openSubscriptionWarning: () => void;
  isUserSubscriptionTrial?: boolean;
}

const getAxisData = (data?: IVoltPriceCalculation["propertiesUsedForCalculation"], sellingLandParcelNumberNoFormatting?: string) => {
  const result: Array<{
    parcelNumberNoFormatting: string;
    acreage: number;
    price: number;
    pricePerAcre: number;
    isMainLand: boolean;
  }> = [];

  if (!data || !sellingLandParcelNumberNoFormatting) {
    return [];
  }

  data.forEach((property) => {
    if (property.isBulked) {
      result.push({
        acreage: property.data.acreage,
        isMainLand: property.data.parcelNumberNoFormatting.includes(sellingLandParcelNumberNoFormatting),
        parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
        price: property.data.price,
        pricePerAcre: property.data.pricePerAcreage,
      });
    } else {
      result.push({
        acreage: property.data.acreage,
        isMainLand: property.data.parcelNumberNoFormatting === sellingLandParcelNumberNoFormatting,
        parcelNumberNoFormatting: property.data.parcelNumberNoFormatting,
        price: property.data.lastSalePrice,
        pricePerAcre: property.data.pricePerAcreage,
      });
    }
  });

  return result;
};

const SearchItemDetailsDesktopContent: FC<SearchItemDetailsDesktopContentProps> = ({
  data,
  user,
  openSubscriptionWarning,
  isUserSubscriptionTrial,
  additionalDataResult,
}) => {
  const router = useRouter();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const [showExcelWarning, setExcelWarning] = useState(false);

  return (
    <>
      <Dialog open={showExcelWarning} onOpenChange={(open) => !open && setExcelWarning(false)}>
        <DialogContent className={cn("rounded-xl max-w-md gap-6 p-6 z-[9999]")} closeModal={() => setExcelWarning(false)}>
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
            <div className="w-full justify-center items-center flex flex-row gap-3">
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
        </DialogContent>
      </Dialog>
      <div className="bg-grey-50 px-4 py-3 text-grey-800 text-xs">
        Vacant land parcels that have sold in the past two years, within 10 miles of the subject parcel and are of similar acreage. Yellow
        shading and yellow pins indicate sales not used in VOLT&apos;s algorithms and may be considered qualified sales
      </div>
      <div className="hidden lg:flex py-3 px-6 gap-6 flex-col">
        <ul className="list-disc marker:primary-main-400 px-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)_minmax(0,_max-content)] gap-y-3 gap-x-10 2xl:gap-x-16">
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              Owner: <span className="text-sm text-black font-medium">{data.owner}</span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              Property Type: <span className="text-sm text-black font-medium">{data.propertyType}</span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="text-sm text-grey-600 font-medium">
              VOLT Value Per Acreage: <span className="text-sm text-black font-medium">{moneyFormatter.format(data.pricePerAcreage)}</span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              State/County:{" "}
              <span className="text-sm text-black font-medium">
                {data.state.label}/{data.county.label}
              </span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              Acreage: <span className="text-sm text-black font-medium">{data.acreage.toFixed(2)}</span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              Search date: <span className="text-sm text-black font-medium">{moment(data.createdAt).format("MM-DD-YYYY")}</span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              Parcel ID: <span className="text-sm text-black font-medium">{data.parcelNumberNoFormatting}</span>
            </p>
          </li>
          <li className="text-primary-main-400">
            <p className="truncate text-sm text-grey-600 font-medium">
              Volt Value: <span className="text-sm text-black font-medium">{moneyFormatter.format(data.price)}</span>
            </p>
          </li>
        </ul>
        <div style={{ aspectRatio: "2/1" }} className="bg-primary-main-100 w-full max-h-80 rounded-lg [&>div]:rounded-lg">
          <SearchItemDetailsDesktopContentMap
            data={data}
            mapInteraction={mapInteraction}
            setMpaInteraction={setMpaInteraction}
            openWarningModal={openSubscriptionWarning}
            user={user}
            additionalDataResult={additionalDataResult}
          />
        </div>
        <VoltPriceCalculationAxis
          responsiveBreakpoint="2xl"
          voltValue={data.price}
          user={user}
          mapInteraction={mapInteraction}
          setMpaInteraction={setMpaInteraction}
          setOpenPropertyDetailWarningModal={openSubscriptionWarning}
          data={getAxisData(data.propertiesUsedForCalculation, data.parcelNumberNoFormatting)}
        />

        {user && user.isSubscribed && (
          <div className="border rounded-2xl">
            <SearchItemDetailsTable
              data={data.propertiesUsedForCalculation}
              additionalDataResult={additionalDataResult}
              mapInteraction={mapInteraction}
              setMpaInteraction={setMpaInteraction}
            />
          </div>
        )}
        {(!user || !user.isSubscribed) && (
          <div className="py-6 px-4 rounded-xl border border-primary-main-400 space-y-4 flex flex-col justify-center items-center">
            <div className="relative size-16 ">
              <Image src={NoAuthorizationSvg} alt="" fill className="w-full h-full" />
            </div>
            <div>
              <p className="text-center font-semibold">Please sign in or subscribe to see the sales data</p>
              <p className="text-center text-grey-800 text-sm">
                You will need to sign in or subscribe to view, analyze, or export sales data
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                router.push(routes.user.subscription.fullUrl);
              }}
            >
              Subscribe
            </Button>
          </div>
        )}

        <div className="flex flex-row gap-3 justify-end">
          {isUserSubscriptionTrial || !user?.isSubscribed ? (
            <Tooltip
              id="export-map-disabled-btn"
              renderButton={
                <Button disabled className="" variant="secondary">
                  <div className="flex flex-row items-center gap-3">
                    <IoEarthSharp className="size-4 text-info" />
                    Export Map
                  </div>
                </Button>
              }
              renderContent="You cannot export this data with the free plan"
            />
          ) : (
            <Button
              onClick={() => {
                exportToKml(data);
              }}
              className=""
              variant="secondary"
            >
              <div className="flex flex-row items-center gap-3">
                <IoEarthSharp className="size-4 text-info" />
                Export Map
              </div>
            </Button>
          )}
          {isUserSubscriptionTrial || !user?.isSubscribed ? (
            <Tooltip
              id="export-data-disabled-btn"
              renderButton={
                <Button disabled className="">
                  <div className="flex flex-row items-center gap-3">
                    <IoCloudDownloadOutline className="size-4" />
                    Export Data
                  </div>
                </Button>
              }
              renderContent="You cannot export this data with the free plan"
            />
          ) : (
            <Button
              className=""
              onClick={() => {
                exportToExcel(data, additionalDataResult);
                // setExcelWarning(true);
              }}
            >
              <div className="flex flex-row items-center gap-3">
                <IoCloudDownloadOutline className="size-4" />
                Export Data
              </div>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchItemDetailsDesktopContent;
