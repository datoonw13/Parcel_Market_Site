import clsx from "clsx";
import Image from "next/image";
import React, { ReactNode } from "react";

interface IAvatar {
  src?: string;
  children?: ReactNode;
  className?: string;
}

const Avatar = ({ children, src, className }: IAvatar) => (
  <div className={clsx("flex items-center justify-center bg-green-100 rounded-full relative", className)}>
    {children}
    {src && <Image src={src} alt="" fill objectFit="contain" className="w-full h-full rounded-full" />}
  </div>
);

export default Avatar;
