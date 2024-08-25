import { SellingPropertyDetails } from "@/types/property";
import { atom } from "jotai";

export const userFollowedPropertiesAtom = atom<{
  selecting: boolean;
  removeItemsIds: number[] | null;
  list: { [key: string]: SellingPropertyDetails[] } | null;
}>({ selecting: false, removeItemsIds: null, list: null });
