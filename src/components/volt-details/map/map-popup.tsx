import { moneyFormatter } from "@/helpers/common";
import moment from "moment";
import React, { FC } from "react";

interface IMain {
  type: "main-property";
  lat: number;
  lon: number;
  salesHistory: {
    lastSaleDate: Date;
    lastSalesPrice: number;
  } | null;
  data: {
    [key: string]: {
      label: string;
      value: string | number;
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
          <p className="text-black font-medium text-sm max-w-40">{data?.data[key].value}</p>
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
          <p className="text-black font-medium text-sm max-w-40">{moment(data.salesHistory.lastSaleDate).format("MM-DD-YYYY")}</p>
        </li>
        <li className="flex items-center gap-2">
          <div className="rounded-full size-1.5 bg-primary-main-400" />
          <p className="text-grey-600 font-medium text-sm max-w-40">Last sale price: </p>
          <p className="text-black font-medium text-sm max-w-40">{moneyFormatter.format(data.salesHistory.lastSalesPrice)}</p>
        </li>
      </div>
    )}
  </ul>
);

export default VoltDetailsMapPopup;
