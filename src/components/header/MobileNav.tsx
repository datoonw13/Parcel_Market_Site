"use client";

import Button from "@/components/shared/Button";
import BurgerIcon from "@/icons/BurgerIcon";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="xl:hidden">
      <div className="w-[30px] sm:w-[40px] ml-2 cursor-pointer" onClick={() => setOpen(!open)}>
        <BurgerIcon />
      </div>
      <div id="dialog-right" className="relative z-10" onClick={() => setOpen(!open)}>
        <div
          className={clsx(
            "fixed inset-0 bg-backdrop transition-all duration-500 ease-in-out ",
            open ? "opacity-100 visibl" : "opacity-0 invisible "
          )}
        />
        <div className={clsx({ "fixed inset-0 overflow-hidden": open })}>
          <div className="absolute inset-0 overflow-hidden">
            <div className={clsx("pointer-events-none fixed max-w-full", "inset-y-0 right-0")}>
              <div
                className={clsx(
                  "pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500",
                  open ? "translate-x-0" : "translate-x-full"
                )}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <div className="flex h-full bg-neutral-400 shadow-lg w-[300px] flex-col">
                  <Button type="text" classNames="rounded-none">
                    Sell your property
                  </Button>
                  <Button type="text" classNames="rounded-none">
                    Find a Preferred Land Agent
                  </Button>
                  <Button type="text" classNames="rounded-none">
                    About Us
                  </Button>
                  <Button type="text">
                    <Link href="/sign-in"> Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
