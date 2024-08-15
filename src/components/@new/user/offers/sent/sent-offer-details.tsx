"use client";

import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import Link from "next/link";
import { useState } from "react";
import { OfferModel, OfferStatusEnum } from "@/types/offer";
import clsx from "clsx";
import toast from "react-hot-toast";
import { deleteSentOffersAction, revalidateSentOffers } from "@/server-actions/offer/actions";
import ResponsiveWarningModal from "@/components/@new/shared/modals/ResponsiveWarningModal";
import OfferDetail from "../details/offer-detail";

const SentOfferDetails = ({
  data,
  contentClassName,
  actionClassName,
}: {
  data: OfferModel;
  contentClassName?: string;
  actionClassName?: string;
}) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [pending, setPending] = useState(false);

  const cancelOffer = async () => {
    setPending(true);
    const { errorMessage } = await deleteSentOffersAction([data.id]);
    if (errorMessage) {
      toast.error(errorMessage);
      setPending(false);
    } else {
      setOpenCancelModal(false);
      await revalidateSentOffers();
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className={clsx("overflow-hidden flex", contentClassName)}>
          <OfferDetail data={data} />
        </div>
        <div className={clsx("flex gap-3 border-t border-t-grey-100", actionClassName)}>
          <Button variant="secondary">Contact Buyer</Button>
          {data.offerStatus === OfferStatusEnum.pending && (
            <Button color="error" className="ml-auto" onClick={() => setOpenCancelModal(true)}>
              Cancel Offer
            </Button>
          )}
          <Link
            className={clsx(data.offerStatus !== OfferStatusEnum.pending && "ml-auto")}
            href={`${routes.marketplace.fullUrl}/${data?.sellingPropertyId}`}
          >
            <Button>View Land</Button>
          </Link>
        </div>
      </div>
      <ResponsiveWarningModal
        open={openCancelModal}
        okLabel="Cancel Offer"
        okPending={pending}
        closeModal={() => {
          setOpenCancelModal(false);
        }}
        onCancel={() => {
          setOpenCancelModal(false);
        }}
        title="Cancel Offer?"
        description="Are you sure you want to cancel your offer?"
        onOK={cancelOffer}
      />
    </>
  );
};

export default SentOfferDetails;
