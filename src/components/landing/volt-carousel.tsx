"use client";

import { cn } from "@/lib/utils";
import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import routes from "@/helpers/routes";
import { Button } from "../ui/button";

const slides = [
  {
    id: 1,
    content: "Fist",
    title: "Save Valuable Time",
    desc: "VOLT calculates the average of sold prices in less than 30 seconds so you can quickly understand a general market value regarding a specific property.",
  },
  {
    id: 2,
    content: "Second",
    title: "Simple. Fast. Reliable",
    desc: "Built for everyone. No complex UI or sifting through information you don’t need. VOLT delivers reliable data and value information in seconds.",
  },
  {
    id: 3,
    content: "Third",
    title: "Understand Vacant Land Markets in Seconds not Hours",
    desc: "Having an answer immediately can sometimes mean the difference between a client or land deal secured! Always be ready with VOLT.",
  },
];

const VoltCarousel = () => {
  const [data, setData] = useState(slides);

  const onClick = (id: number) => {
    const itemIndex = data.findIndex((el) => el.id === id);
    const getItemPosition = () => {
      if (itemIndex === 0) {
        return "left";
      }
      if (itemIndex === 1) {
        return "center";
      }
      return "right";
    };

    const position = getItemPosition();

    if (position === "left") {
      const [a, b, c] = data;
      setData([c, a, b]);
    }
    if (position === "right") {
      const [a, b, c] = data;
      setData([b, c, a]);
    }
  };

  return (
    <div className="px-5 sm:px-9 md:px-12 lg:px-18 xl:px-[12vw] grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_1.1fr] gap-x-12 xl:gap-x-14 items-center">
      <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto mb-6 md:mb-8 lg:mb-11 lg:hidden">
        {data.map((el) => (
          <Fragment key={el.id}>
            <motion.div
              style={{ transition: "all .2s ease-in-out" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className={cn("text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl", data[1].id !== el.id && "hidden")}
            >
              {el.title}
            </motion.div>
            <motion.div
              style={{ transition: "all .2s ease-in-out" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className={cn("text-center font-light text-sm md:text-base", data[1].id !== el.id && "hidden")}
            >
              {el.desc}
            </motion.div>
          </Fragment>
        ))}
      </div>
      <div className="hidden lg:flex flex-col gap-2">
        {[...data]
          .sort((a, b) => a.id - b.id)
          .map((el) => (
            <div
              key={el.id}
              onClick={() => onClick(el.id)}
              style={{ transition: "all .2s ease-in-out" }}
              className={cn(
                "cursor-pointer border border-grey-100 rounded-2xl p-4 opacity-70",
                data[1].id === el.id && "scale-105 shadow-4 border-primary-main/20 bg-primary-main/10 opacity-100"
              )}
            >
              <h1 className="text-grey-800 font-extrabold mb-1 text-sm">{el.title}</h1>
              <p className="font-light text-grey-800 text-xs mb-6">{el.desc}</p>
              <Link href={routes.volt.fullUrl}>
                <Button className={cn(data[1].id !== el.id && "!bg-primary-main-100 text-primary-main", "h-8 text-xs")}>
                  Try for free
                </Button>
              </Link>
            </div>
          ))}
      </div>
      <div className="h-full">
        <div
          className={`
            bg-[url('/carousel-bg.png')] bg-[length:100%_100%] bg-no-repeat
            p-6
            z-20
      flex items-center justify-center h-fit lg:h-full
      [&>div:nth-child(2)]:z-10 [&>div:nth-child(2):hover]:scale-[1.03]
      [&>div:first-child:hover]:scale-[0.95] [&>div:first-child]:!opacity-60 [&>div:first-child]:scale-[0.85] [&>div:first-child]:-rotate-[10deg] [&>div:first-child]:translate-x-[70%] md:[&>div:first-child]:translate-x-[50%]
      [&>div:last-child:hover]:scale-[0.95] [&>div:last-child]:!opacity-60 [&>div:last-child]:scale-[0.85] [&>div:last-child]:rotate-[10deg] [&>div:last-child]:-translate-x-[70%] md:[&>div:last-child]:-translate-x-[50%]
    `}
        >
          {data.map((el) => (
            <motion.div
              style={{ transition: "all .2s ease-in-out" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onClick(el.id)}
              key={el.id + data.map((el) => el.id).join()}
              className={cn(`
                shadow-4 
                w-[45vw] min-w-[45vw] sm:w-[30vw] sm:min-w-[30vw] md:w-[25vw] md:min-w-[25vw] lg:w-[180px] lg:min-w-[180px] xl:w-[210px] xl:min-w-[210px] 
                h-[70vw] sm:h-[55vw] md:h-[45vw] lg:h-[380px] 
                rounded-lg flex items-center justify-center relative cursor-pointer
                `)}
              transition={{ delay: 0.05 }}
            >
              <Image alt="" fill src={`/slider${el.id}.png`} className="w-full h-full max-w-nones max-h-none rounded-2xl shadow-2" />
            </motion.div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 mx-auto w-full justify-center">
          {[...data]
            .sort((a, b) => a.id - b.id)
            .map((el) => (
              <div
                onClick={() => onClick(el.id)}
                className={cn("size-3 rounded-full bg-primary-main-100 cursor-pointer", data[1].id === el.id && "bg-primary-main")}
                key={el.id}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default VoltCarousel;
