"use server";

import { IPagination, ResponseModel, ResponseType } from "@/types/common";
import { MakeOfferModel, OfferModel, ReceivedOffersFilters } from "@/types/offer";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ErrorResponse } from "@/helpers/error-response";
import { fetcher } from "../fetcher";
import { offerTags } from "./tags";

export const getReceivedOffersAction = async (
  params: ReceivedOffersFilters
): Promise<ResponseModel<({ list: OfferModel[] } & IPagination) | null>> => {
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

export const getOfferDetailAction = async (offerId: string): Promise<ResponseModel<OfferModel | null>> => {
  try {
    const request = await fetcher<OfferModel>(`offers/details/${offerId}`, {
      next: { tags: [offerTags.receivedOffers] },
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

export const getReceivedOffersParcelNumbersAction = async (): Promise<ResponseModel<string[] | null>> => {
  try {
    const request = await fetcher<string[] | null>(`offers/received/parcel-numbers`, {
      next: { tags: [offerTags.receivedOffers] },
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

// export const revalidateReceivedOffers = async () => {
//   const path = headers().get("referer");
//   if (path) {
//     revalidateTag(offerTags.receivedOffers);
//     redirect(path);
//   }
// };

export const deleteReceivedOffersAction = async (ids: number[]): Promise<ResponseModel<null>> => {
  try {
    await fetcher<ResponseType<{ error: boolean }>>(`offers/received`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
    // revalidateReceivedOffers();
    return { data: null, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};

export const createOfferAction = async (data: MakeOfferModel & { sellingPropertyId: number }): Promise<ResponseModel<null>> => {
  try {
    const req = await fetcher<ResponseType<{ error: boolean }>>(`offers`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // TODO: revalidte sent offers page
    revalidateTag(offerTags.receivedOffers);
    return { data: null, errorMessage: null };
  } catch (error) {
    const errorData = error as ErrorResponse;
    return {
      errorMessage: errorData.message,
      data: null,
    };
  }
};
