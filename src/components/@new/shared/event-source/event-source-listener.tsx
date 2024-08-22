"use client";

import { notificationsAtom } from "@/atoms/notifications-atom";
import routes from "@/helpers/routes";
import { revalidatePath, revalidateTag } from "@/server-actions/common-actions";
import { notificationsTag } from "@/server-actions/notifications/tags";
import { INotification } from "@/types/notifications";
import { useAtom } from "jotai";
import { useEffect } from "react";

const EventSourceListener = ({ jwt, userId }: { jwt: string; userId: number }) => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  useEffect(() => {
    const eventSource = new EventSource(`https://api.parcelmarket.com/api/notifications/${userId}?jwt=${jwt}`);
    eventSource.onopen = () => console.log(">>> Connection opened!");
    eventSource.onerror = (e) => console.log("ERROR!", e);
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as { statusCode: number; message: string; data: INotification };
        let newNotifications = notifications.data ? [...notifications.data] : [];
        if (notifications?.data?.length === 6) {
          newNotifications = newNotifications.slice(1);
        }
        newNotifications.push(data.data);
        setNotifications((prev) => ({
          data: newNotifications,
          unread: prev.unread + 1,
        }));
        revalidateTag(notificationsTag);
        revalidatePath(routes.user.offers.received.fullUrl);
        revalidatePath(routes.user.offers.sent.fullUrl);
      } catch (error) {}
    };

    return () => {
      eventSource.close();
    };
  }, [jwt, notifications, setNotifications, userId]);

  return null;
};

export default EventSourceListener;
