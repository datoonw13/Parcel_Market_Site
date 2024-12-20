import { moneyFormatter } from "@/helpers/common";
import { IBulkPropertiesUsedForCalculation, IPropertyUsedForCalculation } from "@/types/property";
import { clsx, ClassValue } from "clsx";
import moment from "moment";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { saveAs } from "file-saver";
import XLSX from "sheetjs-style";
import { IUserRecentSearches } from "@/types/user";
import { PolygonProps } from "react-leaflet";
import { Polygon } from "geojson";

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

export const exportToKml = (data: IUserRecentSearches) => {
  const allProperties = data.propertiesUsedForCalculation.map((el) => (el.isBulked ? el.data.properties : el.data)).flat();
  const mainLandSaleHistory = allProperties.filter((el) => el.parcelNumberNoFormatting === data.parcelNumberNoFormatting);

  const mainLandKml = `
     <Placemark>
        <name>Subject property</name>
        <styleUrl>#selling-property-polygon</styleUrl>
        <description>
          <![CDATA[
            <p style='color:black; font-size:16px; font-weight:600;font-family:sans-serif'>Subject property details:<p/>
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Owner: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${data.owner}</span>
            </p>
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Acreage: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${data.acreage.toFixed(2)}</span>
            </p>
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>VOLT Value Per Acre: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moneyFormatter.format(
              data.pricePerAcreage
            )}</span>
            </p>
            ${mainLandSaleHistory.length > 0 ? "<br/>" : ""}
            ${
              mainLandSaleHistory.length > 0
                ? "<p style='color:black; font-size:16px; font-weight:600;font-family:sans-serif'>Sales history:<p/>"
                : ""
            }
            ${mainLandSaleHistory.map(
              (el) => `
                <div>
                  <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Last Sale Date: 
                  <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moment(el.lastSaleDate).format(
                    "MM-DD-YYYY"
                  )}</span></p>
                  <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Sold Price Per Acre: 
                   <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moneyFormatter.format(
                     el.pricePerAcreage
                   )}</span>
                  </p>
                </div>
                <hr />
                `
            )}
          ]]>
        </description>
        <Style>
            <IconStyle>
                <scale>1</scale>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/pushpin/grn-pushpin.png</href>
                </Icon>
            </IconStyle>
        </Style>
        <LabelStyle>
            <color>ffffffff</color>
            <scale>0.2</scale>
        </LabelStyle>
        <Point>
            <altitudeMode>clampToGround</altitudeMode>
            <extrude>0</extrude>
            <coordinates>${data.lon},${data.lat},0</coordinates>
        </Point>
      </Placemark>
  `;

  const kmlContent: string[] = [mainLandKml];

  const colors: string[] = ["blue", "ltblu", "pink", "purple", "ylw"];
  const coloredProperties = data.propertiesUsedForCalculation
    .map((el, elI) =>
      el.isBulked
        ? el.data.properties.map((x) => ({
            ...x,
            color: colors[(elI % colors.length) as keyof typeof colors],
            isBulked: true,
          }))
        : { ...el.data, color: "red", isBulked: false }
    )
    .flat();

  coloredProperties
    .filter((el) => !mainLandSaleHistory.find((x) => el.parcelNumberNoFormatting === x.parcelNumberNoFormatting))
    .forEach((item) => {
      const kmlItem = `
     <Placemark>
        <name>${item.isBulked ? `Bulk Sale - ${moment(item.lastSaleDate).format("MM-DD-YYYY")}` : ""}</name>
        <styleUrl>#selling-property-polygon</styleUrl>
        <description>
          <![CDATA[
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Parcel Number: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${item.parcelNumberNoFormatting}</span>
            </p>
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Acreage: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${item.acreage.toFixed(2)}</span>
            </p>
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Last Sale Date: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moment(item.lastSaleDate).format(
              "MM-DD-YYYY"
            )}</span>
            </p>
              <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Sold Price Per Acreage: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moneyFormatter.format(
              item.pricePerAcreage
            )}</span>
            </p>
          ]]>
        </description>
        <Style>
            <IconStyle>
                <scale>1</scale>
                <Icon>
                     <href>http://maps.google.com/mapfiles/kml/paddle/${item.color}-blank.png</href>
                </Icon>
            </IconStyle>
        </Style>
        <LabelStyle>
            <color>ffffffff</color>
            <scale>0.2</scale>
        </LabelStyle>
        <Point>
            <altitudeMode>clampToGround</altitudeMode>
            <extrude>0</extrude>
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

export const exportToExcel = (data: IUserRecentSearches, additionalDataResult?: IUserRecentSearches) => {
  const wb = XLSX.utils.book_new();

  const list = [...(data.propertiesUsedForCalculation || []), ...(additionalDataResult?.propertiesUsedForCalculation || [])].sort(
    (a, b) => {
      const aPrice = a.data.pricePerAcreage || a.data.pricePerAcreage;
      const bPrice = b.data.pricePerAcreage || b.data.pricePerAcreage;

      return aPrice - bPrice;
    }
  );

  const formattedData: Array<Record<string, any>> = [];

  list.forEach((property) => {
    if (!property.isBulked && !property.data.isMedianValid) {
      formattedData.push({
        "Parcel ID": { s: { fill: { fgColor: { rgb: "FEFAEB" } } }, v: property.data.parcelNumberNoFormatting },
        County: { s: { fill: { fgColor: { rgb: "FEFAEB" } } }, v: property.data.county.label },
        Acreage: { s: { fill: { fgColor: { rgb: "FEFAEB" } } }, v: property.data.acreage.toFixed(2) },
        "Sold price": { s: { fill: { fgColor: { rgb: "FEFAEB" } } }, v: moneyFormatter.format(property.data.lastSalePrice) },
        "Sold price per acre": { s: { fill: { fgColor: { rgb: "FEFAEB" } } }, v: moneyFormatter.format(property.data.pricePerAcreage) },
        "Last sale date": { s: { fill: { fgColor: { rgb: "FEFAEB" } } }, v: moment(property.data.lastSaleDate).format("MM-DD-YYYY") },
      });
    }

    if (!property.isBulked && property.data.isMedianValid) {
      formattedData.push({
        "Parcel ID": { v: property.data.parcelNumberNoFormatting },
        County: { v: property.data.county.label },
        Acreage: { v: property.data.acreage.toFixed(2) },
        "Sold price": { v: moneyFormatter.format(property.data.lastSalePrice) },
        "Sold price per acre": { v: moneyFormatter.format(property.data.pricePerAcreage) },
        "Last sale date": { v: moment(property.data.lastSaleDate).format("MM-DD-YYYY") },
      });
    }

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
          "Sold price": { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: "" },
          "Sold price per acre": { s: { fill: { fgColor: { rgb: "9FD1B3" } } }, v: moneyFormatter.format(childProperty.pricePerAcreage) },
          "Last sale date": {
            s: { fill: { fgColor: { rgb: "9FD1B3" } } },
            v: moment(childProperty.lastSaleDate).format("MM-DD-YYYY"),
          },
        });
      });
    }
  });

  const headers = ["Parcel ID", "County", "Acreage", "Sold price", "Sold price per acre", "Last sale date"];
  const ws = XLSX.utils.json_to_sheet(formattedData, {
    header: headers,
  });

  const flattenData = list.map((el) => (el.isBulked ? el.data.properties : el.data)).flat();
  const maxLengthData = {
    parcelNumber: Math.max(
      [...flattenData].sort((a, b) => b.parcelNumberNoFormatting.length - a.parcelNumberNoFormatting.length)[0].parcelNumberNoFormatting
        .length,
      headers[0].length
    ),
    county: Math.max(
      [...flattenData].sort((a, b) => b.county.label.length - a.county.label.length)[0].county.label.length,
      headers[1].length
    ),
    acreage: Math.max(
      [...flattenData].sort((a, b) => b.acreage.toString().length - a.acreage.toString().length)[0].acreage.toString().length,
      headers[2].length
    ),
    lastSalePrice: Math.max(
      [...flattenData].sort((a, b) => b.lastSalePrice!.toString().length - a.lastSalePrice!.toString().length)[0].lastSalePrice!.toString()
        .length,
      headers[3].length
    ),
    pricePerAcre: Math.max(
      [...flattenData]
        .sort((a, b) => b.pricePerAcreage.toString().length - a.pricePerAcreage.toString().length)[0]
        .pricePerAcreage.toString().length,
      headers[4].length
    ),
    lastSaleDate: Math.max(
      [...flattenData].sort((a, b) => b.lastSaleDate!.toString().length - a.lastSaleDate!.toString().length)[0].lastSaleDate!.toString()
        .length,
      headers[5].length
    ),
  };

  ws["!cols"] = Object.values(maxLengthData).map((el) => ({ width: el + 3 }));

  XLSX.utils.book_append_sheet(wb, ws, "sheet1");

  XLSX.writeFile(wb, `${data.state.label}/${data.county.label}/${data.acreage.toFixed(2)}/${moneyFormatter.format(data.price)}.xlsx`);
};

export function swapPolygonCoordinates(polygon: any) {
  return polygon.map((item: any) => {
    if (Array.isArray(item[0])) {
      // If the first element is an array, recursively process it
      return swapPolygonCoordinates(item);
    }
    // Otherwise, swap the coordinate pair
    const [x, y] = item;
    return [y, x];
  });
}
