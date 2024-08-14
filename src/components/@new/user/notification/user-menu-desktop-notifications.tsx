"use client";

import React, { FC } from "react";
import { INotification, NotificationType } from "@/types/notifications";
import { OfferStatusEnum } from "@/types/offer";
import moment from "moment";
import Popper from "../../shared/Popper";
import UserMenuNotificationButton from "./user-menu-notification-button";
import NotificationItem from "./notification-item";
import Button from "../../shared/forms/Button";
import DataNotFound from "../../shared/DataNotFound";

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
    offerId: 2,
  },
  {
    id: 3,
    type: NotificationType.SentOfferStatusUpdate,
    title: "Sent Offer Status Update",
    message: "Offer rejected",
    status: OfferStatusEnum.rejected,
    offerId: 2,
    isRead: false,
    createdAt: moment(new Date()).subtract(3, "day").toDate(),
    userId: 2,
    user: undefined,
  },
  {
    id: 4,
    type: NotificationType.SentOfferStatusUpdate,
    title: "Sent Offer Status Update",
    message: "Offer accepted",
    status: OfferStatusEnum.accepted,
    offerId: 2,
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
    offerId: 2,
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
    offerId: 2,
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

const UserMenuDesktopNotifications = () => (
  <Popper
    placement="bottom"
    renderButton={(setReferenceElement, referenceElement) => (
      <UserMenuNotificationButton
        onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
        active={!!referenceElement}
      />
    )}
    renderContent={(setReferenceElement) => (
      <div className="z-10 rounded-xl bg-white shadow-1 flex flex-col items-center w-96 [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100">
        <p className="text-xs text-grey-600 w-full text-start py-3 px-6 !border-b-0">Notifications</p>
        {true ? (
          <>
            {notifications.map((notification) => (
              <div key={notification.id} onClick={() => setReferenceElement(null)} className="w-full">
                <NotificationItem
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

export default UserMenuDesktopNotifications;
