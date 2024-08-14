import { IUser } from "./auth";
import { OfferStatusEnum } from "./offer";

export enum NotificationType {
  NewMessage = "newMessage",
  NewOfferReceived = "newOfferReceived",
  SentOfferStatusUpdate = "sentOfferStatusUpdate",
  ReceivedOfferExpiring = "receivedOfferExpiring",
  SentOfferExpiring = "sentOfferExpiring",
  SubscriptionExpired = "subscriptionExpired",
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
  userChatId: string;
}

export interface INewOfferReceivedNotification extends INotificationBase {
  type: NotificationType.NewOfferReceived;
  offerId: number;
}

export interface ISentOfferStatusUpdateNotification extends INotificationBase {
  type: NotificationType.SentOfferStatusUpdate;
  offerId: number;
  status: OfferStatusEnum;
}

export interface IReceivedOfferExpiringNotification extends INotificationBase {
  type: NotificationType.ReceivedOfferExpiring;
  offerId: number;
}

export interface ISentOfferExpiringNotification extends INotificationBase {
  type: NotificationType.SentOfferExpiring;
  offerId: number;
}

export interface SubscriptionExpiredNotification extends INotificationBase {
  type: NotificationType.SubscriptionExpired;
}

export interface INotificationEnum {
  [NotificationType.NewMessage]: INewMessageNotification;
  [NotificationType.NewOfferReceived]: INewOfferReceivedNotification;
  [NotificationType.SentOfferStatusUpdate]: ISentOfferStatusUpdateNotification;
  [NotificationType.ReceivedOfferExpiring]: IReceivedOfferExpiringNotification;
  [NotificationType.SentOfferExpiring]: ISentOfferExpiringNotification;
  [NotificationType.SubscriptionExpired]: SubscriptionExpiredNotification;
}

export type INotification =
  | INewMessageNotification
  | INewOfferReceivedNotification
  | ISentOfferStatusUpdateNotification
  | IReceivedOfferExpiringNotification
  | ISentOfferExpiringNotification
  | SubscriptionExpiredNotification;
