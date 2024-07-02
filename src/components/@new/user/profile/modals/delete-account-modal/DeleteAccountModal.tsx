"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Divider from "@/components/@new/shared/Divider";

const ResponsiveModal = dynamic(() => import("../../../../shared/modals/ResponsiveModal"), { ssr: false });

interface DeleteAccountModalProps {
  open: boolean;
  handleClose: () => void;
}

const DeleteAccountModalContent: FC<DeleteAccountModalProps> = ({ handleClose, open }) => (
  <div className="sm:bg-white sm:shadow-4 sm:rounded-2xl min-h-[70vh] sm:min-h-fit pb-8 sm:pt-8 relative">
    <div className="hidden sm:block absolute top-4 right-4" onClick={handleClose}>
      <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer w-3 h-3 p-2 box-content" />
    </div>
    <div className="space-y-2 px-5 sm:px-8 sm:mb-6">
      <h1 className="font-semibold text-lg">Texttttt</h1>
      <h6 className="text-grey-800 text-xs">sub textttttttt</h6>
    </div>
    <Divider className="my-4 sm:hidden" />
    {/* {!passwords && <CreateNewPassword onNext={(oldPassword, newPassword) => setPasswords({ oldPassword, newPassword })} />}
    {passwords && <CreateNewPasswordVerify passwords={passwords} onFinish={handleClose} />} */}
  </div>
);

const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ open, handleClose }) => (
  <ResponsiveModal
    content={<div>wwqdqwd</div>}
    responsiveContent={<div>wwqdqwd</div>}
    open={open}
    handleClose={handleClose}
    desktopModalContentClasses="max-w-lg w-full"
  />
);

export default DeleteAccountModal;
