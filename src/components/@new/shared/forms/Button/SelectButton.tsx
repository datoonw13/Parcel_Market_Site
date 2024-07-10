"use client";

import { FC } from "react";
import clsx from "clsx";
import { RemoveIcon1 } from "@/components/@new/icons/RemoveIcons";
import Button from ".";

interface SelectButtonProps {
  onClick: () => void;
  total?: number;
  selecting: boolean;
  className?: string;
  onRemove: () => void;
}

const SelectButton: FC<SelectButtonProps> = ({ onClick, total, selecting, className, onRemove }) => (
  <div className="flex items-center gap-2">
    <Button
      onClick={onClick}
      className={clsx(
        "!py-1 !px-3 !outline-none !rounded-3xl text-xs !text-black !transition-none",
        selecting ? "!bg-grey-200" : "!bg-grey-50 ",
        className
      )}
      variant="secondary"
    >
      {`${total || ""}`} Select
    </Button>
    {!!total && (
      <Button
        variant="secondary"
        className="!w-[30px] h-[30px] !outline-none !rounded-full hover:!bg-error-100 !p-0 group"
        onClick={onRemove}
      >
        <RemoveIcon1 className="group-hover:fill-error" />
      </Button>
    )}
  </div>
);

export default SelectButton;
