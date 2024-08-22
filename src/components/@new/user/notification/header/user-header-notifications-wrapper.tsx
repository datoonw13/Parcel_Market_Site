import { getNotificationsAction } from "@/server-actions/notifications/actions";
import UserHeaderNotifications from "./user-header-notifications";

const UserHeaderNotificationWrapper = async () => {
  const { data, errorMessage } = await getNotificationsAction({ page: "1", pageSize: "6" });
  return <UserHeaderNotifications unreadNotifications={data?.pagination.unreadCount} data={data?.list || null} />;
};

export default UserHeaderNotificationWrapper;
