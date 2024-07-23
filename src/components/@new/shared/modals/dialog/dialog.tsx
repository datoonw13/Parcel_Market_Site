"use client";

import { FC, ReactNode } from "react";
import clsx from "clsx";
import Modal from "../Modal";
import { RemoveIcon2 } from "../../../icons/RemoveIcons";
import Button from "../../forms/Button";
import DialogActions from "./dialog-actions";

interface DialogProps {
  open: boolean;
  closeModal: () => void;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  onSubmit?: () => void;
  closeLabel?: string;
  submitLabel?: string;
  submitPending?: boolean;
  title?: string;
  disableContentPadding?: boolean;
  contentClasses?: string;
}

const Dialog: FC<DialogProps> = ({
  children,
  closeModal,
  open,
  className,
  submitPending,
  submitLabel,
  closeLabel,
  onSubmit,
  onClose,
  title,
  disableContentPadding,
  contentClasses,
}) => (
  <Modal open={open} closeModal={closeModal}>
    <div className={clsx("bg-white shadow-4 rounded-2xl flex flex-col", className)}>
      <div className="flex items-center justify-between gap-2 px-8 py-6 border-b border-b-grey-100">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6" onClick={closeModal}>
          <RemoveIcon2 className="!w-3 !h-3" color="grey-600" />
        </Button>
      </div>
      <div className={clsx("h-full", !disableContentPadding && "px-8 pt-6", contentClasses)}>{children}</div>
      <DialogActions
        submitPending={submitPending}
        submitLabel={submitLabel}
        closeLabel={closeLabel}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </div>
  </Modal>
);

export default Dialog;
