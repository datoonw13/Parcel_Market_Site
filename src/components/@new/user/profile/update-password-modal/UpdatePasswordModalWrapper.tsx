"use client";

import React, { FC } from "react";
import dynamic from "next/dynamic";
import { ISignInResponse } from "@/types/auth";
import UpdatePasswordContent from "./UpdatePasswordContent";

const ResponsiveModal = dynamic(() => import("../../../shared/modals/ResponsiveModal"), { ssr: false });

interface UpdatePasswordModalWrapperProps {
  open: boolean;
  user: ISignInResponse["payload"];
}
const UpdatePasswordModalWrapper: FC<UpdatePasswordModalWrapperProps> = ({ open, user }) => (
  <ResponsiveModal
    content={<UpdatePasswordContent user={user} open={open} />}
    responsiveContent={<UpdatePasswordContent user={user} open={open} />}
    open={open}
    handleClose={() => {}}
    desktopModalContentClasses="max-w-lg w-full"
  />
);

export default UpdatePasswordModalWrapper;
