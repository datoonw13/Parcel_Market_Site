import { PropertyDataSchema } from "@/zod-validations/volt-new";
import moment from "moment";
import XLSX from "sheetjs-style";
import { z } from "zod";

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
          },
          v: property.data.acreage.formattedString,
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
          },
          v: property.data.lastSalePrice.formattedString,
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
          },
          v: property.data.pricePerAcreage.formattedString,
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
          },
          v: property.data.acreage.formattedString,
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
          },
          v: property.data.lastSalePrice.formattedString,
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
          },
          v: property.data.pricePerAcreage.formattedString,
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
              fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf7e0" : "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${childProperty.parcelNumber.formattedString}`,
          },
          County: {
            s: {
              fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf7e0" : "f6f6f6" } },
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
              fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf7e0" : "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${childProperty.acreage.formattedString}`,
          },
          "Sold price": {
            s: {
              fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf7e0" : "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: "",
          },
          "Sold price per acre": {
            s: {
              fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf7e0" : "f6f6f6" } },
              border: {
                top: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                bottom: { style: "thin", color: { rgb: childProperty.isSellingProperty ? "0e8b40" : "#e5e7eb" } },
                left: { style: "thin", color: { rgb: "#e5e7eb" } },
                right: { style: "thin", color: { rgb: "#e5e7eb" } },
              },
            },
            v: `    ${childProperty.pricePerAcreage.formattedString}`,
          },
          "Last sale date": {
            s: {
              fill: { fgColor: { rgb: isNonValidMedianHighlighted && !property.data.isMedianValid ? "fdf7e0" : "f6f6f6" } },
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

  const headers = ["Parcel ID", "County", "Acreage", "Sold price", "Sold price per acre", "Last sale date"];
  const ws = XLSX.utils.json_to_sheet(formattedData, {
    header: headers,
  });

  const flattenData = list.map((el) => (el.isBulked ? el.data.properties : el.data)).flat();
  const maxLengthData = {
    parcelNumber: Math.max(
      [...flattenData].sort((a, b) => b.parcelNumber.formattedString.length - a.parcelNumber.formattedString.length)[0].parcelNumber
        .formattedString.length,
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

  XLSX.writeFile(wb, `${data.state.label}/${data.county.label}/${data.acreage.formattedString}/${data.voltPrice.formattedString}.xlsx`);
};
