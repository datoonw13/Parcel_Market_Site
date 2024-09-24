"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialogs/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Close } from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CalculationTerms from "./calculation-terms";

const CalculationTermsDialog = ({ open, closeModal, onAccept }: { open?: boolean; closeModal: () => void; onAccept: () => void }) => {
  const [agreed, setAgreed] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          closeModal();
        }
      }}
    >
      <DialogContent
        hideClose
        className="w-[calc(100vw-30%)] max-h-[calc(100vh-20%)] max-w-4xl px-0 overflow-hidden grid grid-rows-[minmax(0,_max-content)_1fr] pb-0"
      >
        <DialogHeader className="flex flex-row items-center justify-between gap-2 px-6 pb-6 border-b border-b-grey-100">
          <DialogTitle className="text-lg font-semibold">Information before we calculate</DialogTitle>
          <Close
            onClick={closeModal}
            className="!mt-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none "
          >
            <IoMdClose className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Close>
        </DialogHeader>
        <div className="grid gap-4 p-6  mx-6 border border-grey-100 rounded-2xl overflow-hidden">
          <ScrollArea>
            <CalculationTerms onValueChange={(value) => setAgreed(value)} />
          </ScrollArea>
        </div>
        <DialogFooter className="px-6 py-4">
          <Button type="submit" variant="secondary" onClick={closeModal}>
            Decline
          </Button>
          <Button type="submit" disabled={!agreed} onClick={onAccept}>
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalculationTermsDialog;
