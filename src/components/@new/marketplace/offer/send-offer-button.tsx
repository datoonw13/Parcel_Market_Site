"use client";

import { FC, useState } from "react";
import { MakeOfferModel } from "@/types/offer";
import { createOfferAction } from "@/server-actions/offer/actions";
import toast from "react-hot-toast";
import Button from "../../shared/forms/Button";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import { InfoIcon2 } from "../../icons/InfoIcons";

interface SendOfferButtonProps {
  onClick: (openWarningModal: () => void) => void;
  sellingPropertyId: number;
  goBack: () => void;
  data: MakeOfferModel;
}

const SendOfferButton: FC<SendOfferButtonProps> = ({ onClick, goBack, sellingPropertyId, data }) => {
  const [openModal, setOpenModal] = useState(false);
  const [pending, setPending] = useState(false);

  const createOffer = async () => {
    setPending(true);
    const { errorMessage } = await createOfferAction({ ...data, sellingPropertyId });
    if (errorMessage) {
      toast.error(errorMessage, { duration: 3000 });
      setPending(false);
    } else {
      toast.success("Offer Has Been Sent");
      goBack();
    }
  };

  return (
    <>
      <ResponsiveWarningModal
        open={openModal}
        closeModal={() => setOpenModal(false)}
        description="This offer is for initial contact only and is not a binding contract. Please accept to proceed."
        title="Disclosure Notice"
        onOK={createOffer}
        okPending={pending}
        customIcon={<InfoIcon2 className="!w-4 !h-4 min-w-4 min-h-4" color="primary-main" />}
        onCancel={() => setOpenModal(false)}
        okLabel="Accept"
        cancelLabel="Close"
      />
      <Button className="w-full sm:w-fit" onClick={() => onClick(() => setOpenModal(true))}>
        Offer Price
      </Button>
    </>
  );
};

export default SendOfferButton;
