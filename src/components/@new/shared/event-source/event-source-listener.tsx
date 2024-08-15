"use client";

import routes from "@/helpers/routes";
import { INotification, NotificationType } from "@/types/notifications";
import { revalidatePath } from "next/cache";
import { useEffect } from "react";

const EventSourceListener = ({ jwt, userId }: { jwt: string; userId: number }) => {
  useEffect(() => {
    const eventSource = new EventSource(`https://api.parcelmarket.com/api/notifications/${userId}?jwt=${jwt}`);
    eventSource.onopen = () => console.log(">>> Connection opened!");
    eventSource.onerror = (e) => console.log("ERROR!", e);
    eventSource.onmessage = (e) => {
      console.log(e);
      try {
        const data = JSON.parse(e.data) as INotification;
        if (data.type === NotificationType.NewOfferReceived || data.type === NotificationType.ReceivedOfferExpiring) {
          revalidatePath(routes.user.offers.sent.fullUrl);
        }
        if (data.type === NotificationType.SentOfferExpiring || data.type === NotificationType.SentOfferStatusUpdate) {
          revalidatePath(routes.user.offers.sent.fullUrl);
        }
      } catch (error) {}
    };

    return () => {
      eventSource.close();
    };
  }, [jwt, userId]);

  return null;
};

export default EventSourceListener;
