import { moneyFormatter } from "@/helpers/common";
import { IPropertyUsedForCalculation } from "@/types/property";
import { clsx, ClassValue } from "clsx";
import moment from "moment";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isElementVisible(elementId: string, scrollId: string) {
  const rect = document.getElementById(elementId)?.getBoundingClientRect();

  const containerRect = document.querySelector(`#${scrollId}>div`)?.getBoundingClientRect();

  if (!containerRect || !rect) {
    return false;
  }
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
}

export const parseSearchParams = <T extends z.ZodTypeAny>(schema: T, searchParams: ReadonlyURLSearchParams) => {
  try {
    const params = new URLSearchParams(searchParams.toString());
    const searchParamsObj: Record<string, string> = {};

    Array.from(params).forEach(([key, value]) => {
      if (key && value) {
        searchParamsObj[key] = value;
      }
    });
    return schema.parse(searchParamsObj) as z.infer<T>;
  } catch (error) {
    return null;
  }
};

export const updateSearchParamsWithFilters = <T extends {}>(
  data: Array<{
    key: keyof T;
    value?: T[keyof T] | null;
    resetKey?: keyof T;
  }>,
  currentSearchParams: string
) => {
  const params = new URLSearchParams(currentSearchParams.toString());
  data.forEach((item) => {
    if (item.value) {
      params.set(item.key.toString(), item.value!.toString());
    } else {
      params.delete(item.key.toString());
    }
    if (item.resetKey) {
      params.delete(item.resetKey.toString());
    }
  });
  return params;
};

export const exportToKml = (
  mainLandData: {
    parcelNumberNoFormatting: string;
    lat: number;
    lon: number;
    owner: string;
    acreage: number;
    pricePerAcreage: number;
    price: number;
    state: string;
    county: string;
  },
  propertiesUsedForCalculation: {
    parcelNumberNoFormatting: string;
    lat: number;
    lon: number;
    lastSaleDate: Date;
    pricePerAcreage: number;
    acreage: number;
  }[]
) => {
  const mainLandSaleHistory = propertiesUsedForCalculation.filter(
    (el) => el.parcelNumberNoFormatting === mainLandData.parcelNumberNoFormatting
  );

  const mainLandKml = `
  <Placemark>
    <name>
    </name>
     <description>
    <![CDATA[
      <p>Owner: <b>${mainLandData.owner}</b></p>
      <p>Acreage: <b>${mainLandData.acreage.toFixed(2)}</b></p>
      <p>VOLT Value Per Acre: <b>${moneyFormatter.format(mainLandData.pricePerAcreage)}</b></p>
       ${mainLandSaleHistory.length > 0 ? "<br/>" : ""}
       ${mainLandSaleHistory.length > 0 ? "<b>Sales History<b/>" : ""}
      ${mainLandSaleHistory.map(
        (el) => `<div>
          <p>Last Sale Date: <b>${moment(el.lastSaleDate).format("MM-DD-YYYY")}</b></p>
        <p>VOLT Value Per Acre: <b>${moneyFormatter.format(el.pricePerAcreage)}</b></p>
        </div>`
      )}
    ]]>
  </description>
    <Point>
      <coordinates>${mainLandData.lon},${mainLandData.lat},0</coordinates>
    </Point>
  </Placemark>
  `;

  const kmlContent: string[] = [mainLandKml];
  propertiesUsedForCalculation
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
        <p>VOLT Value Per Acre: <b>${moneyFormatter.format(item.pricePerAcreage)}</b></p>
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
  saveAs(
    blob,
    `${mainLandData.state}/${mainLandData.county}/${mainLandData.acreage.toFixed(2)}/${moneyFormatter.format(mainLandData.price)}.kml`
  );
};

export const exportToExcel = (propertiesUsedForCalculation: IPropertyUsedForCalculation[]) => {
  const HEADER_ROWS = [
    { label: "Parcel ID", key: "parcelNumber" as const },
    { label: "County", key: "county" as const },
    { label: "Acreage", key: "acreage" as const },
    { label: "Sold Price", key: "lastSalePrice" as const },
    { label: "VOLT Value Per Acre", key: "pricePerAcre" as const },
    { label: "Last Sale Date", key: "lastSaleDate" as const },
  ];

  const ws = XLSX.utils.json_to_sheet(
    propertiesUsedForCalculation.map((el) => ({
      parcelNumber: el.parcelNumberNoFormatting,
      county: el.county.label,
      acreage: el.acreage,
      lastSalePrice: moneyFormatter.format(Number(el.lastSalePrice)),
      pricePerAcre: moneyFormatter.format(el.pricePerAcreage),
      lastSaleDate: el.lastSaleDate,
    }))
  );
  const maxLengthData = {
    parcelNumber: [...propertiesUsedForCalculation].sort((a, b) => b.parcelNumberNoFormatting.length - a.parcelNumberNoFormatting.length)[0]
      .parcelNumberNoFormatting.length,
    county: [...propertiesUsedForCalculation].sort((a, b) => b.county.label.length - a.county.label.length)[0].county.label.length,
    acreage: [...propertiesUsedForCalculation]
      .sort((a, b) => b.acreage.toString().length - a.acreage.toString().length)[0]
      .acreage.toString().length,
    lastSalePrice: [...propertiesUsedForCalculation]
      .sort((a, b) => b.lastSalePrice!.toString().length - a.lastSalePrice!.toString().length)[0]
      .lastSalePrice!.toString().length,
    pricePerAcre: [...propertiesUsedForCalculation]
      .sort((a, b) => b.pricePerAcreage.toString().length - a.pricePerAcreage.toString().length)[0]
      .pricePerAcreage.toString().length,
    lastSaleDate: [...propertiesUsedForCalculation]
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
