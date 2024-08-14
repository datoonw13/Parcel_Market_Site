import { cn } from "@/helpers/common";
import Image from "next/image";
import React from "react";

interface AvatarProps {
  className?: string;
  title?: string;
  src?: string | null;
}

const Avatar = ({ className, title, src }: AvatarProps) => (
  <div
    className={cn(
      "w-10 h-10 text-sm font-medium rounded-full bg-primary-main-200 flex items-center justify-center relative cursor-pointer",
      className
    )}
  >
    {title}
    {src && <Image src={src} alt="" fill className="rounded-full" />}
  </div>
);

export default Avatar;
