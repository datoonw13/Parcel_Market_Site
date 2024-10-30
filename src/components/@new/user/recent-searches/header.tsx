import dynamic from "next/dynamic";

const RecentSearchesFilters = dynamic(() => import("./filters/filters"), { ssr: false });

const RecentSearchesHeader = () => (
  <div className="space-y-5 md:space-y-8">
    <div className="space-y-4">
      <h1 className="font-semibold text-2xl">Recent Searches</h1>
      {/* <h2 className="hidden md:block text-grey-800 text-xs">
        To calculate the price of your land, gather data on comparable properties, analyze their sale prices, adjust for differences.
      </h2> */}
    </div>
    <RecentSearchesFilters />
  </div>
);

export default RecentSearchesHeader;
