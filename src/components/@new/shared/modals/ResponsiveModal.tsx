"use client";

import React, { FC, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import Modal from "./Modal";
import Drawer from "./Drawer";

interface ResponsiveModalProps {
  open: boolean;
  handleClose: () => void;
  content: ReactNode;
  responsiveContent: ReactNode;
}

const ResponsiveModal: FC<ResponsiveModalProps> = ({ open, handleClose, content, responsiveContent }) => {
  "use client";

  const isSmallDevice = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      {!isSmallDevice && (
        <Modal open={open} closeModal={handleClose}>
          {content}
        </Modal>
      )}
      {isSmallDevice && (
        <Drawer closeDrawer={handleClose} open={open}>
          {responsiveContent}
        </Drawer>
      )}
    </>
  );
};

export default ResponsiveModal;
