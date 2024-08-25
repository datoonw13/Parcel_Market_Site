import { atom } from "jotai";

export const userPropertiesAtom = atom<{
  selecting: boolean;
  removeItemsIds: number[] | null;
}>({ selecting: false, removeItemsIds: null });
