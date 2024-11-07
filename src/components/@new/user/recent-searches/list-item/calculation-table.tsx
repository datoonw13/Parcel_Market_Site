"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import React, { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface RecentSearchesCalculationTableProps {
  data: IUserRecentSearches["propertiesUsedForCalculation"];
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const RecentSearchesCalculationTable: FC<RecentSearchesCalculationTableProps> = ({ data, mapInteraction, setMpaInteraction }) => {
  //   const [open, setOpen] = useState("");

  useEffect(() => {}, [mapInteraction]);
  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead className="text-black font-normal bg-grey-30 rounded-tl-2xl">Parcel ID</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">County</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Acreage</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Sold Price</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">VOLT Value Per Acre</TableHead>
          <TableHead className="text-black font-normal bg-grey-30 ">Last sale date</TableHead>
          <TableHead className="text-black font-normal bg-grey-30 rounded-tr-2xl" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((el) =>
          el.isBulked ? (
            <Fragment key={el.data.parcelNumberNoFormatting}>
              <TableRow
                className={cn(mapInteraction.openPopperParcelNumber === el.data.parcelNumberNoFormatting && "!border-b-0 !bg-grey-50")}
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
                  }));
                }}
                onMouseLeave={() => {
                  setMpaInteraction((prev) => ({
                    ...prev,
                    hoveredParcelNumber: null,
                  }));
                }}
              >
                <TableCell>Multiple parcels</TableCell>
                <TableCell>{el.data.county.label}</TableCell>
                <TableCell>{el.data.acreage.toFixed(2)}</TableCell>
                <TableCell>{moneyFormatter.format(el.data.price)}</TableCell>
                <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
                <TableCell>{moment(el.data.properties[0].lastSaleDate).format("MM/DD/YYYY")}</TableCell>
                <TableCell>
                  <MdKeyboardArrowDown />
                </TableCell>
              </TableRow>
              {mapInteraction.openPopperParcelNumber === el.data.parcelNumberNoFormatting &&
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
          ) : (
            <TableRow
              key={el.data.parcelNumberNoFormatting}
              className={cn(
                mapInteraction.openPopperParcelNumber === el.data.parcelNumberNoFormatting && "!bg-grey-50",
                mapInteraction.hoveredParcelNumber === el.data.parcelNumberNoFormatting &&
                  mapInteraction.openPopperParcelNumber !== el.data.parcelNumberNoFormatting &&
                  "!bg-grey-30"
              )}
              onMouseEnter={() => {
                setMpaInteraction((prev) => ({
                  ...prev,
                  hoveredParcelNumber: el.data.parcelNumberNoFormatting,
                }));
              }}
              onMouseLeave={() => {
                setMpaInteraction((prev) => ({
                  ...prev,
                  hoveredParcelNumber: null,
                }));
              }}
              onClick={() => {
                setMpaInteraction((prev) => ({
                  ...prev,
                  openPopperParcelNumber:
                    mapInteraction.openPopperParcelNumber === el.data.parcelNumberNoFormatting ? "" : el.data.parcelNumberNoFormatting,
                }));
              }}
            >
              <TableCell>{el.data.parcelNumberNoFormatting}</TableCell>
              <TableCell>{el.data.county.label}</TableCell>
              <TableCell>{el.data.acreage.toFixed(2)}</TableCell>
              <TableCell>{moneyFormatter.format(el.data.lastSalePrice)}</TableCell>
              <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
              <TableCell>{moment(el.data.lastSaleDate).format("MM/DD/YYYY")}</TableCell>
              <TableCell />
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

export default RecentSearchesCalculationTable;
