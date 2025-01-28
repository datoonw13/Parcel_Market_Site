"use client";

import { FC, useTransition } from "react";
import { z } from "zod";
import { voltDetailsFiltersValidations } from "@/zod-validations/filters-validations";
import VoltDetails from "./details";
import VoltDetailsHeaderLogo from "./logo";
import VoltDetailsHeader from "./header";

interface VoltDetailsLayoutProps {
  searchParams: { [key: string]: string };
  initialFilters: z.infer<typeof voltDetailsFiltersValidations>;
  loading?: boolean;
}

const VoltDetailsLayout: FC<VoltDetailsLayoutProps> = ({ initialFilters, searchParams, loading }) => {
  const [isFetching, startFetchingTransition] = useTransition();

  return (
    <div className="h-screen flex flex-col">
      <VoltDetailsHeaderLogo />
      <VoltDetailsHeader initialFilters={initialFilters} searchParams={searchParams} startFetchingTransition={startFetchingTransition} />
      <div className="w-full h-full overflow-hidden">
        <VoltDetails loading={loading || isFetching} />;
      </div>
    </div>
  );
};

export default VoltDetailsLayout;
