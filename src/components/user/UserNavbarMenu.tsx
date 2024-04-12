import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logOut } from "@/lib/features/slices/authedUserSlice";
import Link from "next/link";
import routes from "@/helpers/routes";
import Divider from "../shared/Divider";

const UserNavbarMenu = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.authedUser);
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const firstName = user?.name.split(" ")[0] || "";
  const lastName = user?.name.split(" ")[0] || "";

  const handleClickOutside = (e: MouseEvent) => {
    if (!ref?.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className="bg-green-300 w-[56px] h-[56px] rounded-full flex items-center justify-center cursor-pointer uppercase"
      >
        {`${firstName[0]}${lastName[lastName.length - 1]}`}
      </div>
      {open && (
        <div className="pt-2 absolute bg-neutral-300 shadow-2xl rounded bottom-[-5px] translate-y-[100%] z-50 w-64 left-[0px] translate-x-[-50%] drop-shadow-2xl">
          <ul className="w-full">
            <Link href={routes.user.root}>
              <li className="px-3 py-3 text-sm cursor-pointer hover:bg-neutral-500">User Profile</li>
            </Link>
            <li className="px-3 py-3 text-sm cursor-pointer hover:bg-neutral-500">Menu Item</li>
            <li className="px-3 py-3 text-sm cursor-pointer hover:bg-neutral-500">Menu Item</li>
            <li className="px-3 py-3 text-sm cursor-pointer hover:bg-neutral-500">Menu Item</li>
            <Divider />
            <li className="px-3 py-3 text-sm cursor-pointer hover:bg-neutral-500 rounded-bl rounded-br" onClick={() => dispatch(logOut())}>
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserNavbarMenu;
