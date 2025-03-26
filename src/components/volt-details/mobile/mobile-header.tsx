"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { z } from "zod";
import { IoInformationCircleOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { PropertyDataSchema } from "@/zod-validations/volt-new";
import { Tooltip } from "../../ui/tooltip";
import { Switch } from "../../ui/switch";
import { AvgDescription, VoltDescription } from "../tooltip-contents";

interface VoltDetailsMobileHeaderProps {
  data: z.infer<typeof PropertyDataSchema>;
  isNonValidMedianHighlighted: boolean;
  setNonValidMedianHighlighted: Dispatch<SetStateAction<boolean>>;
  isSubscribed: boolean;
}

const VoltDetailsMobileHeader: FC<VoltDetailsMobileHeaderProps> = ({
  data,
  isNonValidMedianHighlighted,
  setNonValidMedianHighlighted,
  isSubscribed,
}) => (
  <div className="grid grid-cols-[1fr_1.2fr] gap-2 py-3 px-2.5 border-y">
    <div className="border rounded-xl py-2 px-1.5 h-9 bg-white text-xs font-medium flex items-center justify-between gap-1.5">
      <div>
        Avg:{" "}
        <span className={cn(!isSubscribed && !(data.assessments.data.length <= 1) && "blur-[2px]")}>
          {data.assessments.data.length <= 1 ? "$ NaN" : data.nonVoltPrice.formattedString}
        </span>
      </div>
      <Tooltip
        sideOffset={20}
        alignOffset={20}
        contentClasses="bg-transparent p-0 border-0 w-max max-w-xs"
        renderButton={<IoInformationCircleOutline className="size-4 text-grey-600" />}
        renderContent={
          <div
            className="p-0.5"
            style={{
              background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
              borderRadius: 12,
              boxShadow: "0px 4px 12px 0px #0000001F",
            }}
          >
            <div style={{ borderRadius: 10 }} className="bg-white">
              <AvgDescription />
            </div>
          </div>
        }
      />
      {/* <Tooltip renderButton={<IoInformationCircleOutline className="size-4 text-grey-600" />} renderContent="Some text." /> */}
    </div>
    <div className="border rounded-xl py-2 px-1.5 h-9 bg-white text-xs font-medium flex items-center justify-between gap-0.5">
      <div className="flex items-center gap-1 justify-between border-r pr-1 mr-1">
        <div className="flex items-center gap-1">
          VOLT:
          <span className={cn(!isSubscribed && !(data.assessments.data.length < 3) && "blur-[2px]")}>
            {data.assessments.data.length < 3 ? " $ NaN" : data.assessments.calculations.avgPriceOfAssessments.all.formattedString}
          </span>
        </div>
        <Tooltip
          contentClasses="bg-transparent p-0 border-0 w-max max-w-xs"
          renderButton={<IoInformationCircleOutline className="size-4 text-grey-600" />}
          renderContent={
            <div
              className="p-0.5"
              style={{
                background: "linear-gradient(98.26deg, #FA98A3 12.83%, #FF001F 138.73%)",
                borderRadius: 12,
                boxShadow: "0px 4px 12px 0px #0000001F",
              }}
            >
              <div style={{ borderRadius: 10 }} className="bg-white h-[250px] overflow-auto">
                <VoltDescription />
              </div>
            </div>
          }
        />
      </div>
      <Tooltip
        renderButton={
          <Switch
            checked={isNonValidMedianHighlighted}
            disabled={data.assessments.data.length < 3}
            onCheckedChange={() => setNonValidMedianHighlighted(!isNonValidMedianHighlighted)}
            className="[&:has([data-state=checked])]:bg-warning [&[data-state=checked]>span]:translate-x-4 h-4 w-8 [&>span]:w-3 [&>span]:h-3"
          />
        }
        renderContent={data.assessments.data.length < 3 ? "VOLT works only for more than 2 properties." : ""}
      />
    </div>
  </div>
);

export default VoltDetailsMobileHeader;
