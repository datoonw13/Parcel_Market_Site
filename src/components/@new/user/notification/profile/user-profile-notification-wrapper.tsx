"use client";

import { INotification, NotificationType } from "@/types/notifications";
import { useUnreads } from "@talkjs/react";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import { IPagination } from "@/types/common";
import { FC } from "react";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import NotificationItem from "../notification-item";
import UserProfileNotificationsPagination from "./user-profile-notifications-pagination";

interface UserProfileNotificationsWrapperProps {
  data: ({ list: INotification[] } & { pagination: IPagination["pagination"] & { unreadCount: number } }) | null;
}
const UserProfileNotificationsWrapper: FC<UserProfileNotificationsWrapperProps> = ({ data }) => {
  const router = useRouter();
  const unreadTalkJsMessages = useUnreads();

  return data?.pagination.totalCount === 0 && !unreadTalkJsMessages?.length ? (
    <DataNotFound message="Notifications not found..." />
  ) : (
    <>
      <div className="[&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100 [&>div]:py-2 md:[&>div]:py-3 md:[&>div]:!px-6">
        {unreadTalkJsMessages?.length ? (
          <NotificationItem
            onClick={() => {
              router.push(routes.user.messages.fullUrl);
            }}
            data={{
              createdAt: new Date(),
              id: -1,
              isRead: false,
              message: "You have new messages",
              type: NotificationType.NewMessage,
              title: "Message Notification",
              userId: -1,
            }}
            className="py-2 px-6 hover:bg-primary-main-100 transition-all duration-100"
          />
        ) : null}
        {data?.list.map((notification) => (
          <NotificationItem data={notification} key={notification.id} />
        ))}
      </div>
      {data && <UserProfileNotificationsPagination totalCount={data.pagination.totalCount} />}
    </>
  );
};

export default UserProfileNotificationsWrapper;
