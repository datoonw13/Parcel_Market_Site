import { IMainPropertyBaseInfo } from "@/types/property";
import { propertySearchTypeValidation } from "@/zod-validations/volt-new";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { z } from "zod";

export const voltAtom = atomWithReset<{
  searchResults: IMainPropertyBaseInfo[] | null;
  sellingPropertyParcelNumber: string | null;
  hoveredParcelNumber: string | null;
  selectedParcelNumber: string | null;
  zoomMap: boolean;
}>({ searchResults: null, sellingPropertyParcelNumber: null, hoveredParcelNumber: null, selectedParcelNumber: null, zoomMap: false });

export const voltSearchTypeAtom = atom<z.infer<typeof propertySearchTypeValidation>["searchType"]>("parcelNumber");
