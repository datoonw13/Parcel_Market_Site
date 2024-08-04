"use client";

import { FC } from "react";
import clsx from "clsx";
import Button from "../../forms/Button";

interface DialogActionsProps {
  onClose?: () => void;
  onSubmit?: () => void;
  closeLabel?: string;
  submitLabel?: string;
  submitPending?: boolean;
  className?: string;
  disableSubmit?: boolean;
}

const DialogActions: FC<DialogActionsProps> = ({ onClose, onSubmit, closeLabel, submitLabel, submitPending, className, disableSubmit }) =>
  (onClose || onSubmit) && (
    <div className={clsx("flex gap-3 flex-col sm:flex-row sm:justify-end py-4 px-8 border-t border-t-grey-100", className)}>
      {onClose && (
        <Button variant="secondary" onClick={onClose}>
          {closeLabel || "Close"}
        </Button>
      )}
      {onSubmit && (
        <Button onClick={onSubmit} loading={submitPending} disabled={disableSubmit}>
          {submitLabel || "Submit"}
        </Button>
      )}
    </div>
  );

export default DialogActions;
