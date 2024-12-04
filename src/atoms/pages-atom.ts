import { atom } from "jotai";

export const userSearchesAtom = atom<{
  selecting: boolean;
  selectedIds: number[];
  isAllSelected: boolean;
}>({ selectedIds: [], selecting: false, isAllSelected: false });

export const userNotificationsAtom = atom<{
  selecting: boolean;
  selectedIds: number[];
  isAllSelected: boolean;
}>({ selectedIds: [], selecting: false, isAllSelected: false });
