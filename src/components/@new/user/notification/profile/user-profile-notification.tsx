import DataNotFound from "@/components/@new/shared/DataNotFound";
import { getNotificationsAction } from "@/server-actions/notifications/actions";
import NotificationItem from "../notification-item";
import UserProfileNotificationsPagination from "./user-profile-notifications-pagination";

const UserProfileNotifications = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { data, errorMessage } = await getNotificationsAction({ ...searchParams, pageSize: "10" });

  return (
    <div className="md:border md:border-grey-100 rounded-2xl pb-6">
      <h1 className="font-medium py-2.5 md:py-6 md:px-8 md:border-b md:border-b-grey-100">All Notifications</h1>
      {!data || data.pagination.totalCount === 0 ? (
        <DataNotFound message="Data not found..." />
      ) : (
        <>
          <div className="[&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100 [&>div]:py-2 md:[&>div]:py-3 md:[&>div]:!px-6">
            {data.list.map((notification) => (
              <NotificationItem data={notification} key={notification.id} />
            ))}
          </div>
          <UserProfileNotificationsPagination totalCount={data.pagination.totalCount} />
        </>
      )}
    </div>
  );
};

export default UserProfileNotifications;
