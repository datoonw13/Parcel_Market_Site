"use server";

import { IPagination, ResponseModel, ResponseType } from "@/types/common";
import { MakeOfferModel, OfferModel, ReceivedOffersFilters } from "@/types/offer";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ErrorResponse } from "@/helpers/error-response";
import { fetcher } from "../fetcher";
import { offerTag } from "./tags";
import { getUserAction } from "../user/actions";

export const createOfferAction = async (data: MakeOfferModel & { sellingPropertyId: number }): Promise<ResponseModel<null>> => {
  try {
    const req = await fetcher<ResponseType<{ error: boolean }>>(`offers`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidateTag(offerTag);
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
    const user = await getUserAction();
    const request = await fetcher<OfferModel>(`offers/details/${offerId}`, {
      next: { tags: [offerTag] },
    });
    const responseData = {
      ...request,
      offerGivenBy: { firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", id: user?.id ?? 0 },
    };
    return {
      errorMessage: null,
      data: { ...responseData },
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
        next: { tags: [offerTag] },
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
    revalidateTag(offerTag);
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
    revalidateTag(offerTag);
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
    revalidateTag(offerTag);
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
      next: { tags: [offerTag] },
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
export const getSentOffersAction = async (
  pageSize: number,
  params?: {
    [key: string]: string;
  }
): Promise<ResponseModel<({ list: OfferModel[] } & IPagination) | null>> => {
  try {
    const user = await getUserAction();
    const request = await fetcher<{ data: OfferModel[] } & IPagination>(
      `offers/sent?${new URLSearchParams({ ...params, pageSize: pageSize.toString() })}`,
      {
        next: { tags: [offerTag] },
      }
    );
    const responseData = {
      ...request,
      list: request.data.map((el) => ({
        ...el,
        offerGivenBy: { firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", id: user?.id ?? 0 },
      })),
    };
    return {
      errorMessage: null,
      data: { ...responseData },
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
  revalidateTag(offerTag);
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
