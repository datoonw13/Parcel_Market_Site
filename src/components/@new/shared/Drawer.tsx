"use client";

import React, { FC, ReactElement, useCallback, useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";
import Divider from "@/components/shared/Divider";

interface ModalProps {
  open: boolean;
  closeModal?: () => void;
  disableCloseOnAwayClick?: boolean;
  children: ReactElement;
  disableBackDrop?: boolean;
  title?: string;
}

const Drawer: FC<ModalProps> = ({ open, closeModal, disableCloseOnAwayClick, children, disableBackDrop, title }) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(null, popperElement, {
    strategy: "fixed",
  });

  const handleClickOutside = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!popperElement?.childNodes[0]?.contains(e.target as Node) && closeModal && !disableCloseOnAwayClick) {
        closeModal();
      }
    },
    [popperElement, closeModal, disableCloseOnAwayClick]
  );

  useEffect(() => {
    if (popperElement && !disableCloseOnAwayClick) {
      document.addEventListener("mouseup", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [popperElement, handleClickOutside, disableCloseOnAwayClick]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <div
            ref={setPopperElement}
            style={{ ...styles.popper, background: disableBackDrop ? "transparent" : "rgba(0, 0, 0, 0.5)" }}
            className="!m-auto z-50 w-full h-full flex items-end justify-center"
            {...attributes.popper}
          >
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} transition={{ ease: "linear", duration: 0.1 }}>
              <div className="w-screen bg-white rounded-t-2xl flex flex-col">
                <hr className="border-4 rounded-md border-grey-200 w-10 m-auto mt-2" />
                {title && <p className="font-semibold border-b border-grey-200 pt-3 pb-4 text-center">{title}</p>}
                <div>{children}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Drawer;
