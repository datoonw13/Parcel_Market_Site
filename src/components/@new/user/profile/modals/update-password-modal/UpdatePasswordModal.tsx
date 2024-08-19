"use client";

import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
import { IUser } from "@/types/auth";
import ForgotPasswordModal from "@/components/@new/user/profile/modals/forgot-password/forgot-password-modal";
import UpdatePasswordContent from "./UpdatePasswordContent";

const ResponsiveModal = dynamic(() => import("../../../../shared/modals/ResponsiveModal"), { ssr: false });

interface UpdatePasswordModalWrapperProps {
  open: boolean;
  user: IUser;
  handleClose: () => void;
}
const UpdatePasswordModalWrapper: FC<UpdatePasswordModalWrapperProps> = ({ open, user, handleClose }) => {
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  return (
    <>
      <ForgotPasswordModal open={isForgotPasswordModalOpen} closeModal={() => setForgotPasswordModalOpen(false)} user={user} />
      {!isForgotPasswordModalOpen && (
        <ResponsiveModal
          content={
            open && (
              <UpdatePasswordContent
                openForgotPasswordModal={() => setForgotPasswordModalOpen(true)}
                user={user}
                handleClose={handleClose}
              />
            )
          }
          responsiveContent={
            open && (
              <UpdatePasswordContent
                openForgotPasswordModal={() => setForgotPasswordModalOpen(true)}
                user={user}
                handleClose={handleClose}
              />
            )
          }
          open={open}
          handleClose={handleClose}
          desktopModalContentClasses="max-w-lg w-full"
        />
      )}
    </>
  );
};

export default UpdatePasswordModalWrapper;
