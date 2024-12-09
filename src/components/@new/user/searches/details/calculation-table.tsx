"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { moneyFormatter } from "@/helpers/common";
import { cn } from "@/lib/utils";
import { MapInteractionModel } from "@/types/common";
import { IUserRecentSearches } from "@/types/user";
import moment from "moment";
import React, { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface SearchItemDetailsTableProps {
  data: IUserRecentSearches["propertiesUsedForCalculation"];
  additionalDataResult?: IUserRecentSearches;
  mapInteraction: MapInteractionModel;
  setMpaInteraction: Dispatch<SetStateAction<MapInteractionModel>>;
}

const SearchItemDetailsTable: FC<SearchItemDetailsTableProps> = ({ data, mapInteraction, setMpaInteraction, additionalDataResult }) => {
  const checkParcel = (targetParcelNumber: string) => {
    const item =
      [...data, ...(additionalDataResult?.propertiesUsedForCalculation || [])]?.find(
        (el) => el.data.parcelNumberNoFormatting === targetParcelNumber
      ) ||
      [...data, ...(additionalDataResult?.propertiesUsedForCalculation || [])]?.find((el) =>
        el.data.parcelNumberNoFormatting.split("multiple").includes(targetParcelNumber)
      );
    return {
      active: mapInteraction.openPopperParcelNumber
        ? item?.data.parcelNumberNoFormatting.includes(mapInteraction.openPopperParcelNumber)
        : false,
      highlighted: mapInteraction.hoveredParcelNumber
        ? item?.data.parcelNumberNoFormatting.includes(mapInteraction.hoveredParcelNumber)
        : false,
    };
  };

  const list = [...(data || []), ...(additionalDataResult?.propertiesUsedForCalculation || [])].sort((a, b) => {
    const aPrice = a.data.pricePerAcreage || a.data.pricePerAcreage;
    const bPrice = b.data.pricePerAcreage || b.data.pricePerAcreage;

    return aPrice - bPrice;
  });

  return (
    <Table className="">
      <TableHeader>
        <TableRow className="">
          <TableHead className="text-black font-normal bg-grey-30 rounded-tl-2xl border-l border-l-transparent">Parcel ID</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">County</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Acreage</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Sold Price</TableHead>
          <TableHead className="text-black font-normal bg-grey-30">Sold Price Per Acreage</TableHead>
          <TableHead className="text-black font-normal bg-grey-30 ">Last sale date</TableHead>
          <TableHead className="text-black font-normal bg-grey-30 rounded-tr-2xl border-r border-r-transparent" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((el) => {
          if (el.isBulked) {
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
                  <TableCell className="border-l border-l-transparent">Multiple parcels</TableCell>
                  <TableCell>{el.data.county.label}</TableCell>
                  <TableCell>{el.data.acreage.toFixed(2)}</TableCell>
                  <TableCell>{moneyFormatter.format(el.data.price)}</TableCell>
                  <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
                  <TableCell>{moment(el.data.properties[0].lastSaleDate).format("MM/DD/YYYY")}</TableCell>
                  <TableCell className="border-r border-r-transparent">
                    {mapInteraction.openPopperParcelNumber !== el.data.parcelNumberNoFormatting ? (
                      <MdKeyboardArrowUp className="size-5" />
                    ) : (
                      <MdKeyboardArrowDown className="size-5" />
                    )}
                  </TableCell>
                </TableRow>
                {checkParcel(el.data.parcelNumber).active &&
                  el.data.properties.map((childEl) => (
                    <TableRow
                      className="!bg-primary-main-100 !border-b-transparent !border !border-primary-main-400"
                      key={childEl.parcelNumberNoFormatting}
                    >
                      <TableCell className="">{childEl.parcelNumberNoFormatting}</TableCell>
                      <TableCell>{childEl.county.label}</TableCell>
                      <TableCell>{childEl.acreage.toFixed(2)}</TableCell>
                      <TableCell />
                      <TableCell>{moneyFormatter.format(childEl.pricePerAcreage)}</TableCell>
                      <TableCell>{moment(childEl.lastSaleDate).format("MM/DD/YYYY")}</TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
              </Fragment>
            );
          }
          if (!el.isBulked && el.data.isMedianValid) {
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
                  <TableCell>{moneyFormatter.format(el.data.lastSalePrice)}</TableCell>
                  <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
                  <TableCell>{moment(el.data.lastSaleDate).format("MM/DD/YYYY")}</TableCell>
                  <TableCell className="border-r border-r-transparent" />
                </TableRow>
              </Fragment>
            );
          }
          const { active, highlighted } = checkParcel(el.data.parcelNumberNoFormatting);
          return (
            <TableRow
              key={el.data.parcelNumber}
              className={cn(
                "bg-[#FEFAEB] border-b-[#FCEDB6] hover:bg-[#fcedb673]",
                active && "!bg-[#fcedb699]",
                highlighted && "bg-[#fcedb673]"
              )}
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
              <TableCell className="border-l border-l-transparent">{el.data.parcelNumberNoFormatting}</TableCell>
              <TableCell>{el.data.county.label}</TableCell>
              <TableCell>{el.data.acreage.toFixed(2)}</TableCell>
              <TableCell>{moneyFormatter.format(el.data.lastSalePrice)}</TableCell>
              <TableCell>{moneyFormatter.format(el.data.pricePerAcreage)}</TableCell>
              <TableCell>{moment(el.data.lastSaleDate).format("MM/DD/YYYY")}</TableCell>
              <TableCell className="border-r border-r-transparent" />
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SearchItemDetailsTable;
