import { atom } from "jotai";

export const userRecentSearchesAtom = atom<{
  selecting: boolean;
  selectedIds: string[];
  isAllSelected: boolean;
}>({ selectedIds: [], selecting: false, isAllSelected: false });
