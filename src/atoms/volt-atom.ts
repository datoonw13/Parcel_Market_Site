import { IMainPropertyBaseInfo } from "@/types/property";
import { atom } from "jotai";

export const voltAtom = atom<{
  isSearchResultsVisible: boolean;
  searchResults: IMainPropertyBaseInfo[] | null;
  sellingPropertyParcelNumber: string | null;
}>({ isSearchResultsVisible: false, searchResults: null, sellingPropertyParcelNumber: null });
