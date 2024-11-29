import React, { FC } from "react";
import { getSearchDetails } from "@/server-actions/user-searches/actions";
import { AsyncReturnType } from "@/types/common";
import { getUserAction } from "@/server-actions/user/actions";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import ListItemHeader from "./list-item-header";
import ListItemContent from "./list-item-content";
import ListItem from "./list-item";

interface ListItemWrapperProps {
  data: { title: string; id: number };
  viewId: number | null;
  isLast: boolean;
  isFirst: boolean;
}
const ListItemWrapper: FC<ListItemWrapperProps> = async ({ data, viewId, isFirst, isLast }) => {
  let req: AsyncReturnType<typeof getSearchDetails> | null = null;
  const user = await getUserAction();
  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  if (viewId === data.id) {
    req = await getSearchDetails(data.id);
  }

  return <ListItem isLast={isLast} isFirst={isFirst} data={data} searchData={req?.data || null} viewId={viewId} />;
};

export default ListItemWrapper;
