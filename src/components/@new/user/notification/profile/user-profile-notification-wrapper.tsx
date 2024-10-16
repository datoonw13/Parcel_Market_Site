"use client";

import { INotification, NotificationFilter } from "@/types/notifications";
import { IPagination } from "@/types/common";
import { FC, useEffect } from "react";
import { useAtom } from "jotai";
import { userNotificationsAtom } from "@/atoms/pages-atom";
import useNotification from "@/hooks/useNotification";
import { cn, updateSearchParamsWithFilters } from "@/lib/utils";
import { userNotificationsValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { removeUserNotifications } from "@/server-actions/notifications/actions";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import NotificationItem from "../notification-item";
import UserProfileNotificationsPagination from "./user-profile-notifications-pagination";
import UserSelectListItems from "../../shared/select-list-items";

interface UserProfileNotificationsWrapperProps {
  data: ({ list: INotification[] } & { pagination: IPagination["pagination"] & { unreadCount: number } }) | null;
  pageSize: number;
}
const UserProfileNotificationsWrapper: FC<UserProfileNotificationsWrapperProps> = ({ data, pageSize }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useNotification();
  const [userNotificationsOption, setUserNotificationsOptions] = useAtom(userNotificationsAtom);

  useEffect(() => {
    setUserNotificationsOptions((prev) => ({
      ...prev,
      isAllSelected: userNotificationsOption.selectedIds.length === data?.list.length,
    }));
  }, [data?.list, setUserNotificationsOptions, userNotificationsOption.selectedIds]);

  useEffect(
    () => () => {
      setUserNotificationsOptions({ selecting: false, selectedIds: [], isAllSelected: false });
    },
    [setUserNotificationsOptions]
  );

  return (
    <>
      {!!(data?.list && data.list.length > 0) && (
        <UserSelectListItems
          label="All"
          isAllSelected={userNotificationsOption.isAllSelected}
          selecting={userNotificationsOption.selecting}
          totalSelectedIds={userNotificationsOption.selectedIds.length}
          totalItems={data?.pagination?.totalCount || 0}
          onSelectClick={() => {
            setUserNotificationsOptions((prev) => ({
              ...prev,
              selecting: !prev.selecting,
              selectedIds: prev.selecting ? [] : prev.selectedIds,
            }));
          }}
          dialogTitle="Delete Selected Notification?"
          dialogDescription="Are you sure that you want to delete the selected notification?"
          onRemove={() => removeUserNotifications(userNotificationsOption.selectedIds)}
          onRemoveSuccess={() => {
            setUserNotificationsOptions({ isAllSelected: false, selectedIds: [], selecting: false });
            notify({ title: "Success!", description: "Your selected notification have been successfully deleted" });
          }}
          sortEnum={NotificationFilter}
          sortChange={(value) => {
            const newSearchParams = updateSearchParamsWithFilters<z.infer<typeof userNotificationsValidations>>(
              [{ key: "filter", value: value as NotificationFilter }],
              searchParams.toString()
            );
            router.push(`${pathname}?${newSearchParams.toString()}`);
          }}
          totalLabel="Notifications"
          selectedFilter={searchParams.get("filter")}
        />
      )}
      <div className="md:border md:border-grey-100 rounded-2xl mt-6 md:mt-4">
        <h1 className="font-medium py-2.5 md:py-6 md:px-8 md:border-b md:border-b-grey-100">All Notifications</h1>
        <div className="[&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-b-grey-100 [&>div]:py-2 md:[&>div]:py-3 md:[&>div]:!px-6">
          {data?.list.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-center gap-4 relative",
                userNotificationsOption.selecting &&
                  "after:content-[''] after:absolute after:top-0 after:left-0  after:w-full after:h-full cursor-pointer"
              )}
              onClick={() => {
                if (!userNotificationsOption.selecting) {
                  return;
                }
                if (userNotificationsOption.selectedIds?.includes(Number(notification.id))) {
                  setUserNotificationsOptions((prev) => ({
                    ...prev,
                    selectedIds: prev.selectedIds?.filter((el) => el !== Number(notification.id)) || null,
                  }));
                } else {
                  setUserNotificationsOptions((prev) => ({
                    ...prev,
                    selectedIds: [...(prev.selectedIds || []), Number(notification.id)],
                  }));
                }
              }}
            >
              {userNotificationsOption.selecting && (
                <Checkbox
                  checked={!!userNotificationsOption.selectedIds?.includes(Number(notification.id))}
                  onChange={(e) => e.stopPropagation()}
                />
              )}
              <NotificationItem data={notification} />
            </div>
          ))}
        </div>
        {data && <UserProfileNotificationsPagination pageSize={pageSize} totalCount={data.pagination.totalCount} />}
      </div>
    </>
  );
};

export default UserProfileNotificationsWrapper;
