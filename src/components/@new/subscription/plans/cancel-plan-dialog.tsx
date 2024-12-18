"use client";

import { DeletionAccountReason } from "@/types/auth";
import { FC, useState } from "react";
import { cancelSubscriptionAction } from "@/server-actions/subscription/actions";
import { ISubscription } from "@/types/subscriptions";
import { useRouter } from "next/navigation";
import moment from "moment";
import useNotification from "@/hooks/useNotification";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";
import RadioButton from "../../shared/forms/RadioButton";

interface CancelPlanDialogProps {
  closeDialog: () => void;
  userActiveSubscription: ISubscription;
}

const CancelPlanDialog: FC<CancelPlanDialogProps> = ({ closeDialog, userActiveSubscription }) => {
  const router = useRouter();
  const { notify } = useNotification();
  const [reason, setReason] = useState<DeletionAccountReason | null>(null);
  const [cancelPending, setCancelPending] = useState(false);

  const cancelSubscription = async () => {
    setCancelPending(true);
    await cancelSubscriptionAction(userActiveSubscription.id, reason!);
    notify({ title: "Your plan has been canceled", description: "Plan has been successfully changed" }, { variant: "success" });
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
            By canceling your subscription, you will have
            <span className="font-semibold text-black text-sm mx-1">limited access</span>
            to the website&apos;s features from
            <span className="font-semibold text-black text-sm mx-1">{moment(userActiveSubscription.activeTo).format("MMMM D")}.</span>
            Please tell Us reason of cancelation.
          </p>
          <RadioGroup
            className="px-6 py-7 rounded-2xl border border-grey-100 !space-y-4 gap-0 mx-5"
            value={reason || ""}
            onValueChange={(value) => setReason(value as DeletionAccountReason)}
          >
            <RadioGroupItem value={DeletionAccountReason.NotUseful} label="I did not find Parcel Market useful" />
            <RadioGroupItem value={DeletionAccountReason.NoDataAccess} label="I could not find the data I needed" />
            <RadioGroupItem value={DeletionAccountReason.Complicated} label="Parcel Market is too complicated" />
            <RadioGroupItem value={DeletionAccountReason.TooExpensive} label="I think the services are too expensive" />
            {/* <RadioGroupItem value={DeletionAccountReason.SoldLand} label="Already sold on Parcel Marketplace" /> */}
            {/* <RadioGroupItem value={DeletionAccountReason.SoldLandOutsideMarket} label="I have sold my land somewhere else" /> */}
          </RadioGroup>
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
