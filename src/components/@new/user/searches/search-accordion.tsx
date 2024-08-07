"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useUserSearchAtom } from "@/atoms/user-search-atom";
import { ArrowIconDown1, ArrowIconUp1 } from "../../icons/ArrowIcons";
import CheckBox from "../../shared/forms/CheckBox";

const SearchAccordion = ({ children, id, title }: { children: ReactNode; id: number; title: string }) => {
  const [open, setOpen] = useState(false);
  const [userSearchAtom, setUserSearchAtom] = useAtom(useUserSearchAtom);

  const handleSelect = () => {
    const isExist = userSearchAtom.selectedIds?.includes(id);
    setUserSearchAtom((prev) => ({
      ...prev,
      selectedIds: isExist ? [...(prev.selectedIds || [])].filter((el) => el !== id) : [...(prev.selectedIds || []), id],
    }));
  };

  useEffect(() => {
    if (userSearchAtom.selecting) {
      setOpen(false);
    }
  }, [userSearchAtom.selecting]);

  return (
    <div className={clsx(open && "!border-b-0 ")}>
      <div
        className={clsx(
          "py-3 px-6 flex items-center justify-between cursor-pointer transition-all duration-100 hover:bg-primary-main-50",
          open && "!bg-primary-main-100 !rounded-none"
        )}
        onClick={() => {
          if (userSearchAtom.selecting) {
            handleSelect();
          } else {
            setOpen(!open);
          }
        }}
      >
        <div className="flex items-center gap-3">
          {userSearchAtom.selecting && (
            <CheckBox onChange={() => {}} className="pointer-events-none" checked={userSearchAtom.selectedIds?.includes(id) || false} />
          )}
          <p className=" text-sm font-medium">{title}</p>
        </div>
        {open ? <ArrowIconUp1 /> : <ArrowIconDown1 />}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.1, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6">{children}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAccordion;
