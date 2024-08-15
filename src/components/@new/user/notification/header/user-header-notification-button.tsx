import { cn } from "@/helpers/common";
import React, { MouseEvent } from "react";
import { PiBellRingingBold } from "react-icons/pi";

const UserHeaderNotificationButton = ({
  active,
  onClick,
  unreadMessages,
  loading,
}: {
  active: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  unreadMessages?: number;
  loading?: boolean;
}) => (
  <div
    className={cn(
      "size-10 rounded-full bg-grey-50 flex items-center justify-center cursor-pointer relative",
      active && "bg-grey-100",
      loading && "pointer-events-none opacity-30"
    )}
    onClick={onClick}
  >
    <PiBellRingingBold className="size-4" />
    {unreadMessages ? (
      <div className="size-[18px] rounded-full text-xs bg-primary-main text-white flex items-center justify-center absolute top-0 right-0 translate-x-1/2">
        {unreadMessages}
      </div>
    ) : null}
  </div>
);

export default UserHeaderNotificationButton;
