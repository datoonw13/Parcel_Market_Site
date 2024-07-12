"use server";

import { IPagination, ResponseType } from "@/types/common";
import { MakeOfferModel, OfferModel, ReceivedOffersFilters } from "@/types/offer";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { fetcher } from "../fetcher";
import { userTags } from "./user-tags";

export const getReceivedOffers = async (params: ReceivedOffersFilters): Promise<(ResponseType<OfferModel[]> & IPagination) | null> => {
  const request = await fetcher<ResponseType<(ResponseType<OfferModel[]> & IPagination) | null>>(
    `offers/received?${new URLSearchParams(params as Record<string, string>)}`,
    { next: { tags: [userTags.receivedOffers] } }
  );

  return request.data?.data || null;
};

export const getOfferDetail = async (offerId: string): Promise<OfferModel | null> => {
  const request = await fetcher<ResponseType<OfferModel | null>>(`offers/details/${offerId}`, {
    next: { tags: [userTags.receivedOffers] },
  });

  return request.data?.data || null;
};

export const getReceivedOffersParcelNumbers = async (): Promise<string[] | null> => {
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

export const makeOfferAction = async (data: MakeOfferModel & { sellingPropertyId: number }): Promise<{ error: boolean }> => {
  const request = await fetcher<ResponseType<{ error: boolean }>>(`offers`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return { error: request.error };
};
