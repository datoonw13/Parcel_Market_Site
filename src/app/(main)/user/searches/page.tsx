import SubscribeError from "@/components/@new/shared/subscribe-error";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import SearchDesktopFilters from "@/components/@new/user/searches/search-filters";
import UserSearches from "@/components/@new/user/searches/user-searches";
import { getUserAction } from "@/server-actions/user/actions";
import Image from "next/image";
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
          <div className="hidden sm:block">
            <Suspense>
              <div className="hidden sm:block">
                <SearchDesktopFilters />
              </div>
            </Suspense>
            <UserSearches />
          </div>
          <div className="relative rounded-2xl border border-grey-100 sm:hidden">
            <div className="w-full h-96 blur-md " />
            <div className="w-[90%] lg:hidden absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border border-grey-100 rounded-2xl p-5 space-y-6">
              <div className="relative w-16 h-14 m-auto">
                <Image src="/no-mobile-support.png" fill alt="" className="w-16 h-14 m-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-center">No Mobile Support</p>
                <p className="text-xs text-grey-600 text-center">
                  We don’t support this information for mobile, Please open up Desktop version.
                </p>
              </div>
            </div>
          </div>
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
