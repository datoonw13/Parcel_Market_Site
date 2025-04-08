"use client";

import { INotification } from "@/types/notifications";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { notificationsAtom } from "@/atoms/notifications-atom";
import Link from "next/link";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import Popper from "../../../shared/Popper";
import NotificationItem from "../notification-item";
import Button from "../../../shared/forms/Button";
import DataNotFound from "../../../shared/DataNotFound";
import UserHeaderNotificationButton from "./user-header-notification-button";

const UserHeaderNotifications = ({ data }: { data: { list: INotification[] | null; unread: number } }) => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const router = useRouter();

  useEffect(() => {
    setNotifications((prev) => ({ ...prev, ...data }));
  }, [data, setNotifications]);

  return (
    <Popper
      placement="bottom"
      renderButton={(setReferenceElement, referenceElement) => (
        <UserHeaderNotificationButton
          onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
          active={!!referenceElement}
          unreadMessages={notifications.unread || 0}
        />
      )}
      renderContent={(setReferenceElement) => (
        <div className="z-10 rounded-xl bg-white shadow-1 flex flex-col items-center w-96 [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100">
          <p className="text-xs text-grey-600 w-full text-start py-3 px-6 !border-b-0">Notifications</p>
          {notifications?.list && notifications.list.length > 0 ? (
            <>
              {notifications?.list?.map((notification) => (
                <div key={notification.id} className="w-full">
                  <NotificationItem
                    onClick={() => {
                      if (!notification.isRead) {
                        setNotifications((prev) => ({
                          ...prev,
                          list: notifications?.list?.map((el) => (el.id === notification.id ? { ...el, isRead: true } : el)) || null,
                          unread: prev.unread - 1,
                        }));
                      }
                      setReferenceElement(null);
                    }}
                    data={notification}
                    isHeaderItem
                    className="py-2 px-6 hover:bg-primary-main-100 transition-all duration-100"
                  />
                </div>
              ))}
              <Link onClick={() => setReferenceElement(null)} href={routes.user.notifications.fullUrl}>
                <Button variant="secondary" className="!text-primary-main !text-sm !outline-none">
                  View All notifications
                </Button>
              </Link>
            </>
          ) : (
            <DataNotFound className="w-full bg-white rounded-none rounded-b-xl text-sm space-y-6" message="No Notifications Yet" />
          )}
        </div>
      )}
    />
  );
};

export default UserHeaderNotifications;
