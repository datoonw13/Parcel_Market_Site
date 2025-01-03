import { IUser } from "./auth";
import { OfferStatusEnum } from "./offer";

export enum NotificationType {
  NewMessage = "newMessage",
  NewOfferReceived = "newOfferReceived",
  OfferStatusUpdate = "offerStatusUpdate",
  ReceivedOfferExpiring = "receivedOfferExpiring",
  ReceivedOfferCanceled = "receivedOfferCanceled",
  SentOfferExpiring = "sentOfferExpiring",
  SubscriptionExpired = "subscriptionExpired",
  SubscriptionUpdated = "subscriptionUpdated",
  SubscriptionReminder = "subscriptionReminder",
  SubscriptionFollowUp = "subscriptionFollowUp",
}

export interface INotificationBase {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: number;
  user?: IUser;
}

export interface INewMessageNotification extends INotificationBase {
  type: NotificationType.NewMessage;
}

export interface INewOfferReceivedNotification extends INotificationBase {
  type: NotificationType.NewOfferReceived;
  offerId: number;
}

export interface IOfferStatusUpdateNotification extends INotificationBase {
  type: NotificationType.OfferStatusUpdate;
  offerId: number;
  status: OfferStatusEnum;
}

export interface IReceivedOfferExpiringNotification extends INotificationBase {
  type: NotificationType.ReceivedOfferExpiring;
  offerId: number;
}

export interface IReceivedOfferCanceledNotification extends INotificationBase {
  type: NotificationType.ReceivedOfferCanceled;
  offerId: number;
}

export interface ISentOfferExpiringNotification extends INotificationBase {
  type: NotificationType.SentOfferExpiring;
  offerId: number;
}

export interface SubscriptionExpiredNotification extends INotificationBase {
  type: NotificationType.SubscriptionExpired;
}

export interface SubscriptionUpdatedNotification extends INotificationBase {
  type: NotificationType.SubscriptionUpdated;
}

export interface SubscriptionReminderNotification extends INotificationBase {
  type: NotificationType.SubscriptionReminder;
}

export interface SubscriptionFollowUpNotification extends INotificationBase {
  type: NotificationType.SubscriptionFollowUp;
}

export interface INotificationEnum {
  [NotificationType.NewMessage]: INewMessageNotification;
  [NotificationType.NewOfferReceived]: INewOfferReceivedNotification;
  [NotificationType.OfferStatusUpdate]: IOfferStatusUpdateNotification;
  [NotificationType.ReceivedOfferExpiring]: IReceivedOfferExpiringNotification;
  [NotificationType.ReceivedOfferCanceled]: IReceivedOfferCanceledNotification;
  [NotificationType.SentOfferExpiring]: ISentOfferExpiringNotification;
  [NotificationType.SubscriptionExpired]: SubscriptionExpiredNotification;
  [NotificationType.SubscriptionUpdated]: SubscriptionUpdatedNotification;
  [NotificationType.SubscriptionReminder]: SubscriptionReminderNotification;
  [NotificationType.SubscriptionFollowUp]: SubscriptionFollowUpNotification;
}

export type INotification =
  | INewMessageNotification
  | INewOfferReceivedNotification
  | IOfferStatusUpdateNotification
  | IReceivedOfferExpiringNotification
  | IReceivedOfferCanceledNotification
  | ISentOfferExpiringNotification
  | SubscriptionExpiredNotification
  | SubscriptionUpdatedNotification
  | SubscriptionReminderNotification
  | SubscriptionFollowUpNotification;

export enum NotificationFilter {
  ALL = "all",
  READ = "read",
  UNREAD = "unread",
}
