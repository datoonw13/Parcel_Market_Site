"use client";

import { FC, useState } from "react";
import { IUser } from "@/types/auth";
import CreateNewPasswordVerify from "./CreateNewPasswordVerify";
import CreateNewPassword from "./CreateNewPassword";
import ProfileModalContentWrapper from "../ProfileModalContentWrapper";

interface UpdatePasswordContentProps {
  user: IUser;
  handleClose: () => void;
  openForgotPasswordModal: () => void;
}
const UpdatePasswordContent: FC<UpdatePasswordContentProps> = ({ user, handleClose, openForgotPasswordModal }) => {
  const [passwords, setPasswords] = useState<{ oldPassword: string; newPassword: string } | null>(null);
  const emailArr = user.email.split("@");
  const currentUserEmail = `${emailArr[0][0]}****${emailArr[0][emailArr[0].length - 1]}@${emailArr[1]}`;

  return (
    <ProfileModalContentWrapper
      handleClose={handleClose}
      description={
        passwords
          ? `Enter the code we sent to ${currentUserEmail}`
          : "Password should contain minimum 8 characters. Use at least one uppercase letter, numbers & any special characters"
      }
      title={passwords ? "Check Your Email" : "Change Password"}
    >
      {!passwords && (
        <CreateNewPassword
          openForgotPasswordModal={openForgotPasswordModal}
          handleClose={handleClose}
          onNext={(oldPassword, newPassword) => setPasswords({ oldPassword, newPassword })}
        />
      )}
      {passwords && <CreateNewPasswordVerify passwords={passwords} handleClose={handleClose} />}
    </ProfileModalContentWrapper>
  );
};

export default UpdatePasswordContent;
