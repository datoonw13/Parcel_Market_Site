/* eslint-disable @next/next/no-img-element */
import NoAvatarIcon from "@/icons/NoAvatarIcon";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface IAvatar {
  src: string | null;
  className?: string;
}

const Avatar = ({ src, className }: IAvatar) => (
  <div className={clsx("flex items-center justify-center bg-green-100 rounded-full relative", className)}>
    {src && <img src={src} alt="" className="w-full h-full rounded-full" />}
    {!src && <NoAvatarIcon />}
  </div>
);

export default Avatar;
