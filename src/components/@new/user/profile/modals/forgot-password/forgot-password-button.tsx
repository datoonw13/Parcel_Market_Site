"use client";

import Button from "@/components/@new/shared/forms/Button";
import { Dispatch, SetStateAction } from "react";
import { IDecodedAccessToken } from "@/types/auth";
import ForgotPasswordModal from "./forgot-password-modal";

const ForgotPasswordButton = ({
  openModal,
  setOpenModal,
  user,
  id,
}: {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  user: IDecodedAccessToken | null;
  id?: string;
}) => (
  <>
    <ForgotPasswordModal open={openModal} closeModal={() => setOpenModal(false)} user={user} />
    <Button
      id={id}
      onClick={() => setOpenModal(true)}
      variant="secondary"
      className="!outline-none !text-xs !font-medium !text-primary-main !p-0"
    >
      Forgot Password?
    </Button>
  </>
);

export default ForgotPasswordButton;
