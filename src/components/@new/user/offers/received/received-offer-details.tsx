"use client";

import Button from "@/components/@new/shared/forms/Button";
import { useEffect, useState } from "react";
import { OfferModel, OfferStatusEnum } from "@/types/offer";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import clsx from "clsx";
import { acceptReceivedOffer, rejectReceivedOffer } from "@/server-actions/offer/actions";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import ResponsiveAcceptModal from "@/components/@new/shared/modals/ResponsiveAcceptModal";
import useMediaQuery from "@/hooks/useMediaQuery";
import routes from "@/helpers/routes";
import OfferDetail from "../details/offer-detail";

const ReceivedOfferDetails = ({
  data,
  contentClassName,
  actionClassName,
}: {
  data: OfferModel;
  contentClassName?: string;
  actionClassName?: string;
}) => {
  const [pending, setPending] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [openAcceptModal, setOpenAcceptModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isSmallDevice = useMediaQuery(1024);

  const rejectOffer = async () => {
    setPending(true);
    const { errorMessage } = await rejectReceivedOffer(data.id);
    if (errorMessage) {
      toast.error(errorMessage);
      setPending(false);
    } else {
      router.replace(`${pathname}?reject=${data.id}`);
    }
  };

  const acceptOffer = async () => {
    setPending(true);
    const { errorMessage } = await acceptReceivedOffer(data.id);
    if (errorMessage) {
      toast.error(errorMessage);
      setPending(false);
    } else {
      router.replace(`${pathname}?accept=${data.id}`);
    }
  };

  useEffect(() => {
    if (isSmallDevice) {
      router.push(`${routes.user.offers.received.fullUrl}/details/${data.id}`);
    }
  }, [isSmallDevice]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className={clsx("overflow-hidden flex", contentClassName)}>
          <OfferDetail data={data} />
        </div>
        <div className={clsx("flex gap-3 border-t border-t-grey-100", actionClassName)}>
          <Button variant="secondary">Contact Buyer</Button>
          {data.offerStatus === OfferStatusEnum.pending && (
            <>
              <Button color="error" className="ml-auto" onClick={() => setOpenRejectModal(true)}>
                Decline
              </Button>
              <Button onClick={() => setOpenAcceptModal(true)}>Accept</Button>
            </>
          )}
        </div>
      </div>
      <ResponsiveRemoveModal
        open={openRejectModal}
        pending={pending}
        handleClose={() => {
          setOpenRejectModal(false);
        }}
        onReject={() => {
          setOpenRejectModal(false);
        }}
        title="Decline Offer?"
        desc="Are you sure you want to decline this offer?"
        onOk={rejectOffer}
        acceptLabel="Decline"
      />
      <ResponsiveAcceptModal
        open={openAcceptModal}
        pending={pending}
        handleClose={() => {
          setOpenAcceptModal(false);
        }}
        onReject={() => {
          setOpenAcceptModal(false);
        }}
        title="Accept Offer??"
        desc="This offer is for initial contact only and is not a binding contract. Please accept to proceed."
        onOk={acceptOffer}
        acceptLabel="Accept"
        cancelLabel="Close"
      />
    </>
  );
};

export default ReceivedOfferDetails;
