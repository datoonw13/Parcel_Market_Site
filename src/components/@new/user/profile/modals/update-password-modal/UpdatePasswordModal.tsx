"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";
import { IUser } from "@/types/auth";
import UpdatePasswordContent from "./UpdatePasswordContent";

const ResponsiveModal = dynamic(() => import("../../../../shared/modals/ResponsiveModal"), { ssr: false });

interface UpdatePasswordModalWrapperProps {
  open: boolean;
  user: IUser;
  handleClose: () => void;
}
const UpdatePasswordModalWrapper: FC<UpdatePasswordModalWrapperProps> = ({ open, user, handleClose }) => (
  <ResponsiveModal
    content={open && <UpdatePasswordContent user={user} handleClose={handleClose} />}
    responsiveContent={open && <UpdatePasswordContent user={user} handleClose={handleClose} />}
    open={open}
    handleClose={handleClose}
    desktopModalContentClasses="max-w-lg w-full"
  />
);

export default UpdatePasswordModalWrapper;
