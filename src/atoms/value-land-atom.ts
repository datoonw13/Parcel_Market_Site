import { IAuthSliceInitial } from "@/types/auth";
import { IFindPropertyEstimatedPriceResponse, ISellProperty } from "@/types/find-property";
import { IMap } from "@/types/map";
import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { atom } from "jotai";
import { z } from "zod";

export const valueLandAtom = atom<{
  lands: null | IMap;
  selectedLand: null | IMap[0];
  calculatedPrice: IFindPropertyEstimatedPriceResponse | null;
  sellOptions: IAuthSliceInitial["selectedParcelOptions"] | null;
  sellerType: ISellProperty["sellerType"] | null;
  aboutLand: z.infer<typeof aboutLandSchema> | null;
  mapInteraction: {
    hoveredLand: string | null;
  };
}>({
  lands: null,
  selectedLand: null,
  calculatedPrice: null,
  sellOptions: null,
  sellerType: null,
  aboutLand: null,
  mapInteraction: { hoveredLand: null },
});
