import { atom } from "jotai";

export const propertyInteractionAtom = atom<{
  hoveredParcelNumber: string | null;
  selectedParcelNumber: string | null;
  zoomMap: boolean;
}>({ hoveredParcelNumber: null, selectedParcelNumber: null, zoomMap: false });
