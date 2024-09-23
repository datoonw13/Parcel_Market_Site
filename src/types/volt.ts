import { voltSearchSchema } from "@/zod-validations/volt";
import { z } from "zod";
import { IMap } from "./map";

export type VoltSearchModel = z.infer<typeof voltSearchSchema>;

export enum VoltSteps {
  SEARCH,
  SEARCH_RESULTS,
  CALCULATION,
}

export type VoltSearchResultModel = IMap;
