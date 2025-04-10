import { PropertyDataSchema } from "@/zod-validations/volt-new";
import moment from "moment";
import XLSX from "sheetjs-style";
import { z } from "zod";
import { saveAs } from "file-saver";

export const exportToExcel = (data: z.infer<typeof PropertyDataSchema>, isNonValidMedianHighlighted?: boolean) => {
  const wb = XLSX.utils.book_new();

  const list = [...data.assessments.data];

  const formattedData: Array<Record<string, any>> = [];

  list.forEach((property) => {
    if (!property.isBulked) {
      formattedData.push({
        "Parcel ID": {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: property.data.parcelNumber.formattedString,
        },
        State: {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: property.data.state.label,
        },
        County: {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: property.data.county.label,
        },
        Acreage: {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
            alignment: {
              horizontal: "left",
            },
            numFmt: "0.000",
          },
          t: "n", // Explicitly set type to number
          v: Number(property.data.acreage.value),
        },
        "Sold price": {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
            alignment: {
              horizontal: "left",
            },
            numFmt: "$#,##0",
          },
          t: "n", // Explicitly set type to number
          v: Number(property.data.lastSalePrice.value),
        },
        "Sold price per acre": {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
            alignment: {
              horizontal: "left",
            },
            numFmt: "$#,##0",
          },
          t: "n", // Explicitly set type to number
          v: Number(property.data.pricePerAcreage.value),
        },
        "Last sale date": {
          s: {
            ...(isNonValidMedianHighlighted && !property.data.isMedianValid && { fill: { fgColor: { rgb: "fdf5d8" } } }),
            border: {
              top: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: moment(property.data.lastSaleDate).format("MM-DD-YYYY"),
        },
      });
    }

    if (property.isBulked) {
      formattedData.push({
        "Parcel ID": {
          s: {
            fill: {
              fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" },
            },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: `${property.data.totalProperties} Parcels`,
        },
        State: {
          s: {
            fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" } },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: `${property.data.uniqueStates > 1 ? `${property.data.uniqueStates} States` : property.data.state.label}`,
        },
        County: {
          s: {
            fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" } },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: `${property.data.uniqueCounties > 1 ? `${property.data.uniqueCounties} Counties` : property.data.county.label}`,
        },
        Acreage: {
          s: {
            fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" } },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
            alignment: {
              horizontal: "left",
            },
            numFmt: "0.000",
          },
          t: "n", // Explicitly set type to number
          v: Number(property.data.acreage.value),
        },
        "Sold price": {
          s: {
            fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" } },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
            alignment: {
              horizontal: "left",
            },
            numFmt: "$#,##0",
          },
          t: "n", // Explicitly set type to number
          v: Number(property.data.lastSalePrice.value),
        },
        "Sold price per acre": {
          s: {
            fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" } },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
            alignment: {
              horizontal: "left",
            },
            numFmt: "$#,##0",
          },
          t: "n", // Explicitly set type to number
          v: Number(property.data.pricePerAcreage.value),
        },
        "Last sale date": {
          s: {
            fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf5d8" : "f4f4f4" } },
            font: { bold: true },
            border: {
              top: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              bottom: { style: "thin", color: { rgb: property.data.hasSellingProperty ? "0e8b40" : "#e5e7eb" } },
              left: { style: "thin", color: { rgb: "#e5e7eb" } },
              right: { style: "thin", color: { rgb: "#e5e7eb" } },
            },
          },
          v: moment(property.data.properties[0].lastSaleDate).format("MM-DD-YYYY"),
        },
      });
      property.data.properties.forEach((childProperty) => {
        formattedData.push({
          "Parcel ID": {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${childProperty.parcelNumber.formattedString}`,
          },
          State: {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${childProperty.state.label}`,
          },
          County: {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${childProperty.county.label}`,
          },
          Acreage: {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
              alignment: {
                horizontal: "left",
              },
              numFmt: "    0.000",
            },
            t: "n", // Explicitly set type to number
            v: Number(childProperty.acreage.value),
          },
          "Sold price": {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
              alignment: {
                horizontal: "left",
              },
              numFmt: "$#,##0",
            },
            v: "",
          },
          "Sold price per acre": {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
              alignment: {
                horizontal: "left",
              },
              numFmt: "   $#,##0",
            },
            v: "",
          },
          "Last sale date": {
            s: {
              fill: { fgColor: { rgb: "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${moment(childProperty.lastSaleDate).format("MM-DD-YYYY")}`,
          },
        });
      });
    }
  });

  const headers = ["Parcel ID", "State", "County", "Acreage", "Sold price", "Sold price per acre", "Last sale date"];
  const ws = XLSX.utils.json_to_sheet(formattedData, {
    header: headers,
  });

  ["A1", "B1", "C1", "D1", "E1", "F1"].forEach((key) => {
    ws[key].s = {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "f8f8f8" },
      },
      font: {
        sz: 13,
        color: { rgb: "#FF000000" },
        bold: true,
      },
    };
  });

  const flattenData = list.map((el) => (el.isBulked ? el.data.properties : el.data)).flat();
  const maxLengthData = {
    parcelNumber: Math.max(
      [...flattenData].sort((a, b) => b.parcelNumber.formattedString.length - a.parcelNumber.formattedString.length)[0].parcelNumber
        .formattedString.length,
      headers[0].length
    ),
    state: Math.max([...flattenData].sort((a, b) => b.state.label.length - a.state.label.length)[0].state.label.length, headers[1].length),
    county: Math.max(
      [...flattenData].sort((a, b) => b.county.label.length - a.county.label.length)[0].county.label.length,
      headers[2].length
    ),
    acreage: Math.max(
      [...flattenData].sort((a, b) => b.acreage.toString().length - a.acreage.toString().length)[0].acreage.toString().length,
      headers[3].length
    ),
    lastSalePrice: Math.max(
      [...flattenData].sort((a, b) => b.lastSalePrice!.toString().length - a.lastSalePrice!.toString().length)[0].lastSalePrice!.toString()
        .length,
      headers[4].length
    ),
    pricePerAcre: Math.max(
      [...flattenData]
        .sort((a, b) => b.pricePerAcreage.toString().length - a.pricePerAcreage.toString().length)[0]
        .pricePerAcreage.toString().length,
      headers[5].length
    ),
    lastSaleDate: Math.max(
      [...flattenData].sort((a, b) => b.lastSaleDate!.toString().length - a.lastSaleDate!.toString().length)[0].lastSaleDate!.toString()
        .length,
      headers[6].length
    ),
  };

  ws["!cols"] = Object.values(maxLengthData).map((el) => ({ width: el + 3 }));

  XLSX.utils.book_append_sheet(wb, ws, "sheet1");

  XLSX.writeFile(wb, `${data.state.label}/${data.county.label}/${data.acreage.formattedString}/${data.voltPrice.formattedString}.xlsx`);
};

