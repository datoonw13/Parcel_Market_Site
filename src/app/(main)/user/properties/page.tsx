import { getUserAction } from "@/server-actions/user/actions";
import Listings from "@/components/@new/user/properties/properties";
import { getUserListingAction } from "@/server-actions/user-listings/actions";

const PAGE_SIZE = 6;
const UserPropertiesPage = async () => {
  const user = await getUserAction();
  const { data } = await getUserListingAction(PAGE_SIZE);
  const totalItems = data?.pagination.totalCount || 0;
  return <Listings user={user} totalItems={totalItems} />;
};

export default UserPropertiesPage;
