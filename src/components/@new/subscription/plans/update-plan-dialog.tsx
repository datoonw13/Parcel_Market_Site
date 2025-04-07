import React, { FC } from "react";
import { SubscriptionType } from "@/types/subscriptions";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";

interface UpdatePlanDialogProps {
  closeDialog: () => void;
  pending: boolean;
  onSubmit: () => void;
  subscription: SubscriptionType;
}

const planDescription = (subscription: SubscriptionType) => {
  switch (subscription) {
    case SubscriptionType.Monthly:
      return <p className="text-sm text-grey-800">Are you sure you would like to proceed with Monthly?</p>;
    case SubscriptionType.Annual:
      return (
        <p className="text-sm text-grey-800">
          Are you sure you would like to proceed with Annual and{" "}
          <span className="font-semibold text-black text-sm"> save 10% per month</span>
        </p>
      );
    default:
      return <p className="text-sm text-grey-800">Are you sure you would like to proceed with 14 day free?</p>;
  }
};

const UpdatePlanDialog: FC<UpdatePlanDialogProps> = ({ closeDialog, pending, onSubmit, subscription }) => {
  const subscriptions: any = [];

  return (
    <ResponsiveWarningModal
      open
      closeModal={closeDialog}
      description={planDescription(subscription)}
      title={subscriptions && subscriptions?.length > 1 ? "Upgrade Subscription plan" : "Get a New Subscription"}
      onOK={onSubmit}
      okPending={pending}
      onCancel={closeDialog}
      hideIcon
      titleClasses="text-start"
      descriptionClasses="text-start"
      contentClasses="border-b md:border-0 border-b-grey-100 mb-[5vh] md:mb-8 pb-4 md:pb-0"
      okLabel={subscriptions && subscriptions?.length > 1 ? "Upgrade Subscription" : "Get a subscription"}
    />
  );
};

export default UpdatePlanDialog;
