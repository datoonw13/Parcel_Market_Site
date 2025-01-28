import VoltDetailsLayout from "@/components/volt-details/layout";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import React from "react";
import { z } from "zod";

const INITIAL_FILTERS = {
  radius: 10,
  acreageMin: null,
  acreageMax: null,
  propertyTypes: null,
  soldWithin: 2,
} as z.infer<typeof voltDetailsFiltersValidations>;

const Loading = ({ searchParams }: any) => <VoltDetailsLayout loading initialFilters={INITIAL_FILTERS} searchParams={searchParams} />;

export default Loading;
