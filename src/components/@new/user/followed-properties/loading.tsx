import UserFollowedPropertiesListLoading from "./list-loading";

const UserFollowedPropertiesLoading = () => (
  <div className="space-y-8 md:space-y-6">
    <div className="space-y-8 md:space-y-6">
      <div className="bg-primary-main-100 rounded-2xl animate-pulse h-14" />
      <div className="bg-primary-main-100 rounded-2xl animate-pulse h-8" />
      <div className="bg-primary-main-100 rounded-2xl animate-pulse h-8" />
    </div>
    <UserFollowedPropertiesListLoading />
  </div>
);

export default UserFollowedPropertiesLoading;
