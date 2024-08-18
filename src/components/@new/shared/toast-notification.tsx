import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoInformation } from "react-icons/io5";
import { cn } from "@/helpers/common";

const ToastNotification = ({
  variant = "success",
  title,
  description,
}: {
  variant?: "error" | "success" | "info";
  title?: string;
  description?: string;
}) => (
  <div className="grid grid-cols-[minmax(0,_max-content)_1fr] gap-4">
    <div
      className={cn(
        "size-10 rounded-full  flex items-center justify-center",
        variant === "success" && "bg-success",
        variant === "error" && "bg-error",
        variant === "info" && "bg-info"
      )}
    >
      {variant === "success" && <FaCheck className="size-4 text-white" />}
      {variant === "error" && <IoMdClose className="size-4 text-white" />}
      {variant === "info" && <IoInformation className="size-4 text-white" />}
    </div>
    <div className="">
      {title && <h1 className="text-sm font-semibold text-black">{title}</h1>}
      {description && <h2 className="text-grey-600 text-xs">{description}</h2>}
    </div>
  </div>
);

export default ToastNotification;
