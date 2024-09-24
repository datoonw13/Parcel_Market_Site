"use client";

import { FC, ReactNode } from "react";
import { ResolvableTo, ScreensConfig } from "tailwindcss/types/config";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { breakPoints } from "../../../../tailwind.config";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "./drawer";
import { Button } from "../button";
import { Dialog, DialogContent } from "./dialog";

interface ResponsiveDialogProps {
  mediaQuery?: keyof typeof breakPoints;
  content: ReactNode;
  responsiveContent: ReactNode;
  open: boolean;
  closeModal: () => void;
  classes?: {
    root: string;
    content: string;
  };
  responsiveClasses?: {
    root: string;
    content: string;
  };
}

interface WrapperBaserProps {
  open: boolean;
  children: ReactNode;
  closeModal: () => void;
}

const DrawerWrapper: FC<WrapperBaserProps & { classes: ResponsiveDialogProps["responsiveClasses"] }> = ({
  children,
  closeModal,
  open,
  classes,
}) => (
  <Drawer open={open} onOpenChange={(open) => !open && closeModal}>
    <DrawerContent className={cn(classes?.content)}>{children}</DrawerContent>
  </Drawer>
);

const DialogWrapper: FC<WrapperBaserProps & { classes: ResponsiveDialogProps["classes"] }> = ({ children, closeModal, open, classes }) => (
  <Dialog open={open}>
    <DialogContent className={cn("max-w-md", classes?.content)}>{children}</DialogContent>
  </Dialog>
);

const ResponsiveDialog: FC<ResponsiveDialogProps> = (props) => {
  const { mediaQuery = "md", content, responsiveContent, open, closeModal, classes, responsiveClasses } = props;
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints[mediaQuery]));

  return (
    !detecting && (
      <>
        {isSmallDevice && (
          <DrawerWrapper classes={responsiveClasses} open={open} closeModal={closeModal}>
            {responsiveContent}
          </DrawerWrapper>
        )}
        {!isSmallDevice && (
          <DialogWrapper classes={classes} open={open} closeModal={closeModal}>
            {content}
          </DialogWrapper>
        )}
      </>
    )
  );
};

export default ResponsiveDialog;
