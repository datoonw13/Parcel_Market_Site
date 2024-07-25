import React, { FC } from "react";
import ResponsiveWarningModal from "../shared/modals/ResponsiveWarningModal";

interface UpdatePlanDialogProps {
  open: boolean;
  closeDialog: () => void;
  pending: boolean;
  onSubmit: () => void;
}
const UpdatePlanDialog: FC<UpdatePlanDialogProps> = ({ open, closeDialog, pending, onSubmit }) => (
  <ResponsiveWarningModal
    open={open}
    closeModal={closeDialog}
    description={
      <p className="text-sm text-grey-800">
        Are you sure you would like to proceed with Annual and
        <span className="font-semibold text-black text-sm"> save 10% per month</span>
      </p>
    }
    title="Upgrade Subscription plan"
    onOK={onSubmit}
    okPending={pending}
    onCancel={closeDialog}
    hideIcon
    titleClasses="text-start"
    descriptionClasses="text-start"
    contentClasses="border-b md:border-0 border-b-grey-100 mb-[40vh] md:mb-8 pb-4 md:pb-0"
    okLabel="Change Subscription"
  />
);

export default UpdatePlanDialog;
