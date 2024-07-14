import { FC } from "react";
import Modal from "@/components/@new/shared/modals/Modal";
import Button from "@/components/@new/shared/forms/Button";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import CreateOffer from "./create-offer";

interface CreateOfferModalProps {
  open: boolean;
  closeModal: () => void;
  sellingPropertyId: string;
}

const CreateOfferModal: FC<CreateOfferModalProps> = ({ closeModal, open, sellingPropertyId }) => (
  <Modal open={open} closeModal={() => {}}>
    <div className="max-w-4xl w-full mx-9 bg-white rounded-xl grid overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-8 py-6 border-b border-b-grey-100 sticky top-0 bg-white z-10">
        <h1 className="font-semibold text-lg">Offer Details</h1>
        <Button variant="secondary" className="!p-0 !w-6 !h-6 !outline-none" onClick={closeModal}>
          <RemoveIcon2 className="!h-3 !w-3 fill-grey-600" />
        </Button>
      </div>
      <div className="pt-6 h-[80vh] grid overflow-hidden">
        <CreateOffer sellingPropertyId={Number(sellingPropertyId)} goBack={closeModal} />
      </div>
    </div>
  </Modal>
);

export default CreateOfferModal;
