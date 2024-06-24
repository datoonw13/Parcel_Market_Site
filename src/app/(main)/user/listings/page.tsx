import { UserIcon2 } from "@/components/@new/icons/UserIcons";
import LandBox from "@/components/@new/lands/LandBox";
import LandsDesktopFilters from "@/components/@new/lands/filters/LandsDesktopFilters/LandsDesktopFilters";
import { numFormatter } from "@/helpers/common";
import { Container } from "@mui/material";
import React from "react";

const UserListings = () => (
  <div className="w-full">
    <div className="mb-8">
      <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">My Listings</h1>
      <h2 className="font-medium text-sm text-grey-800">
        Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE...
      </h2>
    </div>
    {/* <LandsDesktopFilters  /> */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {new Array(21).fill(0).map(() => (
        <LandBox data={data} key={Math.random()} view="vertical" className="max-w-96 md:max-w-max m-auto" />
      ))}
    </div>
  </div>
);

export default UserListings;

const data = {
  name: "Lorem ipsum dolor sit amet. Et galisum incidunt non galisum modi et quia deleniti qui incidunt delectus et atque dicta vel expedita nemo sit sint eveniet. Et architecto omnis qui culpa sunt ut Quis voluptas.",
  state: "Georgia",
  county: "Jefferson County",
  availableTill: "24 Apr",
  options: {
    owner: {
      icon: <UserIcon2 />,
      label: "Owner",
      value: "Name, Surname",
    },
    parcelNumber: {
      icon: <UserIcon2 />,
      label: "Parcel ID",
      value: "1473434052",
    },
    acreage: {
      icon: <UserIcon2 />,
      label: "Acreage",
      value: "45,900 Acres",
    },
    voltValue: {
      icon: <UserIcon2 />,
      label: "VOLT Value",
      value: numFormatter.format(4265698),
    },
  },
};
