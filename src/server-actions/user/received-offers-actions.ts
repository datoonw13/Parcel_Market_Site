"use server";

import { IPagination, ResponseType } from "@/types/common";
import { ReceivedOffersFilters } from "@/types/offer";
import { fetcher } from "../fetcher";

export const getUserReceivedOffers = async (params: ReceivedOffersFilters): Promise<(ResponseType<any[]> & IPagination) | null> => {
  const request = await fetcher<ResponseType<(ResponseType<any[]> & IPagination) | null>>(
    `offers/received?${new URLSearchParams(params as Record<string, string>)}`
  );
  return request.data?.data || null;
};
