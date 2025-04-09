"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import ReactPlayer from "react-player";

const IntroVideo = ({ className }: { className?: string }) => (
  <ReactPlayer
    className={cn(
      "[&>video]:object-fill flex",
      "[&>div]:relative [&>div]:after:content-[''] [&>div]:after:bg-black/10 [&>div]:after:w-full [&>div]:after:h-full [&>div]:after:absolute [&>div]:after:rounded-xl",
      `[&>*]:rounded-xl`,
      className
    )}
    autoplay
    loop
    playing
    controls
    playsinline
    light="/subnail.png"
    height="100%"
    width="100%"
    url="https://hjpblcir9dyus8x7.public.blob.vercel-storage.com/video-QpygzeA5DFEAdEKsmJD9zdki3xxwSe.mp4"
  />
);

export default IntroVideo;
