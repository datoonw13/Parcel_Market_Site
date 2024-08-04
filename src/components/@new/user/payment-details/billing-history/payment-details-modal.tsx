import { FC } from "react";
import { IStripeCharge } from "@/types/subscriptions";
import { RemoveIcon2 } from "../../../icons/RemoveIcons";
import Button from "../../../shared/forms/Button";
import ResponsiveModal from "../../../shared/modals/ResponsiveModal";
import DialogActions from "../../../shared/modals/dialog/dialog-actions";
import PaymentDetailsTable from "./payment-details-table";

interface PaymentDetailsModalProps {
  open: boolean;
  closeModal: () => void;
  data: IStripeCharge[] | null;
}

const Content: FC<PaymentDetailsModalProps> = ({ closeModal, open, data }) => (
  <div className="w-full md:bg-white md:shadow-4 rounded-2xl flex flex-col">
    <div className="flex items-center justify-between gap-2 px-5 py-4 md:px-8 md:py-6 md:border-b md:border-b-grey-100">
      <h1 className="text-lg font-semibold">Billing History</h1>
      <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6 hidden md:block" onClick={closeModal}>
        <RemoveIcon2 className="!w-3 !h-3" color="grey-600" />
      </Button>
    </div>
    <div className="px-5 md:px-8 md:my-6">{data && <PaymentDetailsTable data={data} />}</div>
    <div className="md:hidden mt-7">
      <DialogActions onClose={closeModal} closeLabel="Decline" />
    </div>
  </div>
);

const PaymentDetailsModal: FC<PaymentDetailsModalProps> = (props) => {
  const { closeModal, open } = props;
  return (
    <ResponsiveModal
      content={<Content {...props} />}
      responsiveContent={<Content {...props} />}
      open={open}
      handleClose={closeModal}
      desktopModalContentClasses="max-w-4xl w-full mx-16"
    />
  );
};

export default PaymentDetailsModal;
