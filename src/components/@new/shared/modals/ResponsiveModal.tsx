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
}

const ResponsiveModal: FC<ResponsiveModalProps> = ({ open, handleClose, content, responsiveContent }) => {
  const isSmallDevice = useMediaQuery({ query: "(max-width: 768px)" });
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  });

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
