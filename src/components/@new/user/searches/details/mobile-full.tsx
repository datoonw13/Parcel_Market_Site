"use client";

import LandingHeader from "@/components/landing/header";
import VoltPriceCalculationAxis from "@/components/volt/volt-calculation-axis";
import VoltItem from "@/components/volt/volt-item";
import { moneyFormatter } from "@/helpers/common";
import { IUserBaseInfo } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
// @ts-ignore
import { IVoltPriceCalculation } from "@/types/volt";
import VoltItemMulti from "@/components/volt/volt-item-multi";
import ResponsiveAlertDialog from "@/components/ui/dialogs/responsive-alert-dialog";
import { cn, exportToExcel, exportToKml } from "@/lib/utils";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from "@/components/ui/dialogs/drawer";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialogs/dialog";
import RecentSearchesMap from "./map-desktop";
import NoAuthorizationSvg from "../../../../../../public/no-authorization.svg";

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

const SearchItemDetailsMobileMapFull = ({
  data,
  user,
  isUserSubscriptionTrial,
  additionalDataResult,
}: {
  data: IUserRecentSearches;
  additionalDataResult: IUserRecentSearches;
  user: IUserBaseInfo | null;
  isUserSubscriptionTrial: boolean;
}) => {
  const [subscriptionWarning, setSubscriptionWarning] = useState(false);
  const router = useRouter();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <ResponsiveAlertDialog
        mediaQuery={null}
        open={subscriptionWarning}
        closeModal={() => setSubscriptionWarning(false)}
        okButton={{
          show: true,
          label: "Continue",
          onClick: () => {
            setSubscriptionWarning(false);
            router.push(routes.user.subscription.fullUrl);
          },
        }}
        cancelButton={{ show: true, label: "Close", onClick: () => setSubscriptionWarning(false) }}
        title="Please sign in or subscribe to see the sales data"
        description="You will need to sign in or subscribe to view, analyze, or export sales data"
      />
      <Drawer open onOpenChange={() => {}} modal={false}>
        <DrawerContent className="[&>div:first-child]:hidden">
          <DrawerHeader className="sr-only">
            <DialogTitle className="border-b pb-4">EXPORT DATA</DialogTitle>
          </DrawerHeader>
          <DrawerFooter className="grid grid-cols-2 w-full pb-8">
            {!user?.isSubscribed || isUserSubscriptionTrial ? (
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
                    exportToExcel(data, additionalDataResult);
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
      <div ref={rootRef} className="bg-white fixed w-full h-screen overflow-auto z-10 top-0 !m-0 left-0 pb-28">
        <LandingHeader user={user} />
        <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] py-4 flex flex-col gap-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-lg font-semibold">Subject Parcel</h1>
              <h2 className="text-grey-800 text-sm">This is the parcel of land that you searched.</h2>
            </div>
            <div className="flex w-full flex-col gap-4 border border-[#9FD1B3] rounded-2xl p-5 bg-primary-main-50">
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
                <RecentSearchesMap
                  data={data}
                  mapInteraction={mapInteraction}
                  setMpaInteraction={setMpaInteraction}
                  openWarningModal={() => setSubscriptionWarning(true)}
                  user={user}
                />
              </div>
            </div>
          </div>
          <VoltPriceCalculationAxis
            voltValue={data.price}
            user={user}
            mapInteraction={mapInteraction}
            setMpaInteraction={setMpaInteraction}
            setOpenPropertyDetailWarningModal={() => setSubscriptionWarning(true)}
            data={getAxisData(data.propertiesUsedForCalculation, data.parcelNumberNoFormatting)}
          />
          <div className="space-y-4">
            <div className="">
              <h1 className="text-lg font-semibold">Recent Sales</h1>
              <h2 className="text-grey-800 text-sm">Vacant parcels sold over the past 2 years, within 10 miles, and similar acreage.</h2>
            </div>
            {/* {user && user.isSubscribed && (
              <>
                <div className="bg-grey-50 border border-grey-100 rounded-xl p-3 space-y-4 lg:hidden">
                  <p className="text-grey-800 text-sm">If you need additional data for your research, you can switch to another mode.</p>
                  <div className="bg-grey/10 rounded-lg p-0.5">
                    <ul className="">
                      <li className={cn("text-center text-sm h-full flex items-center justify-center cursor-pointer py-1.5 font-semibold")}>
                        View on desktop version
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {data?.propertiesUsedForCalculation.map((property) =>
                    property.isBulked ? (
                      <VoltItemMulti
                        onHover={(parcelNumberNoFormatting) => {
                          setMpaInteraction((prevData) => ({
                            ...prevData,
                            hoveredParcelNumber: parcelNumberNoFormatting,
                            zoom: true,
                          }));
                        }}
                        onMouseLeave={() => {
                          setMpaInteraction((prevData) => ({
                            ...prevData,
                            hoveredParcelNumber: null,
                            zoom: false,
                          }));
                        }}
                        onSelect={(parcelNumberNoFormatting) => {
                          setMpaInteraction((prevData) => ({
                            ...prevData,
                            openPopperParcelNumber: parcelNumberNoFormatting,
                            zoom: parcelNumberNoFormatting.includes("multiple"),
                          }));
                        }}
                        data={property}
                        key={`calculation-${property.data.id}`}
                        highlightedItemParcelNumber={mapInteraction.hoveredParcelNumber}
                        selectedItemParcelNumber={mapInteraction.openPopperParcelNumber}
                        selected={mapInteraction.openPopperParcelNumber === property.data.id}
                      />
                    ) : (
                      <VoltItem
                        id={`calculation-${property.data.id}`}
                        isSellingProperty
                        onHover={(property) => {
                          setMpaInteraction((prevData) => ({
                            ...prevData,
                            hoveredParcelNumber: property.parcelNumberNoFormatting,
                            zoom: true,
                          }));
                        }}
                        onMouseLeave={() => {
                          setMpaInteraction((prevData) => ({
                            ...prevData,
                            hoveredParcelNumber: null,
                            zoom: false,
                          }));
                        }}
                        onSelect={(property) => {
                          setMpaInteraction((prevData) => ({
                            ...prevData,
                            openPopperParcelNumber: property.parcelNumberNoFormatting,
                            zoom: false,
                          }));
                        }}
                        key={property.data.id}
                        data={{
                          ...property.data,
                        }}
                        isHighlighted={mapInteraction.hoveredParcelNumber === property.data.parcelNumberNoFormatting}
                        selected={mapInteraction.openPopperParcelNumber === property.data.parcelNumberNoFormatting}
                      />
                    )
                  )}
                </div>
              </>
            )} */}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchItemDetailsMobileMapFull;
