"use client";

import { DeletionAccountReason } from "@/types/auth";
import { FC, useState } from "react";
import { cancelSubscriptionAction } from "@/server-actions/subscription/actions";
import { ISubscription } from "@/types/subscriptions";
import { useRouter } from "next/navigation";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import RadioButton from "../../shared/forms/RadioButton";

interface CancelPlanDialogProps {
  closeDialog: () => void;
  userActiveSubscription: ISubscription;
}

const CancelPlanDialog: FC<CancelPlanDialogProps> = ({ closeDialog, userActiveSubscription }) => {
  const router = useRouter();
  const [reason, setReason] = useState<DeletionAccountReason | null>(null);
  const [cancelPending, setCancelPending] = useState(false);

  const cancelSubscription = async () => {
    setCancelPending(true);
    await cancelSubscriptionAction(userActiveSubscription.id, reason!);
    router.push("?success=true");
    closeDialog();
  };

  return (
    <ResponsiveWarningModal
      variant="error"
      open
      closeModal={closeDialog}
      description={
        <div>
          <p className="text-sm text-grey-800 mb-4 md:mb-6 px-5 border-b md:border-0 border-b-grey-100 pb-4 md:pb-0">
            Are you sure you would like to proceed with Yearly and By canceling your subscription, you will have
            <span className="font-semibold text-black text-sm mx-1">limited access</span>to the website&apos;s features from
            <span className="font-semibold text-black text-sm mx-1">August 1st.</span>Please tell Us reason of cancelation
          </p>
          <div className="px-6 py-7 rounded-2xl border border-grey-100 space-y-4 mx-5">
            <RadioButton
              rootClassName="w-max"
              name={DeletionAccountReason.SoldLand}
              checked={DeletionAccountReason.SoldLand === reason}
              onChange={() => setReason(DeletionAccountReason.SoldLand)}
              label="Already sold on Parcel Marketplace"
            />
            <RadioButton
              rootClassName="w-max"
              name={DeletionAccountReason.SoldLandOutsideMarket}
              checked={DeletionAccountReason.SoldLandOutsideMarket === reason}
              onChange={() => setReason(DeletionAccountReason.SoldLandOutsideMarket)}
              label="I have sold my land somewhere else"
            />
            <RadioButton
              rootClassName="w-max"
              name={DeletionAccountReason.NotUseful}
              checked={DeletionAccountReason.NotUseful === reason}
              onChange={() => setReason(DeletionAccountReason.NotUseful)}
              label="I did not find Parcel Market Useful"
            />
            <RadioButton
              rootClassName="w-max"
              name={DeletionAccountReason.NoDataAccess}
              checked={DeletionAccountReason.NoDataAccess === reason}
              onChange={() => setReason(DeletionAccountReason.NoDataAccess)}
              label="I could not find the data I needed"
            />
            <RadioButton
              rootClassName="w-max"
              name={DeletionAccountReason.Complicated}
              checked={DeletionAccountReason.Complicated === reason}
              onChange={() => setReason(DeletionAccountReason.Complicated)}
              label="Parcel Market is too complicated"
            />
            <RadioButton
              rootClassName="w-max"
              name={DeletionAccountReason.TooExpensive}
              checked={DeletionAccountReason.TooExpensive === reason}
              onChange={() => setReason(DeletionAccountReason.TooExpensive)}
              label="I think the services are too expensive"
            />
          </div>
        </div>
      }
      contentClasses="!px-0 md:!px-5"
      title="Canceling your subscription"
      onOK={cancelSubscription}
      onCancel={closeDialog}
      okPending={cancelPending}
      disableOK={!reason}
      hideIcon
      titleClasses="text-start px-5"
      descriptionClasses="text-start"
      okLabel="Cancel Subscription"
      rootClasses="md:!max-w-lg"
    />
  );
};

export default CancelPlanDialog;
