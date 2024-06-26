"use client";

import React, { FC, ReactNode } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import Modal from "./Modal";
import Drawer from "./Drawer";

interface ResponsiveModalProps {
  open: boolean;
  handleClose: () => void;
  content: ReactNode;
  responsiveContent: ReactNode;
}

const ResponsiveModal: FC<ResponsiveModalProps> = ({ open, handleClose, content, responsiveContent }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

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
