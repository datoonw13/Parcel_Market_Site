import React from "react";
import LandsDesktopFilters from "./LandsDesktopFilters/LandsDesktopFilters";
import LandsMobileFilters from "./LandsMobileFilters/LandsMobileFilters";

const LandsFilters = () => (
  <div className="mb-6">
    <div className="hidden md:flex">
      <LandsDesktopFilters />
    </div>
    <div className="flex md:hidden">
      <LandsMobileFilters />
    </div>
  </div>
);

export default LandsFilters;
