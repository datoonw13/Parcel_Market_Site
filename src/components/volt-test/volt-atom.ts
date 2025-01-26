import { IMainPropertyBaseInfo } from "@/types/property";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

export const voltAtom = atomWithReset<{
  searchResults: IMainPropertyBaseInfo[] | null;
  sellingPropertyParcelNumber: string | null;
  hoveredParcelNumber: string | null;
  selectedParcelNumber: string | null;
  zoomMap: boolean;
}>({ searchResults: null, sellingPropertyParcelNumber: null, hoveredParcelNumber: null, selectedParcelNumber: null, zoomMap: false });
