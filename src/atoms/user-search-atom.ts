import { atom } from "jotai";

export const useUserSearchAtom = atom<{
  selecting: boolean;
  selectedIds: number[] | null;
}>({ selecting: false, selectedIds: null });
