"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import React, { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface RecentSearchesCalculationTableProps {
  data: IUserRecentSearches["propertiesUsedForCalculation"];
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const RecentSearchesCalculationTable: FC<RecentSearchesCalculationTableProps> = ({ data, mapInteraction, setMpaInteraction }) => {
  const checkParcel = (targetParcelNumber: string) => {
    const item =
      data?.find((el) => el.data.parcelNumberNoFormatting === targetParcelNumber) ||
      data?.find((el) => el.data.parcelNumberNoFormatting.split("multiple").includes(targetParcelNumber));
    return {
      active: mapInteraction.openPopperParcelNumber
        ? item?.data.parcelNumberNoFormatting.includes(mapInteraction.openPopperParcelNumber)
        : false,
      highlighted: mapInteraction.hoveredParcelNumber
        ? item?.data.parcelNumberNoFormatting.includes(mapInteraction.hoveredParcelNumber)
        : false,
    };
  };

  return (
    <Table className="">
      <TableHeader>
        <TableRow className="">
          <TableHead className="text-black font-normal bg-grey-30 rounded-tl-2xl border-l border-l-transparent">Parcel ID</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">County</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Acreage</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Sold Price</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Sold Price Per Acre</TableHead>
          <TableHead className="text-black font-normal bg-grey-30 ">Last sale date</TableHead>
          <TableHead className="text-black font-normal bg-grey-30 rounded-tr-2xl border-r border-r-transparent" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((el) => {
          const { active, highlighted } = checkParcel(el.data.parcelNumberNoFormatting);
          return (
            <Fragment key={el.data.parcelNumberNoFormatting}>
              <TableRow
                className={cn(active && " !bg-grey-50", active && el.isBulked && "!border-b-0", highlighted && "bg-grey-30")}
                onClick={() => {
                  setMpaInteraction((prev) => ({
                    ...prev,
                    openPopperParcelNumber:
                      mapInteraction.openPopperParcelNumber === el.data.parcelNumberNoFormatting ? "" : el.data.parcelNumberNoFormatting,
                  }));
                }}
                onMouseEnter={() => {
                  setMpaInteraction((prev) => ({
                    ...prev,
                    hoveredParcelNumber: el.data.parcelNumberNoFormatting,
                    zoom: true,
                  }));
                }}
                onMouseLeave={() => {
                  setMpaInteraction((prev) => ({
                    ...prev,
                    hoveredParcelNumber: null,
                  }));
                }}
              >
                <TableCell className="border-l border-l-transparent">
                  {el.isBulked ? "Multiple parcels" : el.data.parcelNumberNoFormatting}
                </TableCell>
                <TableCell>{el.data.county.label}</TableCell>
                <TableCell>{el.data.acreage.toFixed(2)}</TableCell>
                <TableCell>{moneyFormatter.format(el.isBulked ? el.data.price : el.data.lastSalePrice)}</TableCell>
                <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
                <TableCell>
                  {moment(el.isBulked ? el.data.properties[0].lastSaleDate : el.data.lastSalePrice).format("MM/DD/YYYY")}
                </TableCell>
                <TableCell className="border-r border-r-transparent">
                  {el.isBulked ? (
                    <>
                      {mapInteraction.openPopperParcelNumber !== el.data.parcelNumberNoFormatting ? (
                        <MdKeyboardArrowUp className="size-5" />
                      ) : (
                        <MdKeyboardArrowDown className="size-5" />
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
              {el.isBulked &&
                checkParcel(el.data.parcelNumber).active &&
                el.data.properties.map((childEl) => (
                  <TableRow
                    className="!bg-primary-main-100 !border-b-transparent !border !border-primary-main-400"
                    key={childEl.parcelNumberNoFormatting}
                  >
                    <TableCell className="">{childEl.parcelNumberNoFormatting}</TableCell>
                    <TableCell>{el.data.county.label}</TableCell>
                    <TableCell>{el.data.acreage.toFixed(2)}</TableCell>
                    <TableCell>{moneyFormatter.format(el.data.price)}</TableCell>
                    <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
                    <TableCell>{moment(el.data.properties[0].lastSaleDate).format("MM/DD/YYYY")}</TableCell>
                    <TableCell />
                  </TableRow>
                ))}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default RecentSearchesCalculationTable;
