const UserRecentSearchesLoader = ({ showHeader }: { showHeader?: boolean }) => (
  <div className="space-y-6">
    {showHeader && (
      <div className="space-y-4">
        <h1 className="font-semibold text-2xl">Recent Searches</h1>
        <h2 className="hidden md:block text-grey-800 text-xs">
          To calculate the price of your land, gather data on comparable properties, analyze their sale prices, adjust for differences.
        </h2>
      </div>
    )}
    <div className="space-y-4">
      <div className="w-full h-8 rounded-lg animate-pulse bg-primary-main-100" />
      <div className="w-full h-8 rounded-lg animate-pulse bg-primary-main-100" />
      <div className="w-full h-8 rounded-lg animate-pulse bg-primary-main-100" />
      <div className="w-full h-8 rounded-lg animate-pulse bg-primary-main-100" />
      <div className="w-full h-8 rounded-lg animate-pulse bg-primary-main-100" />
      <div className="w-full h-8 rounded-lg animate-pulse bg-primary-main-100" />
    </div>
  </div>
);

export default UserRecentSearchesLoader;
