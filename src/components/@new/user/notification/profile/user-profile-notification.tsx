import { getNotificationsAction } from "@/server-actions/notifications/actions";
import { z } from "zod";
import { userNotificationsValidations } from "@/zod-validations/filters-validations";
import NoResults from "@/components/ui/no-result";
import UserProfileNotificationsWrapper from "./user-profile-notification-wrapper";

const UserProfileNotifications = async ({
  filters,
  pageSize,
  totalItems,
}: {
  filters: z.infer<typeof userNotificationsValidations>;
  pageSize: number;
  totalItems: number;
}) => {
  const { data } = await getNotificationsAction({ ...filters, pageSize });

  if (totalItems === 0) {
    return <NoResults errorMessage="No notifications yet..." className="!mt-16" />;
  }

  if (totalItems > 0 && data?.list.length === 0) {
    return <NoResults errorMessage="No search results..." className="!mt-16" />;
  }

  return (
    <>
      <UserProfileNotificationsWrapper pageSize={pageSize} data={data} />
    </>
  );
};

export default UserProfileNotifications;
