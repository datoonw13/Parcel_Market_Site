"use client";

import { AutoComplete } from "@/components/ui/autocomplete";
import { getAllStates, getCounties } from "@/helpers/states";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TestSelect = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const searchParams = new URLSearchParams(params.toString());

  return (
    <div className="flex gap-24 bg-grey-200">
      <AutoComplete
        options={getAllStates({ filterBlackList: false }).map(({ counties, ...el }) => el)}
        onValueChange={(item) => {
          if (item) {
            searchParams.set("state", item);
            searchParams.delete("county");
            router.push(`${pathname}?${searchParams.toString()}`);
          }
        }}
        placeholder="State"
        selectedValue={searchParams.get("state") || null}
      />
      <AutoComplete
        options={getCounties(searchParams.get("state"))}
        disabled={!searchParams.get("state")}
        onValueChange={(item) => {
          if (item) {
            searchParams.set("county", item);
            router.push(`${pathname}?${searchParams.toString()}`);
          }
        }}
        placeholder="County"
        selectedValue={searchParams.get("county") || null}
      />
    </div>
  );
};

export default TestSelect;
