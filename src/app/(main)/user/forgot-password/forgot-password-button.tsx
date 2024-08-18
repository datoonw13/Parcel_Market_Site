"use client";

import Button from "@/components/@new/shared/forms/Button";
import { useState } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import ForgotPasswordModal from "./forgot-password-modal";

const ForgotPasswordButton = ({ user }: { user: IDecodedAccessToken | null }) => {
  const [openModal, setOpenModal] = useState(true);
  return (
    <>
      <ForgotPasswordModal open={openModal} closeModal={() => setOpenModal(false)} user={user} />
      <Button
        onClick={() => setOpenModal(true)}
        variant="secondary"
        className="!outline-none !text-xs !font-medium !text-primary-main !p-0"
      >
        Forgot Password?
      </Button>
    </>
  );
};

export default ForgotPasswordButton;
