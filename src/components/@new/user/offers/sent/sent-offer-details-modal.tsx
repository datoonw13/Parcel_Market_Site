import { FC, useState } from "react";
import Modal from "@/components/@new/shared/modals/Modal";
import Button from "@/components/@new/shared/forms/Button";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import { OfferModel } from "@/types/offer";
import Link from "next/link";
import routes from "@/helpers/routes";
import ResponsiveRemoveModal from "@/components/@new/shared/modals/ResponsiveRemoveModal";
import OfferDetail from "../details/offer-detail";

interface SentOfferDetailsModalProps {
  closeModal: () => void;
  data: OfferModel | null;
}

const SentOfferDetailsModal: FC<SentOfferDetailsModalProps> = ({ closeModal, data }) => {
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
          <div className="pt-6 h-[70vh] overflow-hidden flex px-8 [&>div]:pb-32">{data && <OfferDetail data={data} />}</div>
          <div className="py-4 px-8 flex gap-3 border-t border-t-grey-100">
            <Button variant="secondary">Contact Buyer</Button>
            <Button color="error" className="ml-auto" onClick={() => setOpenCancelModal(true)}>
              Cancel Offer
            </Button>
            <Link href={`${routes.marketplace.fullUrl}/${data?.id}`}>
              <Button>View Land</Button>
            </Link>
          </div>
        </div>
      </Modal>
      <ResponsiveRemoveModal
        open={openCancelModal}
        pending={false}
        handleClose={() => {
          setOpenCancelModal(false);
        }}
        onReject={() => {
          setOpenCancelModal(false);
        }}
        title="Cancel Offer??"
        desc="Are you sure you want to cancel your offer?"
        onOk={() => setOpenCancelModal(false)}
      />
    </>
  );
};

export default SentOfferDetailsModal;
