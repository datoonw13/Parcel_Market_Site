import { getNotificationsAction } from "@/server-actions/notifications/actions";
import UserProfileNotificationsWrapper from "./user-profile-notification-wrapper";

const UserProfileNotifications = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { data } = await getNotificationsAction({ ...searchParams, pageSize: "10" });

  return (
    <div className="md:border md:border-grey-100 rounded-2xl pb-0">
      <h1 className="font-medium py-2.5 md:py-6 md:px-8 md:border-b md:border-b-grey-100">All Notifications</h1>
      <UserProfileNotificationsWrapper data={data} />
    </div>
  );
};

export default UserProfileNotifications;
