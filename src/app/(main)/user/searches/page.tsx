import SubscribeError from "@/components/@new/shared/subscribe-error";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import UserSearchesDesktopFilters from "@/components/@new/user/searches/user-searches-filters";
import { getUserAction } from "@/server-actions/user/actions";
import { Suspense } from "react";

const UserSearchesPage = async () => {
  const user = await getUserAction();

  return (
    <div className="w-full space-y-8">
      <UserProfileSectionHeader
        title="Recent Searches"
        description="To calculate the price of your land, gather data on comparable properties, analyze their sale prices, adjust for differences."
      />
      {user?.isSubscribed ? (
        <>
          <Suspense>
            <div className="hidden sm:block">
              <UserSearchesDesktopFilters />
            </div>
          </Suspense>
          {/* <Suspense fallback={<UserListingLoader />} key={JSON.stringify(searchParams)}>
            <UserListing searchParams={searchParams} />
          </Suspense> */}
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default UserSearchesPage;
