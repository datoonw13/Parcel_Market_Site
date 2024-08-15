"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { IPagination, ResponseModel } from "@/types/common";
import { INotification } from "@/types/notifications";
import { revalidateTag } from "next/cache";
import { fetcher } from "../fetcher";
import { notificationsTag } from "./tags";

export const getNotificationsAction = async (params: {
  page: number;
  pageSize: number;
}): Promise<ResponseModel<({ list: INotification[] } & IPagination) | null>> => {
  try {
    const searchParams = new URLSearchParams({ page: params.page.toString(), pageSize: params.pageSize.toString() });
    const data = await fetcher<({ data: INotification[] } & IPagination) | null>(`notifications?${searchParams.toString()}`, {
      method: "GET",
      next: {
        tags: [notificationsTag],
      },
    });

    return {
      errorMessage: null,
      data: data
        ? {
            list: data.data,
            pagination: data.pagination,
          }
        : null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const markNotificationAsReadAction = async (notificationId: number): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>(`notifications/mark-read/${notificationId}`, {
      method: "POST",
    });
    revalidateTag(notificationsTag);
    return {
      errorMessage: null,
      data: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const revalidateOffers = () => {
  revalidateTag(notificationsTag);
};
