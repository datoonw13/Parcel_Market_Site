"use client";

import React, { FC } from "react";
import clsx from "clsx";
import ResponsiveModal from "./ResponsiveModal";
import { RemoveIcon1, RemoveIcon2 } from "../../icons/RemoveIcons";
import Button from "../forms/Button";
import { CheckIcon3 } from "../../icons/CheckIcons";

interface ResponsiveAcceptModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  desc: string;
  pending?: boolean;
  onOk: () => void;
  onReject: () => void;
  cancelLabel?: string;
  acceptLabel?: string;
}

const Content = ({
  responsive,
  desc,
  onReject,
  onOk,
  title,
  pending,
  handleClose,
  acceptLabel,
  cancelLabel,
}: { responsive?: boolean } & Omit<ResponsiveAcceptModalProps, "open">) => (
  <div className={clsx("p-4 flex flex-col items-center gap-3", !responsive && "bg-white rounded-2xl shadow-4 w-[340px] ")}>
    {!responsive && (
      <div className="w-full" onClick={() => !pending && handleClose()}>
        <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer !w-3 !h-3" />
      </div>
    )}
    <div className={clsx("w-12 h-12 rounded-full bg-primary-main-100 flex items-center justify-center")}>
      <CheckIcon3 color="primary-main" className="w-5 h-5" />
    </div>
    <p className="text-center font-semibold">{title}</p>
    <p className="text-center text-sm text-grey-800">{desc}</p>
    <div className={clsx("flex gap-3 w-full mt-3 flex-col-reverse sm:flex-row")}>
      <Button className="w-full justify-center" variant="secondary" onClick={onReject} disabled={pending}>
        {cancelLabel || "Cancel"}
      </Button>
      <Button className="w-full justify-center" variant="primary" loading={pending} onClick={onOk}>
        {acceptLabel || "Delete"}
      </Button>
    </div>
  </div>
);

const ResponsiveAcceptModal: FC<ResponsiveAcceptModalProps> = ({
  handleClose,
  open,
  desc,
  onReject,
  onOk,
  title,
  pending,
  acceptLabel,
  cancelLabel,
}) => (
  <ResponsiveModal
    open={open}
    handleClose={handleClose}
    content={
      <Content
        acceptLabel={acceptLabel}
        cancelLabel={cancelLabel}
        handleClose={handleClose}
        desc={desc}
        onReject={onReject}
        onOk={onOk}
        title={title}
        pending={pending}
      />
    }
    responsiveContent={
      <Content
        acceptLabel={acceptLabel}
        cancelLabel={cancelLabel}
        responsive
        handleClose={handleClose}
        desc={desc}
        onReject={onReject}
        onOk={onOk}
        title={title}
        pending={pending}
      />
    }
  />
);

export default ResponsiveAcceptModal;
