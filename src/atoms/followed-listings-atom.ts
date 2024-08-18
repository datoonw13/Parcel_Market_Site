import { SellingPropertyDetails } from "@/types/property";
import { atom } from "jotai";

export const followedListingsAtom = atom<{
  key: string | null;
  data: SellingPropertyDetails[] | null;
}>({
  key: null,
  data: null,
});
