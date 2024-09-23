import { IMap } from "@/types/map";
import { VoltSearchModel, VoltSearchResultModel } from "@/types/volt";
import { atom } from "jotai";

export const voltAtom = atom<{
  searchDetails: VoltSearchModel | null;
  searchResult: VoltSearchResultModel | null;
  selectedItem: IMap[0] | null;
}>({
  searchDetails: null,
  searchResult: null,
  selectedItem: null,
});
