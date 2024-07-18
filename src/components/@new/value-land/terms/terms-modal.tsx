"use client";

import Dialog from "../../shared/modals/dialog/dialog";
import ValueLendTerms from "./terms";

const ValueLandSubmitTermsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog
    disableContentPadding
    title="Information before we calculate"
    open={open}
    closeModal={onClose}
    className="max-w-[60vw] w-full h-[80vh]"
    contentClasses="overflow-hidden"
  >
    <ValueLendTerms />
  </Dialog>
);

export default ValueLandSubmitTermsModal;
