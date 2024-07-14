import { atom } from "jotai";

export const userListingAtom = atom<{
  selecting: boolean;
  selectedLandIds: number[] | null;
  bookmarkedLandIds: number[] | null;
}>({ selecting: false, selectedLandIds: null, bookmarkedLandIds: null  });
