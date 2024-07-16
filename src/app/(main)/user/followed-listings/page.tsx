import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import UserListingDesktopFilter from "@/components/@new/user/listings/user-listing-desktop-filters";
import UserListing from "@/components/@new/user/listings/user-listing";
import { Suspense } from "react";
import UserListingLoader from "@/components/@new/user/listings/user-listing-loader";

const UserFollowedListingsPage = ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <div className="w-full space-y-8">
    <div className="flex justify-between flex-col sm:flex-row gap-6">
      <UserProfileSectionHeader
        title="My Saved Properties"
        description="View and manage the properties you've bookmarked for future consideration."
      />
    </div>
    <Suspense>
      <div className="hidden sm:block">
        <UserListingDesktopFilter />
      </div>
    </Suspense>
    <Suspense fallback={<UserListingLoader />} key={JSON.stringify(searchParams)}>
      <UserListing searchParams={searchParams} followedListings />
    </Suspense>
  </div>
);

export default UserFollowedListingsPage;
