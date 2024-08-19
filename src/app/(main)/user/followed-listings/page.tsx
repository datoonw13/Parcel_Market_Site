import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import UserListingDesktopFilter from "@/components/@new/user/listings/user-listing-desktop-filters";
import { Suspense } from "react";
import UserListingLoader from "@/components/@new/user/listings/user-listing-loader";
import FollowedListings from "@/components/@new/user/followed-listings/followed-listings";
import { getUserAction } from "@/server-actions/user/actions";
import SubscribeError from "@/components/@new/shared/subscribe-error";

const UserFollowedListingsPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const user = await getUserAction();
  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between flex-col sm:flex-row gap-6">
        <UserProfileSectionHeader
          title="My Saved Properties"
          description="View and manage the properties you've bookmarked for future consideration."
        />
      </div>
      {user?.isSubscribed ? (
        <>
          <Suspense>
            <div className="hidden sm:block">
              <UserListingDesktopFilter />
            </div>
          </Suspense>
          <Suspense fallback={<UserListingLoader />} key={JSON.stringify(searchParams)}>
            <FollowedListings searchParams={searchParams} />
          </Suspense>
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default UserFollowedListingsPage;
