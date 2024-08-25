import { atom } from "jotai";

export const userFollowedPropertiesAtom = atom<{
  selecting: boolean;
  removeItemsIds: number[] | null;
}>({ selecting: false, removeItemsIds: null });
