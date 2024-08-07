import SubscribeError from "@/components/@new/shared/subscribe-error";
import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import SearchDesktopFilters from "@/components/@new/user/searches/search-filters";
import UserSearches from "@/components/@new/user/searches/user-searches";
import { getUserAction } from "@/server-actions/user/actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const UserSearchesPage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  if (!searchParams.page) {
    redirect("?page=1");
  }
  const user = await getUserAction();

  return (
    <div className="w-full space-y-8">
      <UserProfileSectionHeader
        title="Recent Searches"
        description="To calculate the price of your land, gather data on comparable properties, analyze their sale prices, adjust for differences."
      />
      {user?.isSubscribed ? (
        <>
          <div className="hidden lg:block">
            <Suspense fallback="Loading">
              <div className="hidden lg:block">
                <SearchDesktopFilters />
              </div>
            </Suspense>
            <Suspense key={JSON.stringify(searchParams)}>
              <UserSearches searchParams={searchParams} />
            </Suspense>
          </div>
          <div className="relative rounded-2xl border border-grey-100 lg:hidden">
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
        </>
      ) : (
        <SubscribeError />
      )}
    </div>
  );
};

export default UserSearchesPage;
