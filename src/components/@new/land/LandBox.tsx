"use client";

import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { BookmarkIcon1, BookmarkIcon2 } from "../icons/BookMarkIcons";
import { LocationIcon1 } from "../icons/LocationIcons";
import { UserIcon2 } from "../icons/UserIcons";
import { CalendarIcon1 } from "../icons/CalendarIcons";
import Button from "../shared/forms/Button";

interface LandBoxProps {
  view: "vertical" | "horizontal";
}
const LandBox = ({ view }: LandBoxProps) => {
  const [save, setSave] = useState(false);
  return (
    <div className="py-6 border border-grey-100 rounded-2xl w-full flex flex-col gap-4 cursor-pointer group hover:shadow-1 transition-all duration-100">
      <div className="px-6 flex justify-between items-start gap-6">
        <div className="grid gap-2">
          <h1 className="font-semibold group-hover:text-primary-main transition-all duration-100 text-ellipsis whitespace-nowrap overflow-hidden">long names with 3 dotsqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdqwdwqdqwdqwdqwqwdqwdqwdq</h1>
          <h2 className="text-xs text-grey-600 flex items-center gap-1.5">
            <LocationIcon1 /> State; County
          </h2>
        </div>
        <div onClick={() => setSave(!save)}>
          {save ? (
            <BookmarkIcon1 className="mt-1 fill-primary-main cursor-pointer" />
          ) : (
            <BookmarkIcon2 className="mt-1 fill-primary-main cursor-pointer" />
          )}
        </div>
      </div>
      <div className={clsx("px-6 grid gap-4", view === "horizontal" ? "grid-cols-2" : "grid-cols-1")}>
        <div className={clsx("relative rounded-xl", view === "horizontal" ? "" : "xs:h-32 md:h-40")}>
          <Image alt="" src="/property-map.png" fill className="rounded-xl" />
        </div>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-1.5">
            <UserIcon2 className="stroke-grey-600 fill-grey-600" />
            <p className="text-sm text-grey-600">
              Owner: <span className="ext-sm font-medium text-black"> Name, Surname</span>
            </p>
          </li>
          <li className="flex items-center gap-1.5">
            <UserIcon2 className="stroke-grey-600 fill-grey-600 min-w-4 min-h-4" />
            <p className="text-sm text-grey-600  text-ellipsis whitespace-nowrap overflow-hidden">
              Owner: <span className="ext-sm font-medium text-black"> Name, Surnameqqdwdqwdqwdqwdqwdqwdqwdqwdqwd</span>
            </p>
          </li>
          <li className="flex items-center gap-1.5">
            <UserIcon2 className="stroke-grey-600 fill-grey-600" />
            <p className="text-sm text-grey-600">
              Owner: <span className="ext-sm font-medium text-black"> Name, Surname</span>
            </p>
          </li>
          <li className="flex items-center gap-1.5">
            <UserIcon2 className="stroke-grey-600 fill-grey-600" />
            <p className="text-sm text-grey-600">
              Owner: <span className="ext-sm font-medium text-black"> Name, Surname</span>
            </p>
          </li>
        </ul>
      </div>
      <div className="px-6 border-t border-grey-100 pt-6 mt-4 flex items-center justify-between">
        <p className="flex gap-1.5 items-center text-xs font-medium text-grey-600">
          <CalendarIcon1 /> Available till: <span className="text-black">24 Apr</span>
        </p>
        <Button>Details</Button>
      </div>
    </div>
  );
};

export default LandBox;
