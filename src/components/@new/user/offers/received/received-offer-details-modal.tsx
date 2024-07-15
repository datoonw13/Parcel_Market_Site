import { FC, useState } from "react";
import Modal from "@/components/@new/shared/modals/Modal";
import Button from "@/components/@new/shared/forms/Button";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import { OfferModel } from "@/types/offer";
import Link from "next/link";
import routes from "@/helpers/routes";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import OfferDetail from "../details/offer-detail";
import OfferDetailsWrapper from "./offer-details-wrapper";

interface ReceivedOfferDetailsModalProps {
  closeModal: () => void;
  data: OfferModel | null;
}

const ReceivedOfferDetailsModal: FC<ReceivedOfferDetailsModalProps> = ({ closeModal, data }) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);

  return (
    <>
      <Modal open={!!data && !openCancelModal} closeModal={closeModal}>
        <div className="max-w-4xl w-full mx-9 bg-white rounded-xl grid overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-8 py-6 border-b border-b-grey-100 sticky top-0 bg-white z-10">
            <h1 className="font-semibold text-lg">Offer Details</h1>
            <Button variant="secondary" className="!p-0 !w-6 !h-6 !outline-none" onClick={closeModal}>
              <RemoveIcon2 className="!h-3 !w-3 fill-grey-600" />
            </Button>
          </div>
          {data && (
            <div className="h-[70vh] flex w-full">
              <OfferDetailsWrapper data={data} contentClassName="px-8 py-6" actionClassName="px-8 py-4" />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ReceivedOfferDetailsModal;
