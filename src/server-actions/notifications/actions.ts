"use server";

import { ErrorResponse } from "@/helpers/error-response";
import { IPagination, ResponseModel } from "@/types/common";
import { INotification } from "@/types/notifications";
import { revalidateTag } from "next/cache";
import { userNotificationsValidations, userSearchesValidations } from "@/zod-validations/filters-validations";
import { z } from "zod";
import { fetcher } from "../fetcher";
import { notificationsTag } from "./tags";

export const getNotificationsAction = async (
  filters: Partial<z.infer<typeof userNotificationsValidations>> & { pageSize: number }
): Promise<ResponseModel<({ list: INotification[] } & { pagination: IPagination["pagination"] & { unreadCount: number } }) | null>> => {
  try {
    const formattedFilters = Object.keys(filters).reduce((acc, cur) => {
      if (filters[cur as keyof typeof filters]) {
        return {
          ...acc,
          [cur]: filters[cur as keyof typeof filters]?.toString(),
        };
      }
      return {
        ...acc,
      };
    }, {});

    const searchParams = new URLSearchParams(formattedFilters);
    const data = await fetcher<({ data: INotification[] } & { pagination: IPagination["pagination"] & { unreadCount: number } }) | null>(
      `notifications?${searchParams.toString()}`,
      {
        method: "GET",
        next: {
          tags: [notificationsTag],
        },
        cache: "no-cache",
      }
    );

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
      errorMessage: errorData?.message,
      data: null,
    };
  }
};

export const removeUserNotifications = async (ids: number[]): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>(`notifications`, {
      method: "DELETE",
      body: JSON.stringify({ ids: [...ids] }),
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
