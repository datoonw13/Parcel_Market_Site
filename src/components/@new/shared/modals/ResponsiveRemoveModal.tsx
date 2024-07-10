"use client";

import React, { FC } from "react";
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
  onDelete: () => void;
  onCancel: () => void;
}

const Content = ({
  responsive,
  desc,
  onCancel,
  onDelete,
  title,
  pending,
  handleClose,
}: { responsive?: boolean } & Omit<ResponsiveRemoveModalProps, "open">) => (
  <div className={clsx("p-4 flex flex-col items-center gap-3", !responsive && "bg-white rounded-2xl shadow-4 w-[340px] ")}>
    {!responsive && (
      <div className="w-full" onClick={() => !pending && handleClose()}>
        <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer !w-3 !h-3" />
      </div>
    )}
    <div className={clsx("w-12 h-12 rounded-full bg-error-100 flex items-center justify-center")}>
      <RemoveIcon1 className="fill-error w-5 h-5" />
    </div>
    <p className="text-center font-semibold">{title}</p>
    <p className="text-center text-sm text-grey-800">{desc}</p>
    <div className={clsx("flex gap-3 w-full mt-3 flex-col-reverse sm:flex-row")}>
      <Button className="w-full justify-center" variant="secondary" onClick={onCancel} disabled={pending}>
        Cancel
      </Button>
      <Button className="w-full justify-center" variant="primary" loading={pending} onClick={onDelete} color="error">
        Delete
      </Button>
    </div>
  </div>
);

const ResponsiveRemoveModal: FC<ResponsiveRemoveModalProps> = ({ handleClose, open, desc, onCancel, onDelete, title, pending }) => (
  <ResponsiveModal
    open={open}
    handleClose={handleClose}
    content={<Content handleClose={handleClose} desc={desc} onCancel={onCancel} onDelete={onDelete} title={title} pending={pending} />}
    responsiveContent={
      <Content responsive handleClose={handleClose} desc={desc} onCancel={onCancel} onDelete={onDelete} title={title} pending={pending} />
    }
  />
);

export default ResponsiveRemoveModal;
