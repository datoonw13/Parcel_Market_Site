"use client";

import { DeletionAccountReason } from "@/types/auth";
import { FC } from "react";
import ResponsiveWarningModal from "../shared/modals/ResponsiveWarningModal";
import RadioButton from "../shared/forms/RadioButton";

interface CancelPlanDialogProps {
  open: boolean;
  closeDialog: () => void;
  pending: boolean;
  onSubmit: () => void;
  selectReason: (reason: DeletionAccountReason) => void;
  selectedReason: DeletionAccountReason | null;
}

const CancelPlanDialog: FC<CancelPlanDialogProps> = ({ closeDialog, onSubmit, open, pending, selectReason, selectedReason }) => (
  <ResponsiveWarningModal
    variant="error"
    open={open}
    closeModal={closeDialog}
    description={
      <div>
        <p className="text-sm text-grey-800 mb-4 md:mb-6 px-5 border-b md:border-0 border-b-grey-100 pb-4 md:pb-0">
          Are you sure you would like to proceed with Annual and By canceling your subscription, you will have
          <span className="font-semibold text-black text-sm mx-1">limited access</span>to the website&apos;s features from
          <span className="font-semibold text-black text-sm mx-1">August 1st.</span>Please tell Us reason of cancelation
        </p>
        <div className="px-6 py-7 rounded-2xl border border-grey-100 space-y-4 mx-5">
          <RadioButton
            rootClassName="w-max"
            name={DeletionAccountReason.SoldLand}
            checked={DeletionAccountReason.SoldLand === selectedReason}
            onChange={() => selectReason(DeletionAccountReason.SoldLand)}
            label="Already sold on Parcel Marketplace"
          />
          <RadioButton
            rootClassName="w-max"
            name={DeletionAccountReason.SoldLandOutsideMarket}
            checked={DeletionAccountReason.SoldLandOutsideMarket === selectedReason}
            onChange={() => selectReason(DeletionAccountReason.SoldLandOutsideMarket)}
            label="I have sold my land somewhere else"
          />
          <RadioButton
            rootClassName="w-max"
            name={DeletionAccountReason.NotUseful}
            checked={DeletionAccountReason.NotUseful === selectedReason}
            onChange={() => selectReason(DeletionAccountReason.NotUseful)}
            label="I did not find Parcel Market Useful"
          />
          <RadioButton
            rootClassName="w-max"
            name={DeletionAccountReason.NoDataAccess}
            checked={DeletionAccountReason.NoDataAccess === selectedReason}
            onChange={() => selectReason(DeletionAccountReason.NoDataAccess)}
            label="I could not find the data I needed"
          />
          <RadioButton
            rootClassName="w-max"
            name={DeletionAccountReason.Complicated}
            checked={DeletionAccountReason.Complicated === selectedReason}
            onChange={() => selectReason(DeletionAccountReason.Complicated)}
            label="Parcel Market is too complicated"
          />
          <RadioButton
            rootClassName="w-max"
            name={DeletionAccountReason.TooExpensive}
            checked={DeletionAccountReason.TooExpensive === selectedReason}
            onChange={() => selectReason(DeletionAccountReason.TooExpensive)}
            label="I think the services are too expensive"
          />
        </div>
      </div>
    }
    contentClasses="!px-0 md:!px-5"
    title="Canceling your subscription"
    onOK={onSubmit}
    onCancel={closeDialog}
    okPending={pending}
    hideIcon
    titleClasses="text-start px-5"
    descriptionClasses="text-start"
    okLabel="Cancel Subscription"
    rootClasses="md:!max-w-lg"
  />
);

export default CancelPlanDialog;
