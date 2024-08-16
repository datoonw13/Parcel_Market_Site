"use client";

import routes from "@/helpers/routes";
import { revalidatePath, revalidateTag } from "@/server-actions/common-actions";
import { notificationsTag } from "@/server-actions/notifications/tags";
import { INotification, NotificationType } from "@/types/notifications";
import { useEffect } from "react";

const EventSourceListener = ({ jwt, userId }: { jwt: string; userId: number }) => {
  useEffect(() => {
    const eventSource = new EventSource(`https://api.parcelmarket.com/api/notifications/${userId}?jwt=${jwt}`);
    eventSource.onopen = () => console.log(">>> Connection opened!");
    eventSource.onerror = (e) => console.log("ERROR!", e);
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as { statusCode: number; message: string; data: INotification };
        if (data.data.type === NotificationType.NewOfferReceived || data.data.type === NotificationType.ReceivedOfferExpiring) {
          revalidatePath(routes.user.offers.sent.fullUrl);
        }
        if (data.data.type === NotificationType.SentOfferExpiring || data.data.type === NotificationType.OfferStatusUpdate) {
          revalidatePath(routes.user.offers.sent.fullUrl);
        }
        revalidateTag(notificationsTag);
      } catch (error) {}
    };

    return () => {
      eventSource.close();
    };
  }, [jwt, userId]);

  return null;
};

export default EventSourceListener;
