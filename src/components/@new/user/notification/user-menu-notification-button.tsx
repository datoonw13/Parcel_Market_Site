import { cn } from "@/helpers/common";
import React, { MouseEvent } from "react";
import { PiBellRingingBold } from "react-icons/pi";

const UserMenuNotificationButton = ({ active, onClick }: { active: boolean; onClick: (e: MouseEvent<HTMLDivElement>) => void }) => (
  <div
    className={cn("size-10 rounded-full bg-grey-50 flex items-center justify-center cursor-pointer relative", active && "bg-grey-100")}
    onClick={onClick}
  >
    <PiBellRingingBold className="size-4" />
    <div className="size-[18px] rounded-full text-xs bg-primary-main text-white flex items-center justify-center absolute top-0 right-0 translate-x-1/2">
      11
    </div>
  </div>
);

export default UserMenuNotificationButton;
