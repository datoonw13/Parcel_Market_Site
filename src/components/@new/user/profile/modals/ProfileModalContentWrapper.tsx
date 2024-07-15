import { RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import Divider from "@/components/@new/shared/Divider";
import React, { FC, ReactNode } from "react";

interface ProfileModalContentWrapperProps {
  handleClose: () => void;
  children: ReactNode;
  title: string | ReactNode;
  description: string;
}
const ProfileModalContentWrapper: FC<ProfileModalContentWrapperProps> = ({ children, handleClose, description, title }) => (
  <div className="sm:bg-white md:shadow-4 sm:rounded-2xl min-h-[70vh] sm:min-h-fit pb-8 sm:pt-8 relative grid">
    <div className="flex flex-col">
      <div className="hidden sm:block absolute top-4 right-4" onClick={handleClose}>
        <RemoveIcon2 className="fill-grey-600 flex ml-auto cursor-pointer w-3 h-3 p-2 box-content" />
      </div>
      <div className="space-y-2 px-5 sm:px-8 sm:mb-6">
        <h1 className="font-semibold text-lg">{title}</h1>
        <h6 className="text-grey-800 text-xs">{description}</h6>
      </div>
      <Divider className="my-4 sm:hidden" />
      <div className="w-full px-5 sm:px-8 h-full">{children}</div>
    </div>
  </div>
);

export default ProfileModalContentWrapper;
