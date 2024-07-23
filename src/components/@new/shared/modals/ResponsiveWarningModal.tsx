/* eslint-disable react/destructuring-assignment */

"use client";

import React, { FC, ReactElement, ReactNode } from "react";
import clsx from "clsx";
import ResponsiveModal from "./ResponsiveModal";
import { RemoveIcon1, RemoveIcon2 } from "../../icons/RemoveIcons";
import Button from "../forms/Button";
import { CheckIcon3 } from "../../icons/CheckIcons";

interface ResponsiveWarningModalProps {
  open: boolean;
  closeModal: () => void;
  title: string;
  description: string;
  onOK: () => void;
  okPending?: boolean;
  okLabel?: string;
  disableOK?: boolean;
  onCancel: () => void;
  cancelLabel?: string;
  variant?: "success" | "error";
  customIcon?: ReactNode;
}
const Content: FC<ResponsiveWarningModalProps> = ({
  open,
  closeModal,
  variant = "success",
  customIcon,
  title,
  description,
  onOK,
  okPending,
  okLabel,
  onCancel,
  cancelLabel,
  disableOK,
}) => (
  <div className="pt-1 pb-11 px-5 flex flex-col justify-center items-center md:bg-white md:rounded-2xl md:p-6 relative max-w-sm w-full">
    <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6 hidden md:flex absolute top-6 right-6" onClick={closeModal}>
      <RemoveIcon2 className="!w-3 !h-3" color="grey-600" />
    </Button>
    <div
      className={clsx(
        "h-12 w-12 rounded-full flex items-center justify-center mb-3",
        variant === "error" ? "bg-error-100" : "bg-primary-main-100"
      )}
    >
      {customIcon ||
        (variant === "success" ? (
          <CheckIcon3 className="!h-4 !w-4" color="success" />
        ) : (
          <RemoveIcon2 className="!h-4 !w-4" color="error" />
        ))}
    </div>
    <div className="space-y-1.5 mb-6">
      <p className="text-center font-semibold">{title}</p>
      <p className="text-center text-grey-800 text-sm">{description}</p>
    </div>
    <div className="flex flex-col-reverse md:flex-row gap-3 w-full">
      <Button className="md:min-w-max md:w-full" variant="secondary" onClick={onCancel}>
        {cancelLabel || "Cancel"}
      </Button>
      <Button
        className="md:min-w-max md:w-full"
        onClick={onOK}
        loading={okPending}
        color={variant === "success" ? "default" : "error"}
        disabled={disableOK}
      >
        {okLabel || "Accept"}
      </Button>
    </div>
  </div>
);

const ResponsiveWarningModal: FC<ResponsiveWarningModalProps> = (props) => (
  <ResponsiveModal
    open={props.open}
    handleClose={props.closeModal}
    content={<Content {...props} />}
    responsiveContent={<Content {...props} />}
  />
);

export default ResponsiveWarningModal;
