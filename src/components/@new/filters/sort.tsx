"use client";

import { FC, MouseEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import dynamic from "next/dynamic";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ArrowIconsUnion1 } from "../icons/ArrowIcons";
import Popper from "../shared/Popper";
import AutoCompleteListBox from "../shared/forms/AutoComplete/AutoCompleteListBox";
import AutoCompleteListItem from "../shared/forms/AutoComplete/AutoCompleteListItem";
import RadioButton from "../shared/forms/RadioButton";
import Divider from "../shared/Divider";
import Button from "../shared/forms/Button";

const Drawer = dynamic(() => import("@/components/@new/shared/modals/Drawer"), { ssr: false });

const SortButton = ({
  onClick,
  selectedFilter,
  disabled,
}: {
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  selectedFilter: string | null;
  disabled?: boolean;
}) => (
  <div
    className={clsx("flex items-center gap-2 cursor-pointer", disabled && "pointer-events-none opacity-55 !cursor-not-allowed")}
    onClick={onClick}
  >
    <p className="font-medium text-xs capitalize">{selectedFilter || "Sort by"}</p>
    <ArrowIconsUnion1 className="!h-2.5 !w-2" />
  </div>
);

interface SortProps {
  options: { [key: string]: string };
  disabled?: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

const Sort: FC<SortProps> = ({ options, disabled, onChange, value }) => {
  const isSmallDevice = useMediaQuery(640);
  const pathname = usePathname();
  const [drawerTempValue, setDrawerTempValue] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div className="w-fit">
      {!isSmallDevice && (
        <Popper
          placement="bottom-end"
          disableSameWidth
          renderButton={(setReferenceElement, referenceElement) => (
            <SortButton
              disabled={disabled}
              onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)}
              selectedFilter={value}
            />
          )}
          renderContent={(setReferenceElement) => (
            <AutoCompleteListBox className="!w-32">
              {Object.keys(options).map((key) => (
                <AutoCompleteListItem
                  className="!w-full capitalize"
                  key={key}
                  id={key}
                  onClick={() => {
                    setReferenceElement(null);
                    onChange(options[key]);
                  }}
                >
                  {options[key]}
                </AutoCompleteListItem>
              ))}
            </AutoCompleteListBox>
          )}
        />
      )}
      {isSmallDevice && (
        <>
          <SortButton disabled={disabled} onClick={(e) => setOpenDrawer(true)} selectedFilter={value} />
          <Drawer
            closeDrawer={() => {
              setOpenDrawer(false);
            }}
            open={openDrawer}
            title="Sort By"
          >
            <div className="overflow-scroll px-5">
              <div className="">
                <div className={clsx("flex flex-col py-4 gap-4")}>
                  {Object.keys(options).map((key) => (
                    <RadioButton
                      key={key}
                      checked={drawerTempValue === options[key]}
                      name={`sort-${key}`}
                      label={options[key]}
                      onChange={() => setDrawerTempValue(options[key])}
                      labelClassName="capitalize"
                    />
                  ))}
                </div>
              </div>
            </div>
            <Divider className="mt-2" />
            <div className="flex flex-col gap-3 p-4">
              <Button
                onClick={() => {
                  setOpenDrawer(false);
                  onChange(drawerTempValue);
                }}
              >
                Apply
              </Button>
              <Button
                className="!outline-none"
                variant="secondary"
                onClick={() => {
                  setDrawerTempValue(value);
                  setOpenDrawer(false);
                }}
              >
                Reset
              </Button>
            </div>
          </Drawer>
        </>
      )}
    </div>
  );
};

export default Sort;