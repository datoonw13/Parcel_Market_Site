"use client";

import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Button from "@/components/@new/shared/forms/Button";
import Modal from "@/components/@new/shared/modals/Modal";
import { OfferModel } from "@/types/offer";
import { FC } from "react";
import SimpleBar from "simplebar-react";
import OfferFullDetail from "./offer-full-detail/received-offer-full-detail";

interface OfferDetailModalProps {
  data: OfferModel | null;
  handleClose: () => void;
}
const OfferDetailModal: FC<OfferDetailModalProps> = ({ data, handleClose }) => (
  <Modal open={!!data}>
    <div className="max-w-4xl w-full mx-9 bg-white rounded-xl grid overflow-hidden">
      <SimpleBar className="max-h-[80vh]">
        <div className="flex items-center justify-between gap-4 px-8 py-6 border-b border-b-grey-100 sticky top-0 bg-white z-10">
          <h1 className="font-semibold text-lg">Offer Details</h1>
          <Button variant="secondary" className="!p-0 !w-6 !h-6 !outline-none">
            <RemoveIcon2 className="!h-3 !w-3 fill-grey-600" />
          </Button>
        </div>
        <div className="pt-6 px-8">{data && <OfferFullDetail data={data} actionClasses="sticky bottom-0 bg-white mt-8 pb-8" />}</div>
      </SimpleBar>
    </div>
  </Modal>
);

export default OfferDetailModal;
