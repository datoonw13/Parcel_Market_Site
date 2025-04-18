import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import moment from "moment";
import React, { FC } from "react";

interface IMain {
  type: "main-property";
  lat: number;
  lon: number;
  salesHistory: {
    lastSaleDate: string;
    lastSalesPrice: number | string;
    blur?: boolean;
  } | null;
  data: {
    [key: string]: {
      label: string;
      value: string | number;
      blur?: boolean;
    };
  };
}

interface IBulk {
  type: "bulk";
  lat: number;
  lon: number;
  hasSellingProperty: boolean;
  data: {
    [key: string]: {
      label: string;
      value: string | number;
      blur?: boolean;
    };
  };
}

interface IOther {
  type: "default";
  lat: number;
  lon: number;
  data: {
    [key: string]: {
      label: string;
      value: string | number;
      blur?: boolean;
    };
  };
}

type IData = IMain | IBulk | IOther;

const VoltDetailsMapPopup: FC<{ data: IData | null }> = ({ data }) => (
  <ul className="grid grid-cols-2 gap-x-2 gap-y-2">
    {Object.keys(data?.data || {}).map((key) => (
      <li key={key} className="flex items-center gap-2">
        <div className="rounded-full size-1.5 bg-primary-main-400" />
        <div>
          <p className="text-grey-600 font-medium text-sm max-w-40">{data?.data[key].label}</p>
          <p className={cn("text-black font-medium text-sm max-w-40", data?.data[key].blur && "blur-[2px]")}>{data?.data[key].value}</p>
        </div>
      </li>
    ))}

    {data?.type === "main-property" && data.salesHistory && (
      <div className="col-span-full">
        <hr className="my-2" />
        <h1 className="text-center font-semibold text-sm mb-2">Sale History</h1>
        <li className="flex items-center gap-2">
          <div className="rounded-full size-1.5 bg-primary-main-400" />
          <p className="text-grey-600 font-medium text-sm max-w-40">Last sale date: </p>
          <p className={cn("text-black font-medium text-sm max-w-40")}>{data.salesHistory.lastSaleDate}</p>
        </li>
        <li className="flex items-center gap-2">
          <div className="rounded-full size-1.5 bg-primary-main-400" />
          <p className="text-grey-600 font-medium text-sm max-w-40">Last sale price: </p>
          <p className={cn("text-black font-medium text-sm max-w-40", data.salesHistory.blur && "blur-[2px]")}>
            {data.salesHistory.lastSalesPrice}
          </p>
        </li>
      </div>
    )}
  </ul>
);

export default VoltDetailsMapPopup;
