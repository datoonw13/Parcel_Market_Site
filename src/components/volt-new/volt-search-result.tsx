"use client";

import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import { IPropertiesInteraction } from "@/types/volt";
import { cn, isElementVisible } from "@/lib/utils";
import { IMainPropertyBaseInfo } from "@/types/property";
import VoltItem from "./volt-item";

interface VoltSearchResultProps {
  className?: string;
  data: IMainPropertyBaseInfo[];
  propertiesInteraction: IPropertiesInteraction;
  setPropertiesInteraction: Dispatch<SetStateAction<IPropertiesInteraction>>;
}

const VoltSearchResult: FC<VoltSearchResultProps> = ({ className, data, propertiesInteraction, setPropertiesInteraction }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (propertiesInteraction.hover?.openId && !isElementVisible(`search-result-${propertiesInteraction.hover.openId}`, "volt-scroll")) {
      document
        .getElementById(`calculation-${propertiesInteraction.hover?.openId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [propertiesInteraction]);

  useEffect(
    () => () => {
      setPropertiesInteraction({ hover: null, popup: null });
    },
    [setPropertiesInteraction]
  );

  useEffect(() => {
    if (data.length === 1) {
      setPropertiesInteraction((prevData) => ({
        ...prevData,
        popup: {
          clickId: data[0].parcelNumberNoFormatting,
          isBulked: false,
          openId: data[0].parcelNumberNoFormatting,
        },
      }));
    }
  }, [data, setPropertiesInteraction]);

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <VoltItem
            isSellingProperty
            id={`search-result-${item.id}`}
            key={item.id}
            data={item}
            onHover={(property) => {
              setPropertiesInteraction((prevData) => ({
                ...prevData,
                hover: {
                  clickId: property.parcelNumberNoFormatting,
                  isBulked: false,
                  openId: property.parcelNumberNoFormatting,
                },
              }));
            }}
            onMouseLeave={() => {
              setPropertiesInteraction((prevData) => ({
                ...prevData,
                hover: null,
              }));
            }}
            selected={item.parcelNumberNoFormatting === propertiesInteraction.popup?.openId}
            onSelect={(property) => {
              setPropertiesInteraction((prevData) => ({
                ...prevData,
                popup: {
                  clickId: property.parcelNumberNoFormatting,
                  isBulked: false,
                  openId: property.parcelNumberNoFormatting,
                },
              }));
            }}
            isHighlighted={
              propertiesInteraction.hover?.openId === item.parcelNumberNoFormatting ||
              propertiesInteraction.popup?.openId === item.parcelNumberNoFormatting
            }
          />
        ))}
      </div>
    </div>
  );
};

export default VoltSearchResult;
