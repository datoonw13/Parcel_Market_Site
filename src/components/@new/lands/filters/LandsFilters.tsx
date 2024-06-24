"use client";

import React, { useState } from "react";
import { ILandsFilters } from "@/types/lands";
import LandsDesktopFilters from "./LandsDesktopFilters/LandsDesktopFilters";
import LandsMobileFilters from "./LandsMobileFilters/LandsMobileFilters";

const LandsFilters = () => {
  const [filters, setFilters] = useState<ILandsFilters>({
    state: null,
    county: null,
    acreageMax: null,
    acreageMin: null,
    page: 1,
    pageSize: 10,
    priceMax: null,
    priceMin: null,
    sortBy: null,
  });

  return (
    <div className="mb-6">
      <div className="hidden md:flex">
        <LandsDesktopFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex md:hidden">
        <LandsMobileFilters filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default LandsFilters;
