import { moneyFormatter } from "@/helpers/common";
import { IBulkPropertiesUsedForCalculation, IPropertyUsedForCalculation } from "@/types/property";
import { clsx, ClassValue } from "clsx";
import moment from "moment";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { saveAs } from "file-saver";
import XLSX from "sheetjs-style";

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

export const exportToExcel = (propertiesUsedForCalculation: (IPropertyUsedForCalculation | IBulkPropertiesUsedForCalculation)[]) => {
  const wb = XLSX.utils.book_new();

  const formattedData: Array<Record<string, any>> = [];
  propertiesUsedForCalculation.forEach((property) => {
    if (property.isBulked) {
      formattedData.push({
        "Parcel ID": { s: { fill: { fgColor: { rgb: "757474" } } }, v: "Multiple parcels" },
        County: { s: { fill: { fgColor: { rgb: "757474" } } }, v: property.data.county.label },
        Acreage: { s: { fill: { fgColor: { rgb: "757474" } } }, v: property.data.acreage.toFixed(2) },
        "Sold price": { s: { fill: { fgColor: { rgb: "757474" } } }, v: moneyFormatter.format(property.data.price) },
        "Sold price per acre": { s: { fill: { fgColor: { rgb: "757474" } } }, v: moneyFormatter.format(property.data.pricePerAcreage) },
        "Last sale date": {
          s: { fill: { fgColor: { rgb: "757474" } } },
          v: moment(property.data.properties[0].lastSaleDate).format("MM-DD-YYYY"),
        },
      });
      property.data.properties.forEach((childProperty) => {
        formattedData.push({
          "Parcel ID": { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: childProperty.parcelNumberNoFormatting },
          County: { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: childProperty.county.label },
          Acreage: { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: childProperty.acreage.toFixed(2) },
          "Sold price": { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: moneyFormatter.format(childProperty.pricePerAcreage) },
          "Sold price per acre": { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: moneyFormatter.format(childProperty.pricePerAcreage) },
          "Last sale date": {
            s: { fill: { fgColor: { rgb: "9FD1B3" } } },
            v: moment(childProperty.lastSaleDate).format("MM-DD-YYYY"),
          },
        });
      });
    } else {
      formattedData.push({
        "Parcel ID": { v: property.data.parcelNumberNoFormatting },
        County: { v: property.data.county.label },
        Acreage: { v: property.data.acreage.toFixed(2) },
        "Sold price": { v: moneyFormatter.format(property.data.lastSalePrice) },
        "Sold price per acre": { v: moneyFormatter.format(property.data.pricePerAcreage) },
        "Last sale date": { v: moment(property.data.lastSaleDate).format("MM-DD-YYYY") },
      });
    }
  });

  const ws = XLSX.utils.json_to_sheet(formattedData, {
    header: ["Parcel ID", "County", "Acreage", "Sold price", "Sold price per acre", "Last sale date"],
  });

  const flattenData = propertiesUsedForCalculation.map((el) => (el.isBulked ? el.data.properties : el.data)).flat();
  const maxLengthData = {
    parcelNumber: [...flattenData].sort((a, b) => b.parcelNumberNoFormatting.length - a.parcelNumberNoFormatting.length)[0]
      .parcelNumberNoFormatting.length,
    county: [...flattenData].sort((a, b) => b.county.label.length - a.county.label.length)[0].county.label.length,
    acreage: [...flattenData].sort((a, b) => b.acreage.toString().length - a.acreage.toString().length)[0].acreage.toString().length,
    lastSalePrice: [...flattenData]
      .sort((a, b) => b.lastSalePrice!.toString().length - a.lastSalePrice!.toString().length)[0]
      .lastSalePrice!.toString().length,
    pricePerAcre: [...flattenData]
      .sort((a, b) => b.pricePerAcreage.toString().length - a.pricePerAcreage.toString().length)[0]
      .pricePerAcreage.toString().length,
    lastSaleDate: [...flattenData]
      .sort((a, b) => b.lastSaleDate!.toString().length - a.lastSaleDate!.toString().length)[0]
      .lastSaleDate!.toString().length,
  };

  ws["!cols"] = Object.values(maxLengthData).map((el) => ({ width: el + 3 }));

  XLSX.utils.book_append_sheet(wb, ws, "sheet1");

  XLSX.writeFile(wb, `${new Date()}.xlsx`);
};
