"use client";

import { FC, useEffect, useState } from "react";
import { IUser } from "@/types/auth";
import CreateNewPasswordVerify from "./CreateNewPasswordVerify";
import CreateNewPassword from "./CreateNewPassword";
import ProfileModalContentWrapper from "../ProfileModalContentWrapper";

interface UpdatePasswordContentProps {
  user: IUser;
  open: boolean;
  handleClose: () => void;
}
const UpdatePasswordContent: FC<UpdatePasswordContentProps> = ({ open, user, handleClose }) => {
  const [passwords, setPasswords] = useState<{ oldPassword: string; newPassword: string } | null>(null);
  const emailArr = user.email.split("@");
  const currentUserEmail = `${emailArr[0][0]}****${emailArr[0][emailArr[0].length - 1]}${emailArr[1]}`;

  useEffect(() => {
    if (!open) {
      setPasswords(null);
    }
  }, [open]);

  return (
    <ProfileModalContentWrapper
      handleClose={handleClose}
      description={
        passwords
          ? `Enter the code we sent to ${currentUserEmail}`
          : "Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%)."
      }
      title={passwords ? "Check Your Email" : "Change Password"}
    >
      {!passwords && <CreateNewPassword onNext={(oldPassword, newPassword) => setPasswords({ oldPassword, newPassword })} />}
      {passwords && <CreateNewPasswordVerify passwords={passwords} onFinish={handleClose} />}
    </ProfileModalContentWrapper>
  );
};

export default UpdatePasswordContent;
