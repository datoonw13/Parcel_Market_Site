/* eslint-disable react/no-unused-prop-types */

"use client";

import { FC } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { IoInformationCircleOutline } from "react-icons/io5";
import { breakPoints } from "../../../../tailwind.config";
import { Drawer, DrawerContent } from "./drawer";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface ResponsiveAlertDialogProps {
  mediaQuery?: keyof typeof breakPoints;
  open: boolean;
  closeModal: () => void;
  title: string;
  description: string;
  okButton: {
    show?: boolean;
    label?: string;
    onClick?: () => void;
    pending?: boolean;
  };
  cancelButton: {
    show?: boolean;
    label?: string;
    onClick?: () => void;
  };
}

const footerStyle = (mediaQuery: ResponsiveAlertDialogProps["mediaQuery"]) =>
  `w-full justify-center items-center flex flex-col gap-3 flex-col-reverse ${mediaQuery}:flex-row `;

const Content: FC<ResponsiveAlertDialogProps> = (props) => (
  <>
    <DialogHeader>
      <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-3 bg-primary-main-100 mx-auto")}>
        <IoInformationCircleOutline className="size-6 text-primary-main" />
      </div>
      <DialogTitle className="text-center !font-semibold !text-base !p-0">{props.title}</DialogTitle>
      <DialogDescription className="text-center text-grey-800 text-sm">{props.description}</DialogDescription>
    </DialogHeader>
    {(props.okButton?.show || props.cancelButton?.show) && (
      <div className={cn(footerStyle(props.mediaQuery))}>
        {props.cancelButton?.show && (
          <Button onClick={props.cancelButton.onClick} className="w-full" variant="secondary">
            {props.cancelButton.label || "Close"}
          </Button>
        )}
        {props.okButton?.show && (
          <Button onClick={props.okButton.onClick} loading={props.okButton.pending} className="w-full">
            {props.okButton.label || "Ok"}
          </Button>
        )}
      </div>
    )}
  </>
);

const DrawerWrapper: FC<ResponsiveAlertDialogProps> = (props) => (
  <Drawer open={props.open} onOpenChange={(open) => !open && props.closeModal}>
    <DrawerContent className={cn("")}>
      <div className="max-w-lg mx-auto p-6 space-y-6">
        <Content {...props} />
      </div>
    </DrawerContent>
  </Drawer>
);

const DialogWrapper: FC<ResponsiveAlertDialogProps> = (props) => (
  <Dialog open={props.open} onOpenChange={(open) => !open && props.closeModal}>
    <DialogContent className={cn("max-w-md gap-6")} closeModal={props.closeModal}>
      <Content {...props} />
    </DialogContent>
  </Dialog>
);

const ResponsiveAlertDialog: FC<ResponsiveAlertDialogProps> = (props) => {
  const mediaQuery = props.mediaQuery || "md";
  const { detecting, targetReached: isSmallDevice } = useMediaQuery(parseFloat(breakPoints[mediaQuery]));

  return (
    !detecting && (
      <>
        {isSmallDevice && <DrawerWrapper {...{ ...props, mediaQuery }} />}
        {!isSmallDevice && <DialogWrapper {...{ ...props, mediaQuery }} />}
      </>
    )
  );
};

export default ResponsiveAlertDialog;
