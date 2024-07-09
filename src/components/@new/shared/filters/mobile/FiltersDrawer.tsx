"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FilterIcon1 } from "@/components/@new/icons/FilterIcons";
import Button from "../../forms/Button";
import Divider from "../../Divider";

const Drawer = dynamic(() => import("@/components/@new/shared/modals/Drawer"), { ssr: false });

const FiltersDrawer = () => {
  const [open, setOpen] = useState(false);
  const [filtersTempValue, setFiltersTempValue] = useState({});

  const handleSelect = () => {};
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="!py-2 !px-4 !rounded-3xl">
        <div className="flex items-center gap-2 font-medium text-xs ">
          Filter <FilterIcon1 className="!w-3.5 !h-2.5" />
        </div>
      </Button>
      <Drawer
        closeDrawer={() => {
          setOpen(false);
        }}
        open={open}
        title="Filter"
      >
        <div className="overflow-scroll px-5">
          <div className="">test</div>
        </div>
        <Divider className="mt-2" />
        <div className="flex flex-col gap-3 p-4">
          <Button
            onClick={() => {
              setOpen(false);
              // handleSelect(drawerTempValue);
            }}
          >
            Apply
          </Button>
          <Button
            className="!outline-none"
            variant="secondary"
            onClick={() => {
              // setDrawerTempValue(selectedValue);
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

export default FiltersDrawer;
