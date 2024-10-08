"use client";

import React, { FC, ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { FilterIcon1 } from "@/components/@new/icons/FilterIcons";
import Button from "../../shared/forms/Button";
import Divider from "../../shared/Divider";

const Drawer = dynamic(() => import("@/components/@new/shared/modals/Drawer"), { ssr: false });

interface MobileFiltersDrawerProps {
  disabled?: boolean;
  children: ReactNode;
  onOK: () => void;
  onClose: () => void;
  onOpen: () => void;
}

const MobileFiltersDrawer: FC<MobileFiltersDrawerProps> = ({ disabled, children, onOK, onClose, onOpen }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        disabled={disabled}
        variant="secondary"
        onClick={() => {
          setOpen(true);
          onOpen();
        }}
        className="!py-2 !px-4 !rounded-3xl"
      >
        <div className="flex items-center gap-2 font-medium text-xs ">
          Filter <FilterIcon1 className="!w-3.5 !h-2.5" />
        </div>
      </Button>
      <Drawer
        closeDrawer={() => {
          setOpen(false);
          onClose();
        }}
        open={open}
        title="Filters"
      >
        <div className="overflow-auto px-5 h-[55vh]">{children}</div>
        <Divider className="mt-2" />
        <div className="flex flex-col gap-3 p-4">
          <Button
            onClick={() => {
              onOK();
              setOpen(false);
            }}
          >
            Apply
          </Button>
          <Button
            className="!outline-none"
            variant="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            Reset
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default MobileFiltersDrawer;
