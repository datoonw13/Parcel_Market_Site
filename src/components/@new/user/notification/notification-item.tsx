"use client";

import { INotification, INotificationEnum, NotificationType } from "@/types/notifications";
import { OfferStatusEnum } from "@/types/offer";
import { IoMdGift } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { TbMessageDots } from "react-icons/tb";
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";
import { cn } from "@/helpers/common";
import moment from "moment";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import { markNotificationAsReadAction } from "@/server-actions/notifications/actions";
import { BsClockHistory } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";

const getIcon = <T extends keyof INotificationEnum>(data: INotificationEnum[T]) => {
  switch (data.type) {
    case NotificationType.NewMessage:
      return <TbMessageDots className="size-4" />;
    case NotificationType.NewOfferReceived:
      return <IoMdGift className="size-4" />;
    case NotificationType.OfferStatusUpdate:
      return data.status === OfferStatusEnum.accepted ? <IoCheckmarkOutline className="size-4" /> : <MdClose className="size-4" />;
    case NotificationType.ReceivedOfferExpiring:
      return <LuAlarmClock className="size-4" />;
    case NotificationType.ReceivedOfferCanceled:
      return <MdClose className="size-4" />;
    case NotificationType.SentOfferExpiring:
      return <LuAlarmClock className="size-4" />;
    case NotificationType.SubscriptionExpired:
      return <BsClockHistory className="size-4" />;
    case NotificationType.SubscriptionUpdated:
      return <GrUpdate className="size-4" />;
    default:
      return null;
  }
};

const NotificationItem = <T extends NotificationType>({
  data,
  isHeaderItem,
  className,
  onClick,
}: {
  data: INotificationEnum[T];
  isHeaderItem?: boolean;
  className?: string;
  onClick?: (notification: INotification) => void;
}) => {
  const router = useRouter();
  const dayDiff = Number(moment(new Date()).diff(data.createdAt, "days"));

  const handleClick = async () => {
    onClick && onClick(data);
    if (!data.isRead) {
      markNotificationAsReadAction(data.id);
    }
    if (data.type === NotificationType.NewMessage) {
      console.log("open chat");
    } else if (data.type === NotificationType.SubscriptionExpired) {
      router.push(routes.user.subscription.fullUrl);
    } else if (data.type === NotificationType.NewOfferReceived || data.type === NotificationType.ReceivedOfferExpiring) {
      router.push(`${routes.user.offers.received.fullUrl}?offerId=${data.offerId}`);
    } else if (data.type === NotificationType.SentOfferExpiring || data.type === NotificationType.OfferStatusUpdate) {
      router.push(`${routes.user.offers.sent.fullUrl}?offerId=${data.offerId}`);
    }
  };

  return (
    <div onClick={handleClick} className={cn("space-y-0.5 w-full cursor-pointer", className)}>
      <div className="flex justify-between gap-5 items-center3">
        <div
          className={cn(
            "grid grid-cols-[minmax(0,_max-content)_1fr_minmax(0,_max-content)] items-center ",
            isHeaderItem ? "gap-2" : "gap-2 md:gap-3"
          )}
        >
          {getIcon(data)}
          <p className={cn(isHeaderItem ? "text-sm" : "text-sm md:text-base md:font-medium")}>{data.title}</p>
          {!data.isRead && <div className="size-2 rounded-full bg-primary-main" />}
        </div>
        <p className="text-xss text-grey-600">{dayDiff === 0 ? "Today" : `${dayDiff} Days ago`}</p>
      </div>
      <div className={cn("grid grid-cols-[minmax(0,_max-content)_1fr]", isHeaderItem ? "gap-2" : "gap-2 md:gap-3")}>
        <div className="opacity-0">{getIcon(data)}</div>
        <p
          className={cn(
            "text-grey-800 text-start",
            isHeaderItem ? "text-xs overflow-hidden whitespace-nowrap text-ellipsis inline-block" : "text-xs md:text-sm"
          )}
        >
          {data.message}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;
