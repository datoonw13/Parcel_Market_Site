import { atom } from "jotai";

export const userRecentSearchesAtom = atom<{
  selecting: boolean;
  selectedIds: number[];
  isAllSelected: boolean;
}>({ selectedIds: [], selecting: false, isAllSelected: false });