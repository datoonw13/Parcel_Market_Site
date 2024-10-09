"use client";

import LandingHeader from "@/components/landing/header";
import VoltPriceCalculationAxis from "@/components/volt/volt-calculation-axis";
import VoltItem from "@/components/volt/volt-item";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import geo from "geojson";
// @ts-ignore
import tokml from "@maphubs/tokml";
import NoAuthorizationSvg from "../../../../../../public/no-authorization.svg";
import RecentSearchesMap from "../map";

const HEADER_ROWS = [
  { label: "Parcel ID", key: "parcelNumber" as const },
  { label: "County", key: "county" as const },
  { label: "Acreage", key: "acreage" as const },
  { label: "Sold Price", key: "lastSalePrice" as const },
  { label: "Price Per Acre", key: "pricePerAcre" as const },
  { label: "Last Sale Date", key: "lastSaleDate" as const },
];

const RecentSearchesLitItemMobileFull = ({
  data,
  user,
  isUserSubscriptionTrial,
  openSubscriptionWarning,
}: {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  isUserSubscriptionTrial?: boolean;
  openSubscriptionWarning: () => void;
}) => {
  const router = useRouter();
  const [mapInteraction, setMpaInteraction] = useState<MapInteractionModel>({
    hoveredParcelNumber: null,
    openPopperParcelNumber: null,
  });
  const rootRef = useRef<HTMLDivElement>(null);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.propertiesUsedForCalculation.map((el) => ({
        parcelNumber: el.parcelNumberNoFormatting,
        county: el.county.label,
        acreage: el.acreage,
        lastSalePrice: moneyFormatter.format(Number(el.lastSalePrice)),
        pricePerAcre: moneyFormatter.format(el.pricePerAcreage),
        lastSaleDate: el.lastSaleDate,
      }))
    );
    const maxLengthData = {
      parcelNumber: [...data.propertiesUsedForCalculation].sort(
        (a, b) => b.parcelNumberNoFormatting.length - a.parcelNumberNoFormatting.length
      )[0].parcelNumberNoFormatting.length,
      county: [...data.propertiesUsedForCalculation].sort((a, b) => b.county.label.length - a.county.label.length)[0].county.label.length,
      acreage: [...data.propertiesUsedForCalculation]
        .sort((a, b) => b.acreage.toString().length - a.acreage.toString().length)[0]
        .acreage.toString().length,
      lastSalePrice: [...data.propertiesUsedForCalculation]
        .sort((a, b) => b.lastSalePrice!.toString().length - a.lastSalePrice!.toString().length)[0]
        .lastSalePrice!.toString().length,
      pricePerAcre: [...data.propertiesUsedForCalculation]
        .sort((a, b) => b.pricePerAcreage.toString().length - a.pricePerAcreage.toString().length)[0]
        .pricePerAcreage.toString().length,
      lastSaleDate: [...data.propertiesUsedForCalculation]
        .sort((a, b) => b.lastSaleDate!.toString().length - a.lastSaleDate!.toString().length)[0]
        .lastSaleDate!.toString().length,
    };

    const wscols = Object.values(maxLengthData).map((el) => ({ wch: el + 10 }));

    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_aoa(ws, [HEADER_ROWS.map((el) => el.label)], { origin: "A1" });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const res = new Blob([excelBuffer], { type: "xlsx" });
    saveAs(res, `${new Date()}.xlsx`);
  };

  const exportToKml = () => {
    const mainLandSaleHistory = data.propertiesUsedForCalculation.filter(
      (el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting
    );

    const mainLandKml = `
          
    <Placemark>
      <name>
      </name>
       <description>
      <![CDATA[
        <p>Owner: <b>${data.owner}</b></p>
        <p>Acreage: <b>${data.acreage.toFixed(2)}</b></p>
        <p>Price Per Acre: <b>${moneyFormatter.format(data.pricePerAcreage)}</b></p>
         ${mainLandSaleHistory.length > 0 ? "<br/>" : ""}
         ${mainLandSaleHistory.length > 0 ? "<b>Sales History<b/>" : ""}
        ${mainLandSaleHistory.map(
          (el) => `<div>
            <p>Last Sale Date: <b>${moment(el.lastSaleDate).format("MM-DD-YYYY")}</b></p>
          <p>Price Per Acre: <b>${moneyFormatter.format(el.pricePerAcreage)}</b></p>
          </div>`
        )}
      ]]>
    </description>
      <Point>
        <coordinates>${data.lon},${data.lat},0</coordinates>
      </Point>
    </Placemark>
    `;

    const kmlContent: string[] = [mainLandKml];
    data.propertiesUsedForCalculation
      .filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting))
      .forEach((item) => {
        const kmlItem = `
      <Placemark>
        <styleUrl>#mainLandPin</styleUrl>
        <name>
        </name>
         <description>
        <![CDATA[
          <p>Parcel Number: <b>${item.parcelNumberNoFormatting}</b></p>
          <p>Acreage: <b>${item.acreage.toFixed(2)}</b></p>
          <p>Last Sale Date: <b>${moment(item.lastSaleDate).format("MM-DD-YYYY")}</b></p>
          <p>Price Per Acre: <b>${moneyFormatter.format(item.pricePerAcreage)}</b></p>
        ]]>
      </description>
        <Point>
          <coordinates>${item.lon},${item.lat},0</coordinates>
        </Point>
      </Placemark>
      `;
        kmlContent.push(kmlItem);
      });

    const kml = `<?xml version="1.0" encoding="utf-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>
         <Style id="mainLandPin">
        <IconStyle>
            <scale>1.3</scale>
            <Icon>
                <href>http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png</href>
            </Icon>
            <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
        </IconStyle>
    </Style>
          ${kmlContent.join("")}
        </Document>
      </kml>
    `;
    const blob = new Blob([kml], { type: "text/plain" });
    saveAs(blob, `${data.state.label}/${data.county.label}/${data.acreage.toFixed(2)}/${moneyFormatter.format(data.price)}.kml`);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="bg-white fixed w-full h-screen overflow-auto z-10 top-0 !m-0 left-0">
        <LandingHeader user={null} />
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
              <ul className="grid grid-cols-3 gap-3">
                <li>
                  <p className="text-xs text-grey-600">Acreage:</p>
                  <p className="text-xs">{data.acreage.toFixed(2)}</p>
                </li>
                <li>
                  <p className="text-xs text-grey-600">Per acre Price:</p>
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
                  openWarningModal={openSubscriptionWarning}
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
          <div className="space-y-4">
            <div className="">
              <h1 className="text-lg font-semibold">Recent Sales</h1>
              <h2 className="text-grey-800 text-sm">Vacant parcels sold over the past 2 years, within 10 miles, and similar acreage.</h2>
            </div>
            {user && user.isSubscribed && (
              <div className="flex flex-col gap-2">
                {data.propertiesUsedForCalculation.map((property) => (
                  <VoltItem
                    id={`calculation-${property.id}`}
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
                    key={property.id}
                    data={{
                      ...property,
                    }}
                    isHighlighted={
                      mapInteraction.hoveredParcelNumber === property.parcelNumberNoFormatting ||
                      mapInteraction.openPopperParcelNumber === property.parcelNumberNoFormatting
                    }
                  />
                ))}
              </div>
            )}
            {(!user || !user.isSubscribed) && (
              <div className="py-6 px-4 rounded-xl border border-primary-main-400 space-y-4 flex flex-col justify-center items-center">
                <div className="relative size-16 ">
                  <Image src={NoAuthorizationSvg} alt="" fill className="w-full h-full" />
                </div>
                <div>
                  <p className="text-center font-semibold">
                    {user && !user?.isSubscribed ? "You do not have an active subscription" : "Information not available"}
                  </p>
                  <p className="text-center text-grey-800 text-sm">
                    {user && !user?.isSubscribed
                      ? "If you want to see information about land, please subscribe to our service"
                      : "If you want to see all land information, please authorize"}
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
          <div className="py-4 flex flex-row gap-3 border-t">
            {isUserSubscriptionTrial || !user?.isSubscribed ? (
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
                <Button className="w-full" variant="secondary" onClick={exportToKml}>
                  <div className="flex flex-row items-center gap-3">
                    <IoEarthSharp className="size-4 text-info" />
                    Export Map
                  </div>
                </Button>
                <Button className="w-full" onClick={exportToExcel}>
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

export default RecentSearchesLitItemMobileFull;
