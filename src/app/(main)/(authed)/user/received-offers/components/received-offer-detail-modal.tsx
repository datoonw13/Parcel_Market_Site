import { Dispatch, FC, SetStateAction } from "react";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Modal from "@/components/@new/shared/modals/Modal";
import Button from "@/components/@new/shared/forms/Button";
import { ReceivedOfferModel } from "@/types/offer";
import ReceivedOfferFullDetail from "./received-offer-full-detail";

interface ReceivedOfferDetailModalProps {
  data: ReceivedOfferModel | null;
  setOpen: Dispatch<SetStateAction<ReceivedOfferModel | null>>;
}

const ReceivedOfferDetailModal: FC<ReceivedOfferDetailModalProps> = ({ data, setOpen }) => (
  <Modal open={!!data} closeModal={() => setOpen(null)}>
    <div className=" max-w-4xl w-full bg-white rounded-2xl ">
      <div className="py-6 px-8 border-b border-b-grey-100 flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Offer Details</h1>
        <Button className="!w-6 !h-6 !p-0 !outline-none" variant="secondary">
          <RemoveIcon2 color="grey-600" className="!w-3 !h-3" />
        </Button>
      </div>
      <div className="my-9">{data && <ReceivedOfferFullDetail data={data} />}</div>
    </div>
  </Modal>
);

export default ReceivedOfferDetailModal;
