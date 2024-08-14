import React from "react";
import { cn } from "@/helpers/common";
import { NotFound1 } from "../icons/NotFoundIcon";

const DataNotFound = ({ message, className }: { message: string; className?: string }) => (
  <div className={cn("bg-grey-30 rounded-2xl flex flex-col justify-center items-center py-16", className)}>
    <NotFound1 className="w-44 h-36" />
    <p className="text-grey-800 font-medium">{message}</p>
  </div>
);

export default DataNotFound;
