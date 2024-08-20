"use client";

import { cn } from "@/helpers/common";
import { FC, ReactNode } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { motion } from "framer-motion";

interface MobileFilterItemProps {
  open: boolean;
  disabled?: boolean;
  toggleFilter: () => void;
  filterName: string;
  children: ReactNode;
}
const MobileFilterItem: FC<MobileFilterItemProps> = ({ open, disabled, toggleFilter, filterName, children }) => (
  <div>
    <div
      className={cn(
        "flex justify-between items-center py-3 sticky top-0 bg-white",
        !open && "border-b border-grey-100",
        disabled && "pointer-events-none opacity-50"
      )}
      onClick={toggleFilter}
    >
      <p>{filterName}</p>
      {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    </div>
    {open && (
      <motion.div
        key="content"
        initial="collapsed"
        animate="open"
        variants={{
          open: { opacity: 1 },
          collapsed: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="border-b border-grey-100 pb-3 flex flex-col gap-4 mt-1">
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            variants={{
              open: { opacity: 1 },
              collapsed: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
          >
            <div className="pb-3 flex flex-col gap-4 mt-1">{children}</div>
          </motion.div>
        </div>
      </motion.div>
    )}
  </div>
);

export default MobileFilterItem;
