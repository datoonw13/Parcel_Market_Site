import React from "react";
import { getUserFollowedListingAction } from "@/server-actions/follow/actions";
import FollowedListingsWrapper from "./followed-listings-wrapper";

const FollowedListings = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { data } = await getUserFollowedListingAction(searchParams);
  return (
    <div>
      <FollowedListingsWrapper data={data} searchParams={searchParams} />
    </div>
  );
};

export default FollowedListings;
