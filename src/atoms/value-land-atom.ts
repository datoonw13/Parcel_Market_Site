import { IMap } from "@/types/map";
import { PropertyPriceCalculationRes, PropertySellReq } from "@/types/property";
import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { atom } from "jotai";
import { z } from "zod";

export const valueLandAtom = atom<{
  lands: null | IMap;
  selectedLand: null | IMap[0];
  calculatedPrice: PropertyPriceCalculationRes | null;
  sellOptions: any | null;
  sellerType: PropertySellReq["sellerType"] | null;
  aboutLand: z.infer<typeof aboutLandSchema> | null;
  mapInteraction: {
    hoveredLand: string | null;
  };
  searchDataSaved: boolean;
}>({
  lands: null,
  selectedLand: null,
  calculatedPrice: null,
  sellOptions: null,
  sellerType: null,
  aboutLand: null,
  mapInteraction: { hoveredLand: null },
  searchDataSaved: false,
});