export const exportToKml = async (data: z.infer<typeof PropertyDataSchema>, isNonValidMedianHighlighted?: boolean) => {
  const allProperties = data.assessments.data.map((el) => (el.isBulked ? el.data.properties : el.data)).flat();
  const mainLandSaleHistory = allProperties.filter((el) => el.parcelNumber.formattedString === data.parcelNumber.formattedString);
  const mainLandGroup = data.assessments.data.find((el) => el.isBulked && el.data.hasSellingProperty);
  const origin = window.origin.includes("localhost") ? "https://test.parcelmarket.com" : window.origin;

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
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${data.acreage.formattedString}</span>
            </p>
            <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>VOLT Value Per Acre: 
            <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${
              data.voltPricePerAcreage.formattedString
            }</span>
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
                   <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${
                     el.pricePerAcreage.formattedString
                   }</span>
                  </p>
                </div>
                <hr />
                `
            )}
          ]]>
        </description>
        <Style>
            <IconStyle>
                <scale>1.6</scale>
                <Icon>
                    <href>${origin}/map/pins/png/green-highlighted-${mainLandGroup ? mainLandGroup.data.group : "default"}.png</href>
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

  // eslint-disable-next-line no-restricted-syntax
  for await (const item of data.assessments.data) {
    if (item.isBulked) {
      // eslint-disable-next-line no-restricted-syntax
      for await (const childItem of item.data.properties) {
        const kmlItem = `
        <Placemark>
           <description>
             <![CDATA[
               <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Parcel Number:
               <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${
                 childItem.parcelNumber.formattedString
               }</span>
               </p>
               <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Acreage:
               <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${childItem.acreage.formattedString}</span>
               </p>
               <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Last Sale Date:
               <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moment(childItem.lastSaleDate).format(
                 "MM-DD-YYYY"
               )}</span>
               </p>
                 <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Sold Price Per Acreage:
               <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${
                 childItem.pricePerAcreage.formattedString
               }</span>
               </p>
             ]]>
           </description>
           <Style>
               <IconStyle>
                   <scale>1</scale>
                   <Icon>
                        <href>${origin}/map/pins/png/${
          isNonValidMedianHighlighted && !item.data.isMedianValid ? "yellow" : "red"
        }-highlighted-${item.data.group}.png</href>
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
               <coordinates>${childItem.longitude},${childItem.latitude},0</coordinates>
           </Point>
         </Placemark>
     `;
        kmlContent.push(kmlItem);
      }
    } else {
      //  <name>${item.isBulked ? `Bulk Sale - ${moment(item.lastSaleDate).format("MM-DD-YYYY")}` : ""}</name>
      const kmlItem = `
      <Placemark>
         <description>
           <![CDATA[
             <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Parcel Number:
             <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${
               item.data.parcelNumber.formattedString
             }</span>
             </p>
             <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Acreage:
             <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${item.data.acreage.formattedString}</span>
             </p>
             <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Last Sale Date:
             <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${moment(item.data.lastSaleDate).format(
               "MM-DD-YYYY"
             )}</span>
             </p>
               <p style='color:black; font-size:14px; font-weight:400;font-family:sans-serif'>Sold Price Per Acreage:
             <span style='color:black; font-size:14px; font-weight:600;font-family:sans-serif'>${
               item.data.pricePerAcreage.formattedString
             }</span>
             </p>
           ]]>
         </description>
         <Style>
             <IconStyle>
                 <scale>1</scale>
                 <Icon>
                      <href>
                      ${origin}/map/pins/png/${
        isNonValidMedianHighlighted && !item.data.isMedianValid ? "yellow" : "red"
      }-highlighted-default.png</href>
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
             <coordinates>${item.data.longitude},${item.data.latitude},0</coordinates>
         </Point>
       </Placemark>
   `;
      kmlContent.push(kmlItem);
    }
  }

  const kml = `<?xml version="1.0" encoding="utf-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
       <Style id="mainLandPin">
          <IconStyle>
            <scale>1.3</scale>
            <Icon>
                <href>${origin}/map/pins/red-default.svg</href>
            </Icon>
            <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
          </IconStyle>
          
        </Style>
        ${kmlContent.join("")}
      </Document>
    </kml>
  `;

  const blob = new Blob([kml], { type: "text/plain" });

  saveAs(blob, `${data.state.label}/${data.county.label}/${data.acreage.formattedString}/${data.voltPrice.formattedString}.kml`);
};
