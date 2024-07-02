"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Modal from "./Modal";
import Drawer from "./Drawer";

interface ResponsiveModalProps {
  open: boolean;
  handleClose: () => void;
  content: ReactNode;
  responsiveContent: ReactNode;
  desktopModalContentClasses?: string;
}

const ResponsiveModal: FC<ResponsiveModalProps> = ({ open, handleClose, content, responsiveContent, desktopModalContentClasses }) => {
  const isSmallDevice = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      {!isSmallDevice && (
        <Modal open={open} closeModal={handleClose} contentClasses={desktopModalContentClasses}>
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
