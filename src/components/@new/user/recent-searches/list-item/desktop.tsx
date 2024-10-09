"use client";

import VoltPriceCalculationAxis from "@/components/volt/volt-calculation-axis";
import { moneyFormatter } from "@/helpers/common";
import { IDecodedAccessToken } from "@/types/auth";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { IoCloudDownloadOutline, IoEarthSharp } from "react-icons/io5";
import { Tooltip } from "@/components/ui/tooltip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import geo from "geojson";
// @ts-ignore
import tokml from "@maphubs/tokml";
import NoAuthorizationSvg from "../../../../../../public/no-authorization.svg";
import RecentSearchesMap from "../map";

interface RecentSearchesLitItemDesktopProps {
  data: IUserRecentSearches;
  user: IDecodedAccessToken | null;
  openSubscriptionWarning: () => void;
  isUserSubscriptionTrial?: boolean;
}

const HEADER_ROWS = [
  { label: "Parcel ID", key: "parcelNumber" as const },
  { label: "County", key: "county" as const },
  { label: "Acreage", key: "acreage" as const },
  { label: "Sold Price", key: "lastSalePrice" as const },
  { label: "Price Per Acre", key: "pricePerAcre" as const },
  { label: "Last Sale Date", key: "lastSaleDate" as const },
];

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
            Price per acreage: <span className="text-sm text-black font-medium">{moneyFormatter.format(data.pricePerAcreage)}</span>
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
                <TableHead className="text-black font-normal bg-grey-30">Price per acre</TableHead>
                <TableHead className="text-black font-normal bg-grey-30 rounded-tr-2xl">Last sale date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.propertiesUsedForCalculation.map((el) => (
                <TableRow
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
            <Button className="" variant="secondary" onClick={exportToKml}>
              <div className="flex flex-row items-center gap-3">
                <IoEarthSharp className="size-4 text-info" />
                Export Map
              </div>
            </Button>
            <Button className="" onClick={exportToExcel}>
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
