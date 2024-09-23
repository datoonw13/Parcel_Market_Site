import { VoltSearchModel, VoltSearchResultModel } from "@/types/volt";
import { atom } from "jotai";

export const voltAtom = atom<{
  searchDetails: VoltSearchModel | null;
  searchResult: VoltSearchResultModel | null;
}>({
  searchDetails: null,
  searchResult: null,
});
