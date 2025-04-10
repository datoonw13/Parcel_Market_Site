"use client";

import { notificationsAtom } from "@/atoms/notifications-atom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getNotificationsAction } from "@/server-actions/notifications/actions";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { PiBellRingingBold } from "react-icons/pi";
import { motion } from "framer-motion";
import NotificationItem from "@/components/@new/user/notification/notification-item";
import { NotificationType } from "@/types/notifications";
import Link from "next/link";
import routes from "@/helpers/routes";
import { Button } from "@/components/ui/button";
import DataNotFound from "@/components/@new/shared/DataNotFound";
import { useRouter } from "next/navigation";

const HeaderNotifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const unreadNotifications = notifications.unread || 0;

  const initialNotifications = useCallback(async () => {
    setPending(true);
    const { data, errorMessage } = await getNotificationsAction({ page: 1, pageSize: 6 });
    if (!errorMessage) {
      setNotifications((prev) => ({ ...prev, list: data?.list || [], unread: data?.pagination.unreadCount || 0 }));
    }
    setPending(false);
  }, [setNotifications]);

  useEffect(() => {
    initialNotifications();
  }, [initialNotifications]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          id="header-notification-icon"
          className={cn(
            "border border-grey-100 size-10 rounded-full bg-grey-50 flex items-center justify-center cursor-pointer relative",
            "data-[state=open]:bg-grey-100",
            pending && "pointer-events-none opacity-50"
          )}
        >
          <PiBellRingingBold className="size-4" />
          {unreadNotifications ? (
            <div className="size-[18px] rounded-full text-xs bg-primary-main text-white flex items-center justify-center absolute top-0 right-0 translate-x-1/2">
              {unreadNotifications}
            </div>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className="outline-none">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}>
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
                      }}
                      data={notification}
                      isHeaderItem
                      className="py-2 px-6 hover:bg-primary-main-100 transition-all duration-100"
                    />
                  </div>
                ))}
                <Link onClick={() => {}} href={routes.user.notifications.fullUrl}>
                  <Button variant="secondary" className="!text-primary-main !text-sm !outline-none">
                    View All notifications
                  </Button>
                </Link>
              </>
            ) : (
              <DataNotFound className="w-full bg-white rounded-none rounded-b-xl text-sm space-y-6" message="No Notifications Yet" />
            )}
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderNotifications;
