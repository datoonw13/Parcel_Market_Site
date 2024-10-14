import { FC } from "react";
import { IStripeCharge } from "@/types/subscriptions";
import ResponsiveModal from "@/components/ui/dialogs/responsive-dialog";
import { DialogFooter } from "@/components/ui/dialogs/dialog";
import { Button } from "@/components/ui/button";
import PaymentDetailsTable from "./payment-details-table";

interface PaymentDetailsModalProps {
  open: boolean;
  closeModal: () => void;
  data: IStripeCharge[] | null;
}

const PaymentDetailsModal: FC<PaymentDetailsModalProps> = (props) => {
  const { closeModal, open, data } = props;

  return (
    <ResponsiveModal
      mediaQuery="lg"
      dialogContentClassName="max-w-[95vw] lg:max-w-[85vw]"
      modalTitle="Billing History"
      open={open}
      closeModal={closeModal}
    >
      <div className="py-6 max-h-[80dvh] overflow-auto">{data && <PaymentDetailsTable data={data} />}</div>
      <DialogFooter className="bg-white py-4 lg:hidden">
        <Button className="w-full" variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </DialogFooter>
    </ResponsiveModal>
  );
};

export default PaymentDetailsModal;
