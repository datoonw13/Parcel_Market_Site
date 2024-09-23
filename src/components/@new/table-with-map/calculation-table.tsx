/* eslint-disable jsx-a11y/control-has-associated-label */

"use client";

import { useState } from "react";
import clsx from "clsx";
import moment from "moment";
import { orderBy } from "lodash";
import Image from "next/image";
import { LatLngTuple } from "leaflet";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { removeParcelNumberFormatting, moneyFormatter } from "@/helpers/common";
import geo from "geojson";
// @ts-ignore
import tokml from "@maphubs/tokml";
import { SellingPropertyDetails, UsedForPriceCalculationItem } from "@/types/property";
import { ArrowIconsUnion1 } from "../icons/ArrowIcons";
import Button from "../shared/forms/Button";
import { ExportIcon1, ExportMapIcon1 } from "../icons/ExportIcons";
import Popper from "../shared/Popper";

const HEADER_ROWS = [
  { label: "Parcel ID", key: "parcelNumber" as const },
  { label: "County", key: "county" as const },
  { label: "Acreage", key: "acreage" as const },
  { label: "Sold Price", key: "lastSalePrice" as const },
  { label: "Price Per Acre", key: "pricePerAcre" as const },
  { label: "Last Sale Date", key: "lastSaleDate" as const },
];

interface PropertyModel {
  latitude: number;
  longitude: number;
  parcelNumber: string;
  acreage: number;
  lastSalePrice: number;
  lastSaleDate: string;
  state: string;
  county: string;
}

