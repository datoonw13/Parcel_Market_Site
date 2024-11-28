import React, { FC } from "react";
import { getSearchDetails } from "@/server-actions/user-searches/actions";
import { AsyncReturnType } from "@/types/common";
import ListItemHeader from "./list-item-header";
import ListItemContent from "./list-item-content";
import ListItem from "./list-item";

interface ListItemWrapperProps {
  data: { title: string; id: number };
  viewId: number | null;
}
const ListItemWrapper: FC<ListItemWrapperProps> = async ({ data, viewId }) => {
  let req: AsyncReturnType<typeof getSearchDetails> | null = null;

  if (viewId === data.id) {
    req = await getSearchDetails(data.id);
  }

  return <ListItem data={data} searchData={req} viewId={viewId} />;
};

export default ListItemWrapper;
