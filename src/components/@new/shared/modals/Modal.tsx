"use client";

import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  closeModal?: () => void;
  onModalClose?: () => void;
  disableCloseOnAwayClick?: boolean;
  children: ReactNode;
  disableBackdrop?: boolean;
  contentClasses?: string;
}

const Modal: FC<ModalProps> = ({ open, onModalClose, closeModal, disableCloseOnAwayClick, children, disableBackdrop, contentClasses }) => {
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
      <AnimatePresence onExitComplete={onModalClose}>
        {open && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ ...styles.popper, background: !disableBackdrop ? "rgba(0, 0, 0, 0.4)" : "transparent" }}
            className="!m-auto z-50 w-full h-full flex items-center justify-center"
            {...attributes.popper}
          >
            <div ref={setPopperElement} className={clsx(contentClasses, "flex items-center justify-center w-full")}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
