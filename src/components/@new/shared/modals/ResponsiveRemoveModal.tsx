"use client";

import { FC } from "react";
import clsx from "clsx";
import ResponsiveModal from "./ResponsiveModal";
import { RemoveIcon1, RemoveIcon2 } from "../../icons/RemoveIcons";
import Button from "../forms/Button";

interface ResponsiveRemoveModalProps {
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
}: { responsive?: boolean } & Omit<ResponsiveRemoveModalProps, "open">) => (
  <div className={clsx("p-4 flex flex-col items-center gap-3", !responsive && "bg-white rounded-2xl shadow-4 w-[340px] ")}>
    {!responsive && (
      <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6 ml-auto" onClick={() => !pending && handleClose()}>
        <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer !w-3 !h-3" />
      </Button>
    )}
    <div className={clsx("w-12 h-12 rounded-full bg-error-100 flex items-center justify-center")}>
      <RemoveIcon1 className="fill-error w-5 h-5" />
    </div>
    <p className="text-center font-semibold">{title}</p>
    <p className="text-center text-sm text-grey-800">{desc}</p>
    <div className={clsx("flex gap-3 w-full mt-3 flex-col-reverse sm:flex-row")}>
      <Button className="w-full justify-center" variant="secondary" onClick={onReject} disabled={pending}>
        {cancelLabel || "Cancel"}
      </Button>
      <Button className="w-full justify-center" variant="primary" loading={pending} onClick={onOk} color="error">
        {acceptLabel || "Delete"}
      </Button>
    </div>
  </div>
);

const ResponsiveRemoveModal: FC<ResponsiveRemoveModalProps> = ({
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

export default ResponsiveRemoveModal;