const LandPriceCalculationTable = ({
  data,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  selectedItemParcelNumber,
  hoveredItemParcelNumber,
  isUserSubscriptionTrial,
}: {
  data: Array<PropertyModel>;
  onSelect: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
  selectedItemParcelNumber: string | null;
  hoveredItemParcelNumber: string | null;
  isUserSubscriptionTrial: boolean;
}) => {
  const [sort, setSort] = useState<{ key: typeof HEADER_ROWS[0]["key"]; dir: "asc" | "desc" }>({ key: "acreage", dir: "desc" });
  const formattedData = data.map((el) => ({
    ...el,
    county: el.county ?? "",
    pricePerAcre: Number((Number(el.lastSalePrice) / Number(el.acreage)).toFixed(2)),
  }));

  const sortedData = orderBy(formattedData, [sort.key], [sort.dir]);

  const handleSort = (key: typeof HEADER_ROWS[0]["key"]) => {
    setSort({ key, dir: sort.key === key && sort.dir === "desc" ? "asc" : "desc" });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      sortedData.map((el) => ({
        parcelNumber: el.parcelNumber,
        county: el.county,
        acreage: el.acreage,
        lastSalePrice: moneyFormatter.format(Number(el.lastSalePrice)),
        pricePerAcre: moneyFormatter.format(el.pricePerAcre),
        lastSaleDate: el.lastSaleDate,
      }))
    );
    const maxLengthData = {
      parcelNumber: [...sortedData].sort((a, b) => b.parcelNumber.length - a.parcelNumber.length)[0].parcelNumber.length,
      county: [...sortedData].sort((a, b) => b.county.length - a.county.length)[0].county.length,
      acreage: [...sortedData].sort((a, b) => b.acreage.toString().length - a.acreage.toString().length)[0].acreage.toString().length,
      lastSalePrice: [...sortedData]
        .sort((a, b) => b.lastSalePrice!.toString().length - a.lastSalePrice!.toString().length)[0]
        .lastSalePrice!.toString().length,
      pricePerAcre: [...sortedData]
        .sort((a, b) => b.pricePerAcre.toString().length - a.pricePerAcre.toString().length)[0]
        .pricePerAcre.toString().length,
      lastSaleDate: [...sortedData].sort((a, b) => b.lastSaleDate!.toString().length - a.lastSaleDate!.toString().length)[0].lastSaleDate!
        .length,
    };

    const wscols = Object.values(maxLengthData).map((el) => ({ wch: el + 10 }));

    ws["!cols"] = wscols;
    XLSX.utils.sheet_add_aoa(ws, [HEADER_ROWS.map((el) => el.label)], { origin: "A1" });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "xlsx" });
    saveAs(data, `${new Date()}.xlsx`);
  };

  const exportToKml = () => {
    const points = data.map((el) => ({ latitude: Number(el.latitude), longitude: Number(el.longitude) }));
    // @ts-ignore
    const geojsonObject = geo.parse(points, {
      Point: ["latitude", "longitude"],
      LineString: "line",
    });
    const blob = new Blob([tokml(geojsonObject)], { type: "text/plain" });
    saveAs(blob, `${new Date()}.kml`);
  };

  return (
    <div>
      <div className="w-full  border border-grey-100 rounded-2xl lg:min-w-96 relative">
        <table className={clsx("w-full hidden lg:table")}>
          <thead>
            <tr className={clsx("bg-grey-30 rounded-2xl [&>th:first-child]:rounded-tl-2xl [&>th:last-child]:rounded-tr-2xl")}>
              <th className="py-3 px-6 text-sm font-normal group cursor-pointer" align="left" />
              {HEADER_ROWS.map((item) => (
                <th className="py-3 px-6 text-sm font-normal group cursor-pointer" align="left" key={item.key}>
                  <div className="flex items-center gap-1.5" onClick={() => handleSort(item.key)}>
                    {item.label}
                    <ArrowIconsUnion1
                      className={clsx(
                        "!w-2 !h-2.5 group-hover:opacity-100 opacity-0",
                        sort.key === item.key && sort.dir === "desc"
                          ? "[&>path:first-child]:!fill-black [&>path:last-child]:!fill-grey-600"
                          : "[&>path:first-child]:!fill-grey-600 [&>path:last-child]:!fill-black"
                      )}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className="[&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:last-child]:rounded-br-2xl 
        [&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-b-grey-50"
          >
            {sortedData.map((item, itemI) => (
              <tr
                key={item.latitude + item.longitude}
                className={clsx(
                  "transition-all duration-100 cursor-pointer",
                  removeParcelNumberFormatting(selectedItemParcelNumber || "") === removeParcelNumberFormatting(item.parcelNumber) &&
                    "bg-primary-main-100",
                  removeParcelNumberFormatting(hoveredItemParcelNumber || "") === removeParcelNumberFormatting(item.parcelNumber) &&
                    "bg-primary-main-50"
                )}
                onClick={() => onSelect(item.parcelNumber)}
                onMouseEnter={() => onMouseEnter(item.parcelNumber)}
                onMouseLeave={() => onMouseLeave(item.parcelNumber)}
              >
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {itemI + 1}
                </td>
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {item.parcelNumber}
                </td>
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {item.county ?? "--"}
                </td>
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {item.acreage}
                </td>
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {moneyFormatter.format(item.lastSalePrice)}
                </td>
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {moneyFormatter.format(item.pricePerAcre)}
                </td>
                <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                  {moment(item.lastSaleDate).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full h-96 blur-md lg:hidden" />
        <div className="w-[90%] lg:hidden absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border border-grey-100 rounded-2xl p-5 space-y-6">
          <div className="relative w-16 h-14 m-auto">
            <Image src="/no-mobile-support.png" fill alt="" className="w-16 h-14 m-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">No Mobile Support</p>
            <p className="text-xs text-grey-600 text-center">
              We don’t support this information for mobile, Please open up Desktop version.
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex gap-3 mt-4 justify-end">
        <Popper
          disableSameWidth
          renderButton={(setReferenceElement, referenceElement) => (
            <div
              onMouseEnter={(e) => isUserSubscriptionTrial && setReferenceElement(referenceElement ? null : e.currentTarget)}
              onMouseLeave={(e) => isUserSubscriptionTrial && setReferenceElement(null)}
            >
              <Button
                className={clsx(isUserSubscriptionTrial && "opacity-50 relative")}
                disabled={isUserSubscriptionTrial}
                startIcon={ExportMapIcon1}
                onClick={exportToKml}
                variant="secondary"
              >
                Export Map
              </Button>
            </div>
          )}
          renderContent={(setReferenceElement) => (
            <div className="bg-black rounded-md py-1.5 px-3 text-xss text-white max-w-60 text-center font-medium">
              You cannot export this data with the free plan
            </div>
          )}
        />

        <Popper
          disableSameWidth
          renderButton={(setReferenceElement, referenceElement) => (
            <div
              onMouseEnter={(e) => isUserSubscriptionTrial && setReferenceElement(referenceElement ? null : e.currentTarget)}
              onMouseLeave={(e) => isUserSubscriptionTrial && setReferenceElement(null)}
            >
              <Button
                className={clsx(isUserSubscriptionTrial && "opacity-50")}
                disabled={isUserSubscriptionTrial}
                startIcon={ExportIcon1}
                onClick={exportToExcel}
              >
                Export Data
              </Button>
            </div>
          )}
          renderContent={(setReferenceElement) => (
            <div className="bg-black rounded-md py-1.5 px-3 text-xss text-white max-w-60 text-center font-medium">
              You cannot export this data with the free plan
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default LandPriceCalculationTable;
