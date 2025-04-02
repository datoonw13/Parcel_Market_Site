import UserProfileSectionHeader from "@/components/@new/user/UserSectionHeading";
import { cn } from "@/lib/utils";

const SearchesLoading = () => (
  <div className="space-y-4 md:space-y-6">
    <div className="space-y-3">
      <UserProfileSectionHeader title="Data Dashboard" className="mb-6" />
      <div className="h-9 w-full animate-pulse bg-primary-main-100 rounded-2xl" />
      <div className="h-9 w-full animate-pulse bg-primary-main-100 rounded-2xl" />
    </div>
    <div className={cn("h-96 animate-pulse bg-primary-main-100 rounded-2xl")} />
  </div>
);

export default SearchesLoading;
