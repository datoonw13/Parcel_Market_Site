"use server";

import { IPagination, ResponseType } from "@/types/common";
import { ReceivedOfferModel, ReceivedOffersFilters } from "@/types/offer";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetcher } from "../fetcher";
import { userTags } from "./user-tags";

export const getUserReceivedOffers = async (
  params: ReceivedOffersFilters
): Promise<(ResponseType<ReceivedOfferModel[]> & IPagination) | null> => {
  const request = await fetcher<ResponseType<(ResponseType<ReceivedOfferModel[]> & IPagination) | null>>(
    `offers/received?${new URLSearchParams(params as Record<string, string>)}`,
    { next: { tags: [userTags.receivedOffers] } }
  );

  return request.data?.data || null;
};

export const getUserReceivedOfferDetails = async (offerId: string): Promise<ResponseType<ReceivedOfferModel> | null> => {
  const request = await fetcher<ResponseType<ResponseType<ReceivedOfferModel> | null>>(`offers/details/${offerId}`, {
    next: { tags: [userTags.receivedOffers] },
  });

  return request.data?.data || null;
};

export const getUserReceivedOffersParcelNumbers = async (): Promise<string[] | null> => {
  const request = await fetcher<{ data: string[] | null }>(`offers/received/parcel-numbers`, {
    next: { tags: [userTags.receivedOffers] },
  });

  return request.data?.data || null;
};

export const revalidateReceivedOffers = async () => {
  const path = headers().get("referer");
  if (path) {
    revalidateTag(userTags.receivedOffers);
    redirect(path);
  }
};

export const deleteReceivedOffers = async (ids: number[]): Promise<{ error: boolean }> => {
  const request = await fetcher<ResponseType<{ error: boolean }>>(`offers/received`, {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });

  return { error: request.error };
};
