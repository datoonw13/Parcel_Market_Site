"use client";

import VoltPriceCalculationAxis from "@/components/volt/volt-calculation-axis";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, exportToExcel, exportToKml } from "@/lib/utils";
import NoAuthorizationSvg from "../../../../../../public/no-authorization.svg";
import RecentSearchesMap from "../map";

interface RecentSearchesLitItemDesktopProps {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  openSubscriptionWarning: () => void;
  isUserSubscriptionTrial?: boolean;
}

const RecentSearchesLitItemDesktop: FC<RecentSearchesLitItemDesktopProps> = ({
  data,
  user,
  openSubscriptionWarning,
  isUserSubscriptionTrial,
}) => {
  const router = useRouter();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });

  return (
    <div className="hidden lg:flex py-3 px-6 gap-6 flex-col">
      <ul className="list-disc marker:primary-main-400 px-4 grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-3 gap-y-3 gap-x-10">
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
          <p className="truncate text-sm text-grey-600 font-medium">
            VOLT Value Per Acre: <span className="text-sm text-black font-medium">{moneyFormatter.format(data.pricePerAcreage)}</span>
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
        <RecentSearchesMap
          data={data}
          mapInteraction={mapInteraction}
          setMpaInteraction={setMpaInteraction}
          openWarningModal={openSubscriptionWarning}
          user={user}
        />
      </div>
      <VoltPriceCalculationAxis
        responsiveBreakpoint="2xl"
        voltValue={data.price}
        user={user}
        mapInteraction={mapInteraction}
        setMpaInteraction={setMpaInteraction}
        setOpenPropertyDetailWarningModal={openSubscriptionWarning}
        data={
          data.propertiesUsedForCalculation.map((el) => ({
            parcelNumberNoFormatting: el.parcelNumberNoFormatting,
            acreage: el.acreage,
            price: el.lastSalePrice,
            pricePerAcre: el.pricePerAcreage,
            isMainLand: el.parcelNumberNoFormatting === data.parcelNumberNoFormatting,
          })) || []
        }
      />

      {user && user.isSubscribed && (
        <div className="border rounded-2xl">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="text-black font-normal bg-grey-30 rounded-tl-2xl">Parcel ID</TableHead>
                <TableHead className="text-black font-normal bg-grey-30">County</TableHead>
                <TableHead className="text-black font-normal bg-grey-30">Acreage</TableHead>
                <TableHead className="text-black font-normal bg-grey-30">Sold Price</TableHead>
                <TableHead className="text-black font-normal bg-grey-30">VOLT Value Per Acre</TableHead>
                <TableHead className="text-black font-normal bg-grey-30 rounded-tr-2xl">Last sale date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.propertiesUsedForCalculation.map((el) => (
                <TableRow
                  className={cn(
                    mapInteraction.hoveredParcelNumber === el.parcelNumberNoFormatting && "bg-grey-30",
                    mapInteraction.openPopperParcelNumber === el.parcelNumberNoFormatting && "bg-grey-50",
                    `${mapInteraction.openPopperParcelNumber === el.parcelNumberNoFormatting}`
                  )}
                  key={el.id}
                  onMouseEnter={() => {
                    setMpaInteraction((prevData) => ({
                      ...prevData,
                      hoveredParcelNumber: el.parcelNumberNoFormatting,
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
                  onClick={() => {
                    if ((!user || !user.isSubscribed) && el.parcelNumberNoFormatting !== data.parcelNumberNoFormatting) {
                      openSubscriptionWarning();
                    } else {
                      setMpaInteraction((prevData) => ({
                        ...prevData,
                        openPopperParcelNumber: el.parcelNumberNoFormatting,
                      }));
                    }
                  }}
                >
                  <TableCell>{el.parcelNumberNoFormatting}</TableCell>
                  <TableCell>{el.county.label}</TableCell>
                  <TableCell>{el.acreage.toFixed(2)}</TableCell>
                  <TableCell>{moneyFormatter.format(el.lastSalePrice)}</TableCell>
                  <TableCell>{moneyFormatter.format(el.pricePerAcreage)}</TableCell>
                  <TableCell>{moment(el.lastSaleDate).format("MM/DD/YYYY")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          <>
            <Tooltip
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

            <Tooltip
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
          </>
        ) : (
          <>
            <Button
              className=""
              variant="secondary"
              onClick={() => {
                exportToKml(
                  {
                    acreage: data.acreage,
                    county: data.county.label,
                    lat: data.lat,
                    lon: data.lon,
                    owner: data.owner,
                    parcelNumberNoFormatting: data.parcelNumberNoFormatting,
                    price: data.price,
                    pricePerAcreage: data.pricePerAcreage,
                    state: data.state.label,
                  },
                  data.propertiesUsedForCalculation.map(
                    ({ acreage, lat, lon, lastSaleDate, parcelNumberNoFormatting, pricePerAcreage }) => ({
                      acreage,
                      lastSaleDate,
                      lat,
                      lon,
                      parcelNumberNoFormatting,
                      pricePerAcreage,
                    })
                  )
                );
              }}
            >
              <div className="flex flex-row items-center gap-3">
                <IoEarthSharp className="size-4 text-info" />
                Export Map
              </div>
            </Button>
            <Button className="" onClick={() => exportToExcel(data.propertiesUsedForCalculation)}>
              <div className="flex flex-row items-center gap-3">
                <IoCloudDownloadOutline className="size-4" />
                Export Data
              </div>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentSearchesLitItemDesktop;
