import { getNotificationsAction } from "@/server-actions/notifications/actions";
import UserHeaderNotifications from "./user-header-notifications";

const UserHeaderNotificationWrapper = async () => {
  const { data, errorMessage } = await getNotificationsAction({ page: "1", pageSize: "6" });
  return <UserHeaderNotifications data={{ list: data?.list || null, unread: data?.pagination.unreadCount || 0 }} />;
};

export default UserHeaderNotificationWrapper;
