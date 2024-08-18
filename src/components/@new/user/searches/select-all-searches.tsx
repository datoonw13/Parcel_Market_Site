"use client";

import { useAtom } from "jotai";
import { useUserSearchAtom } from "@/atoms/user-search-atom";
import clsx from "clsx";
import { AuthedUserSearches } from "@/types/auth";
import CheckBox from "../../shared/forms/CheckBox";

const SelectAllSearches = ({ data }: { data: AuthedUserSearches[] }) => {
  const [userSearchAtom, setUserSearchAtom] = useAtom(useUserSearchAtom);

  return (
    userSearchAtom.selecting && (
      <div>
        <div
          className={clsx(
            "py-3 px-6 flex items-center justify-between cursor-pointer transition-all duration-100 hover:bg-primary-main-50"
          )}
        >
          <CheckBox
            label="Select All"
            className="!text-sm !font-medium !text-black"
            checked={userSearchAtom.selectedIds?.length === data.length}
            onChange={() => {
              if (userSearchAtom.selectedIds?.length === data.length) {
                setUserSearchAtom((prev) => ({ ...prev, selectedIds: [] }));
              } else {
                setUserSearchAtom((prev) => ({ ...prev, selectedIds: data.map((el) => el.id) }));
              }
            }}
          />
        </div>
      </div>
    )
  );
};

export default SelectAllSearches;
