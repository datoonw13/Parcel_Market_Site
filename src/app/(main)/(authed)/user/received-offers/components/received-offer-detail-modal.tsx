import { Dispatch, FC, SetStateAction } from "react";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Modal from "@/components/@new/shared/modals/Modal";
import Button from "@/components/@new/shared/forms/Button";

interface ReceivedOfferDetailModalProps {
  open: number | null;
  setOpen: Dispatch<SetStateAction<number | null>>;
}

const ReceivedOfferDetailModal: FC<ReceivedOfferDetailModalProps> = ({ open, setOpen }) => (
  <Modal open={!!open} closeModal={() => setOpen(null)}>
   <div className=" max-w-4xl w-full bg-white rounded-2xl ">
   <div className="py-6 px-8 border-b border-b-grey-100 flex items-center justify-between gap-4">
      <h1 className="text-lg font-semibold">Offer Details</h1>
      <Button className="!w-6 !h-6 !p-0 !outline-none" variant="secondary">
          <RemoveIcon2 color="grey-600" className="!w-3 !h-3" />
      </Button>
    </div>
    <div className="my-9">
        content
    </div>
   </div>
  </Modal>
);

export default ReceivedOfferDetailModal;
