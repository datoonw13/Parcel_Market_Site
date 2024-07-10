import { RemoveIcon1, RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Modal from "@/components/@new/shared/modals/Modal";

const ReceivedOfferDesktopDetail = () => (
  <Modal open>
    <div className="bg-white rounded-2xl max-w-4xl w-full mx-5">
      <div className="py-6 px-8 flex justify-between items-center gap-4 border-b border-b-grey-100">
        <h1 className="font-semibold text-lg">Offer Details</h1>
        <RemoveIcon2 className="!w-3 !h-3 fill-grey-600" />
      </div>
      <div className="py-16">aee</div>
    </div>
  </Modal>
);

export default ReceivedOfferDesktopDetail;
