"use client";

import { INotification, NotificationType } from "@/types/notifications";
import { OfferStatusEnum } from "@/types/offer";
import moment from "moment";
import { IPagination } from "@/types/common";
import { useEffect, useOptimistic, useTransition } from "react";
import Popper from "../../../shared/Popper";
import UserHeaderNotificationButton from "./user-header-notification-button";
import NotificationItem from "../notification-item";
import Button from "../../../shared/forms/Button";
import DataNotFound from "../../../shared/DataNotFound";

const notifications: Array<INotification> = [
  {
    id: 1,
    type: NotificationType.NewMessage,
    title: "Messages Notification",
    message:
      "You have new offer on the 234564 LandYou have new offer on the 234564 LandYou have new offer on the 234564 LandYou have new offer on the 234564 LandLandYou have new offer on the 234564 LandLandYou have new offer on the 234564 Land",
    isRead: false,
    createdAt: new Date(),
    userId: 2,
    userChatId: "213213",
    user: undefined,
  },
  {
    id: 2,
    type: NotificationType.NewOfferReceived,
    title: "Received Offer Notification",
    message: "You have new offer on the 234564 LandYou have new offer on the 234564 LandYou have new offer o",
    isRead: false,
    createdAt: moment().subtract(1, "days").toDate(),
    userId: 2,
    user: undefined,
    offerId: 67,
  },
  {
    id: 3,
    type: NotificationType.OfferStatusUpdate,
    title: "Sent Offer Status Update",
    message: "Offer rejected",
    status: OfferStatusEnum.rejected,
    offerId: 67,
    isRead: false,
    createdAt: moment(new Date()).subtract(3, "day").toDate(),
    userId: 2,
    user: undefined,
  },
  {
    id: 4,
    type: NotificationType.OfferStatusUpdate,
    title: "Sent Offer Status Update",
    message: "Offer accepted",
    status: OfferStatusEnum.accepted,
    offerId: 67,
    isRead: true,
    createdAt: moment(new Date()).subtract(4, "day").toDate(),
    userId: 2,
    user: undefined,
  },
  {
    id: 5,
    type: NotificationType.ReceivedOfferExpiring,
    title: "Received Offer Expiring",
    message: "Received offer expiring",
    offerId: 67,
    isRead: true,
    createdAt: new Date(),
    userId: 2,
    user: undefined,
  },
  {
    id: 6,
    type: NotificationType.SentOfferExpiring,
    title: "Sent Offer Expiring",
    message: "Sent offer Expiring",
    offerId: 67,
    isRead: true,
    createdAt: new Date(),
    userId: 2,
    user: undefined,
  },
  {
    id: 7,
    type: NotificationType.SubscriptionExpired,
    title: "Subscription Expired",
    message: "Subscription Expired",
    isRead: true,
    createdAt: new Date(),
    userId: 2,
    user: undefined,
  },
];

const UserHeaderNotifications = ({ data }: { data: INotification[] | null }) => (
  <Popper
    placement="bottom"
    renderButton={(setReferenceElement, referenceElement) => (
      <UserHeaderNotificationButton
        onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
        active={!!referenceElement}
        unreadMessages={data?.filter((el) => !el.isRead)?.length}
      />
    )}
    renderContent={(setReferenceElement) => (
      <div className="z-10 rounded-xl bg-white shadow-1 flex flex-col items-center w-96 [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100">
        <p className="text-xs text-grey-600 w-full text-start py-3 px-6 !border-b-0">Notifications</p>
        {data && data.length > 0 ? (
          <>
            {data.map((notification) => (
              <div key={notification.id} className="w-full">
                <NotificationItem
                  onClick={() => {
                    setReferenceElement(null);
                  }}
                  data={notification}
                  isHeaderItem
                  className="py-2 px-6 hover:bg-primary-main-100 transition-all duration-100"
                />
              </div>
            ))}
            <Button variant="secondary" className="!text-primary-main !text-sm !outline-none">
              View All notifications
            </Button>
          </>
        ) : (
          <DataNotFound className="w-full bg-white rounded-none rounded-b-xl text-sm space-y-6" message="No Notifications Yet" />
        )}
      </div>
    )}
  />
);

export default UserHeaderNotifications;