import { ISellingProperty } from "@/types/find-property";
import { atom } from "jotai";

export const followedListingsAtom = atom<{
  key: string | null;
  data: ISellingProperty[] | null;
}>({
  key: null,
  data: null,
});
