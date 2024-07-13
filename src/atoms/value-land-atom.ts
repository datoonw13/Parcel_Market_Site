import { IMap } from "@/types/map";
import { atom } from "jotai";

export const valueLandAtom = atom<{
  lands: null | IMap;
  selectedLand: null | IMap[0];
}>({ lands: null, selectedLand: null });
