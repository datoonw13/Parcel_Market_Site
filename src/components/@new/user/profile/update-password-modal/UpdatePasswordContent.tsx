"use client";

import { Divider } from "@mui/material";
import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import { FC, useEffect, useState } from "react";
import { ISignInResponse, IUser } from "@/types/auth";
import CreateNewPasswordVerify from "./CreateNewPasswordVerify";
import CreateNewPassword from "./CreateNewPassword";

interface UpdatePasswordContentProps {
  user: IUser;
  open: boolean;
  handleClose: () => void;
}
const UpdatePasswordContent: FC<UpdatePasswordContentProps> = ({ open, user, handleClose }) => {
  const [passwords, setPasswords] = useState<{ oldPassword: string; newPassword: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setPasswords(null);
    }
  }, [open]);

  return (
    <div className="sm:bg-white sm:shadow-4 sm:rounded-2xl min-h-[70vh] sm:min-h-fit pb-8 sm:pt-8 relative">
      <div className="hidden sm:block absolute top-4 right-4" onClick={() => {}}>
        <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer w-3 h-3 p-2 box-content" />
      </div>
      <div className="space-y-2 px-5 sm:px-8 sm:mb-6">
        <h1 className="font-semibold text-lg">{passwords ? "Check Your Email" : "Change Password"}</h1>
        <h6 className="text-grey-800 text-xs">
          {passwords
            ? `Enter the code we sent to ${user.email}`
            : "Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%)."}
        </h6>
      </div>
      <Divider className="my-4 sm:hidden" />
      {!passwords && <CreateNewPassword onNext={(oldPassword, newPassword) => setPasswords({ oldPassword, newPassword })} />}
      {passwords && <CreateNewPasswordVerify passwords={passwords} onFinish={handleClose} />}
    </div>
  );
};

export default UpdatePasswordContent;
