/* eslint-disable jsx-a11y/control-has-associated-label */

"use client";

import { useState } from "react";
import clsx from "clsx";
import { ISellingProperty } from "@/types/find-property";
import { headers } from "next/headers";
import moment from "moment";
import { orderBy } from "lodash";
import { ArrowIconLeft1, ArrowIconsUnion1 } from "../../icons/ArrowIcons";

const HEADER_ROWS = [
  { label: "Parcel ID", key: "parcelNumber" as const },
  { label: "County", key: "county" as const },
  { label: "Acrage", key: "arcage" as const },
  { label: "Sold Price", key: "lastSalesPrice" as const },
  { label: "Price Per Acre", key: "pricePerAcre" as const },
  { label: "Last Sale Date", key: "lastSalesDate" as const },
];

const LandPriceCalculationTable = ({ data }: { data: NonNullable<ISellingProperty["usedForPriceCalculations"]> }) => {
  const [sort, setSort] = useState<{ key: typeof HEADER_ROWS[0]["key"]; dir: "asc" | "desc" }>({ key: "arcage", dir: "desc" });
  const formattedData = data.map((el) => ({
    ...el,
    pricePerAcre: Number((Number(el.lastSalesPrice) / Number(el.arcage)).toFixed(2)),
  }));

  const sortedData = orderBy(formattedData, [sort.key], [sort.dir]);

  const handleSort = (key: typeof HEADER_ROWS[0]["key"]) => {
    setSort({ key, dir: sort.key === key && sort.dir === "desc" ? "asc" : "desc" });
  };

  return (
    <div className="w-full  border border-grey-100 rounded-2xl">
      <table className="w-full">
        <thead>
          <tr className="bg-grey-30 rounded-2xl [&>th:first-child]:rounded-tl-2xl [&>th:last-child]:rounded-tr-2xl">
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
            <tr key={item.latitude + item.longitude} className="hover:bg-primary-main-50 transition-all duration-100 cursor-pointer">
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
                {item.arcage}
              </td>
              <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                {item.lastSalesPrice}
              </td>
              <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                {item.pricePerAcre}
              </td>
              <td className="py-3 px-6 text-grey-800 text-xs" align="left">
                {moment(item.lastSalesDate).format("DD-MM-YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandPriceCalculationTable;
