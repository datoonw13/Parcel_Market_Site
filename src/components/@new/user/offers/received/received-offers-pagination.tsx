"use client";

import Pagination from "@/components/@new/shared/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const ReceivedOfferPagination = ({ totalCount, pageSize }: { totalCount: number; pageSize: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const page = Number(params.get("page")) || 1;

  const handleChange = useCallback(
    (newValue: number) => {
      params.set("page", (newValue + 1).toString());
      replace(`${pathname}?${params.toString()}`);
    },
    [params, pathname, replace]
  );

  useEffect(() => {
    if (page > Math.ceil(totalCount / pageSize)) {
      handleChange(0);
    }
  }, [handleChange, page, pageSize, totalCount]);

  return Math.ceil(totalCount / pageSize) < 2 ? null : (
    <Pagination initialPage={page - 1} rowsPerPage={pageSize} totalCount={totalCount} className="mt-12" onChange={handleChange} />
  );
};

export default ReceivedOfferPagination;
