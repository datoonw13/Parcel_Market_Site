/* eslint-disable react/no-unused-prop-types */

"use client";

import { FC, ReactNode } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { breakPoints } from "../../../../tailwind.config";
import { Drawer, DrawerContent } from "./drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface ResponsiveModalProps {
  mediaQuery?: keyof typeof breakPoints | null;
  open: boolean;
  closeModal: () => void;
  children: ReactNode;
  dialogContentClassName?: string;
  drawerContentClassName?: string;
  modalTitle?: string;
}
const DrawerContentWrapper: FC<ResponsiveModalProps> = (props) => (
  <>
    <DialogHeader className="hidden" />
    <DialogTitle className="sr-only">TEST</DialogTitle>
    {props.children}
  </>
);

const DialogContentWrapper: FC<ResponsiveModalProps> = (props) => (
  <>
    <DialogHeader className="hidden" />
    <DialogTitle className={cn(!props.modalTitle && "sr-only")}>{props.modalTitle || "TEST"}</DialogTitle>
    {props.children}
  </>
);

const DrawerWrapper: FC<ResponsiveModalProps> = (props) => (
  <Drawer open={props.open} onOpenChange={(open) => !open && props.closeModal()}>
    <DrawerContent className={cn("px-4", props.drawerContentClassName)}>
      <DrawerContentWrapper {...props} />
    </DrawerContent>
  </Drawer>
);

const DialogWrapper: FC<ResponsiveModalProps> = (props) => (
  <Dialog open={props.open} onOpenChange={(open) => !open && props.closeModal()}>
    <DialogContent className={cn("border-0 bg-white shadow-4", props.dialogContentClassName)} closeModal={props.closeModal}>
      <DialogContentWrapper {...props} />
    </DialogContent>
  </Dialog>
);

const ResponsiveModal: FC<ResponsiveModalProps> = (props) => {
  const mediaQuery = props.mediaQuery || "md";
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints[mediaQuery]));

  return (
    !detecting && (
      <>
        {isSmallDevice && props.mediaQuery !== null && <DrawerWrapper {...{ ...props, mediaQuery }} />}
        {(!isSmallDevice || props.mediaQuery === null) && <DialogWrapper {...{ ...props, mediaQuery }} />}
      </>
    )
  );
};

export default ResponsiveModal;
