import LandBox from "@/components/@new/land/LandBox";
import { Container } from "@mui/material";
import React from "react";

const UserListings = () => (
  <div>
    <div className="mb-8">
      <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">My Listings</h1>
      <h2 className="font-medium text-sm text-grey-800">
        Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE...
      </h2>
    </div>
    <div className="grid grid-cols-2 gap-6">
      {new Array(21).fill(0).map(() =>  <LandBox key={Math.random()} view="vertical" />)}
    </div>
  </div>
);

export default UserListings;
