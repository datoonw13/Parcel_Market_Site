"use server";

import { IPagination, ResponseModel, ResponseType } from "@/types/common";
import { MakeOfferModel, OfferModel, ReceivedOffersFilters } from "@/types/offer";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ErrorResponse } from "@/helpers/error-response";
import { fetcher } from "../fetcher";
import { offerTags } from "./tags";

export const createOfferAction = async (data: MakeOfferModel & { sellingPropertyId: number }): Promise<ResponseModel<null>> => {
  try {
    const req = await fetcher<ResponseType<{ error: boolean }>>(`offers`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidateTag(offerTags.receivedOffers);
    revalidateTag(offerTags.getParcelNumber);
    return { data: null, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getOfferAction = async (offerId: string): Promise<ResponseModel<OfferModel | null>> => {
  try {
    const request = await fetcher<OfferModel>(`offers/details/${offerId}`, {
      next: { tags: [offerTags.getOffer] },
    });
    return {
      errorMessage: null,
      data: request,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

/// /
export const getReceivedOffersAction = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: OfferModel[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: OfferModel[] } & IPagination>(
      `offers/received?${new URLSearchParams(params as Record<string, string>)}`,
      {
        next: { tags: [offerTags.receivedOffers] },
      }
    );
    return {
      errorMessage: null,
      data: { list: request.data, pagination: request.pagination },
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const rejectReceivedOffer = async (offerId: number): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>(`offers/received/reject`, {
      body: JSON.stringify({ ids: [offerId] }),
      method: "POST",
    });
    revalidateTag(offerTags.receivedOffers);
    revalidateTag(offerTags.sentOffers);
    revalidateTag(offerTags.getOffer);
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

export const acceptReceivedOffer = async (offerId: number): Promise<ResponseModel<null>> => {
  try {
    await fetcher<null>(`offers/received/accept`, {
      body: JSON.stringify({ ids: [offerId] }),
      method: "POST",
    });
    revalidateTag(offerTags.receivedOffers);
    revalidateTag(offerTags.sentOffers);
    revalidateTag(offerTags.getOffer);
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

export const deleteReceivedOffersAction = async (ids: number[]): Promise<ResponseModel<null>> => {
  try {
    await fetcher<ResponseType<{ error: boolean }>>(`offers/received`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
    revalidateTag(offerTags.receivedOffers);
    revalidateTag(offerTags.sentOffers);
    revalidateTag(offerTags.getOffer);
    return { data: null, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const getReceivedOffersParcelNumbersAction = async (): Promise<ResponseModel<string[] | null>> => {
  try {
    const request = await fetcher<string[] | null>(`offers/received/parcel-numbers`, {
      next: { tags: [offerTags.getParcelNumber] },
    });

    return {
      data: request,
      errorMessage: null,
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

//
export const getSentOffersAction = async (params: {
  [key: string]: string;
}): Promise<ResponseModel<({ list: OfferModel[] } & IPagination) | null>> => {
  try {
    const request = await fetcher<{ data: OfferModel[] } & IPagination>(
      `offers/sent?${new URLSearchParams({ ...params, pageSize: "4" })}`,
      {
        next: { tags: [offerTags.sentOffers] },
      }
    );
    return {
      errorMessage: null,
      data: { list: request.data, pagination: request.pagination },
    };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const revalidateSentOffers = async () => {
  const path = headers().get("referer");
  if (path) {
    revalidateTag(offerTags.sentOffers);
    redirect(path);
  }
};

export const deleteSentOffersAction = async (ids: number[]): Promise<ResponseModel<null>> => {
  try {
    await fetcher<ResponseType<{ error: boolean }>>(`offers/sent`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
    return { data: null, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
