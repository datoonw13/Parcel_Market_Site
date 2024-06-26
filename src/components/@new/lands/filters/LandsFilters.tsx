"use client";

import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { ILandsFilters } from "@/types/lands";
import LandsDesktopFilters from "./LandsDesktopFilters/LandsDesktopFilters";
import LandsMobileFilters from "./LandsMobileFilters/LandsMobileFilters";

interface LandsFiltersProps {
  setFilters: Dispatch<SetStateAction<ILandsFilters>>;
  filters: ILandsFilters;
  select?: {
    startSelect: () => void;
    totalSelected: number;
    onRemove: () => void;
    selecting: boolean;
  };
}

const LandsFilters: FC<LandsFiltersProps> = ({ filters, setFilters, select }) => (
  <div className="mb-6">
    <div className="hidden md:flex">
      <LandsDesktopFilters select={select} filters={filters} setFilters={setFilters} />
    </div>
    <div className="flex md:hidden">
      <LandsMobileFilters filters={filters} setFilters={setFilters} />
    </div>
  </div>
);

export default LandsFilters;
