"use client";

import { useAtom } from "jotai";
import { voltAtom } from "@/atoms/volt-atom";
import VoltItem from "./volt-item";

const VoltSearchResult = () => {
  const [voltSlice, setVoltSlice] = useAtom(voltAtom);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="font-semibold text-lg">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <div className="flex flex-col gap-2">
        {voltSlice.searchResult?.map((item) => (
          <VoltItem
            key={item.properties.fields.parcelnumb}
            data={{
              acreage: Number(item.properties.fields.ll_gisacre),
              owner: item.properties.fields.owner,
              parcelNumber: item.properties.fields.parcelnumb_no_formatting,
              pricePerAcre: null,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VoltSearchResult;
