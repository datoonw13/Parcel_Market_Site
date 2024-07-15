import { atom } from "jotai";

export const sentOffersAtom = atom<{
  selecting: boolean;
  selectedOffersIds: number[] | null;
}>({ selecting: false, selectedOffersIds: null });
