"use client";

import Image from "next/image";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import Link from "next/link";
import routes from "@/helpers/routes";
import { BookmarkIcon1, BookmarkIcon2 } from "../icons/BookMarkIcons";
import { LocationIcon1 } from "../icons/LocationIcons";
import { CalendarIcon1 } from "../icons/CalendarIcons";
import Button from "../shared/forms/Button";
import RadioButton from "../shared/forms/RadioButton";
import ResponsiveRemoveModal from "../shared/modals/ResponsiveRemoveModal";
import Modal from "../shared/modals/Modal";

interface LandBoxProps {
  view: "vertical" | "horizontal";
  data: {
    name: string;
    state: string;
    county: string;
    availableTill: string;
    options: {
      [key: string]: {
        icon: ReactNode;
        label: string;
        value: string;
      };
    };
  };
  className?: string;
  showFollow?: boolean;
  isFollowed?: boolean;
  parcelNumber: string;
  select?: {
    showSelect: boolean;
    onSelect: (id: number) => void;
    selected: boolean;
    id: number;
  };
  sellingItemId: number;
}
const LandBox = ({ view, data, className, showFollow, isFollowed, select, parcelNumber, sellingItemId }: LandBoxProps) => {
  const [save, setSave] = useState(false);

  return (
    <>
      <div
        className={clsx(
          "pt-6 border border-grey-100 rounded-2xl w-full flex flex-col gap-4 cursor-pointer group hover:shadow-1 transition-all duration-100",
          className,
          select?.showSelect && "bg-black-100",
          select?.selected && "bg-black-200"
        )}
        onClick={() => select?.showSelect && select.onSelect(select.id)}
      >
        <div className="px-6 flex justify-between items-start gap-6">
          <div className="grid gap-2">
            <h1 className="font-semibold group-hover:text-primary-main transition-all duration-100 text-ellipsis whitespace-nowrap overflow-hidden">
              {data.name}
            </h1>
            <h2 className="text-xs text-grey-600 flex items-center gap-1.5">
              <LocationIcon1 /> {data.state}; {data.county}
            </h2>
          </div>
          {!select?.showSelect && showFollow && (
            <div onClick={() => setSave(!save)}>
              {isFollowed ? (
                <BookmarkIcon2 className="mt-1 fill-primary-main cursor-pointer" />
              ) : (
                <BookmarkIcon1 className="mt-1 fill-primary-main cursor-pointer" />
              )}
            </div>
          )}
          {select?.showSelect && <RadioButton name={parcelNumber} checked={select.selected} onChange={() => {}} />}
        </div>
        <div className={clsx("px-6 grid gap-4", view === "horizontal" ? "grid-cols-2" : "grid-cols-1")}>
          <div className={clsx("relative rounded-xl", view === "horizontal" ? "" : "xs:h-32 md:h-40")}>
            <Image alt="" src="/property-map.png" fill className="rounded-xl" />
          </div>
          <ul className="flex flex-col gap-3">
            {Object.keys(data.options).map((key) => (
              <li className="flex items-center gap-1.5" key={key}>
                <div className="[&>svg]:!w-4 [&>svg]:!h-4">{data.options[key].icon}</div>
                <p className="text-sm text-grey-600">
                  {data.options[key].label}: <span className="ext-sm font-medium text-black"> {data.options[key].value}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 border-t border-grey-100 py-3 mt-4 flex items-center justify-between">
          <p className="flex gap-1.5 items-center text-xs font-medium text-grey-600">
            <CalendarIcon1 /> Available till: <span className="text-black">{data.availableTill}</span>
          </p>
          <Link href={`${routes.home.marketplace}/${sellingItemId}`}>
            <Button>Details</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandBox;
