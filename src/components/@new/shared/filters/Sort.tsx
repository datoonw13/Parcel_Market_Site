"use client";

import { FC, MouseEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { ArrowIconsUnion1 } from "../../icons/ArrowIcons";
import Popper from "../Popper";
import AutoCompleteListItem from "../forms/AutoComplete/AutoCompleteListItem";
import AutoCompleteListBox from "../forms/AutoComplete/AutoCompleteListBox";
import RadioButton from "../forms/RadioButton";
import Button from "../forms/Button";
import Divider from "../Divider";

const Drawer = dynamic(() => import("@/components/@new/shared/modals/Drawer"), { ssr: false });

const SortButton = ({ onClick, selectedFilter }: { onClick: (e: MouseEvent<HTMLDivElement>) => void; selectedFilter: string | null }) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
    <p className="font-medium text-xs capitalize">{selectedFilter || "Sort by"}</p>
    <ArrowIconsUnion1 className="!h-2.5 !w-2" />
  </div>
);

interface SortProps {
  options: { [key: string]: string };
}

const Sort: FC<SortProps> = ({ options }) => {
  const isSmallDevice = useMediaQuery({ query: "(max-width: 640px)" });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const selectedValue = params.get("sortBy");
  const [drawerTempValue, setDrawerTempValue] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleSelect = (newValue: string | null) => {
    if (newValue) {
      params.set("sortBy", newValue);
      setDrawerTempValue(newValue);
    } else {
      params.delete("sortBy");
      setDrawerTempValue(null);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-fit">
      {!isSmallDevice && (
        <Popper
          placement="bottom-end"
          disableSameWidth
          renderButton={(setReferenceElement, referenceElement) => (
            <SortButton onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)} selectedFilter={selectedValue} />
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
                    handleSelect(options[key]);
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
          <SortButton onClick={(e) => setOpenDrawer(true)} selectedFilter={selectedValue} />
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
                  handleSelect(drawerTempValue);
                }}
              >
                Apply
              </Button>
              <Button
                className="!outline-none"
                variant="secondary"
                onClick={() => {
                  setDrawerTempValue(selectedValue);
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
