"use client";

import Dialog from "../../shared/modals/dialog/dialog";
import ValueLendTerms from "./terms";

const CalculationTermsModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) => (
  <Dialog
    disableContentPadding
    title="Information before we calculate"
    open={open}
    closeModal={onClose}
    className="max-w-[60vw] w-full h-[80vh]"
    contentClasses="overflow-hidden"
  >
    <ValueLendTerms onDecline={onClose} onSubmit={onSubmit} isSubmitting={isSubmitting} />
  </Dialog>
);

export default CalculationTermsModal;
