import { IAuthSliceInitial } from "@/types/auth";
import { IFindPropertyEstimatedPriceResponse } from "@/types/find-property";
import { IMap } from "@/types/map";
import { atom } from "jotai";

export const valueLandAtom = atom<{
  lands: null | IMap;
  selectedLand: null | IMap[0];
  calculatedPrice: IFindPropertyEstimatedPriceResponse | null;
  sellOptions: IAuthSliceInitial["selectedParcelOptions"] | null;
}>({ lands: null, selectedLand: null, calculatedPrice: null, sellOptions: null });
