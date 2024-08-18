import { getUserAction } from "@/server-actions/user/actions";
import React from "react";
import ForgotPasswordModal from "./forgot-password-modal";
import ForgotPasswordButton from "./forgot-password-button";

const ForgotPasswordButtonWrapper = async () => {
  const user = await getUserAction();
  return <ForgotPasswordButton user={user} />;
};

export default ForgotPasswordButtonWrapper;
