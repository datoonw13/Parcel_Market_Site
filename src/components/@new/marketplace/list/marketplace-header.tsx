import Link from "next/link";
import routes from "@/helpers/routes";
import { ArrowIconLeftFilled1 } from "../../icons/ArrowIcons";

const MarketplaceHeader = () => (
  <div className="">
    <div className="flex items-center gap-1.5 cursor-pointer mb-8 md:mb-10">
      <Link href={routes.home.fullUrl}>
        <p className="text-sm text-grey-800">Homepage</p>
      </Link>
      <div className="w-5 h-5 flex items-center justify-center">
        <ArrowIconLeftFilled1 className="!w-1.5 h-1.5" color="primary-main" />
      </div>
      <p className="text-sm text-primary-main font-medium">Lands Marketplace</p>
    </div>
    <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center">Parcel Marketplace</h1>
      <h6 className="font-medium md:text-sm md:text-grey-800 text-center max-w-3xl m-auto">
        Welcome to Parcel Marketplace where investors and sellers can connect for unique, off-market land opportunities.
      </h6>
    </div>
  </div>
);

export default MarketplaceHeader;
