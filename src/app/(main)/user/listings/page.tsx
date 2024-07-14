import UserProfileSectionHeader from "@/components/@new/user/UserProfileSectionHeader";
import UserListingDesktopFilter from "@/components/@new/user/listings/user-listing-desktop-filters";
import UserListing from "@/components/@new/user/listings/user-listing";
import { Suspense } from "react";
import UserListingLoader from "@/components/@new/user/listings/user-listing-loader";
import Button from "@/components/@new/shared/forms/Button";
import { AddIcon1 } from "@/components/@new/icons/AddIcons";
import Link from "next/link";
import routes from "@/helpers/routes";

const UserListingPage = ({ searchParams }: { searchParams: { [key: string]: string } }) => (
  <div className="w-full space-y-8">
    <div className="flex justify-between flex-col sm:flex-row gap-6">
      <UserProfileSectionHeader title="My Listings" description="Welcome to Parcel Market and thank You for being here" />
      <Link href={routes.valueLand.fullUrl} className="w-full sm:w-fit">
        <Button className="!bg-primary-main-100 w-full sm:w-fit">
          <div className="flex items-center gap-2  text-primary-main">
            <AddIcon1 className="fill-primary-main" /> Add Land
          </div>
        </Button>
      </Link>
    </div>
    <Suspense>
      <div className="hidden sm:block">
        <UserListingDesktopFilter />
      </div>
    </Suspense>
    <Suspense fallback={<UserListingLoader />} key={JSON.stringify(searchParams)}>
      <UserListing searchParams={searchParams} />
    </Suspense>
  </div>
);

export default UserListingPage;
