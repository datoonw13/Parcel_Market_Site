"use client";

import Pagination from "@/components/@new/shared/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const ReceivedOffersPagination = ({ totalCount, page, pageSize }: { totalCount: number; page: number; pageSize: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

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

  return <Pagination initialPage={page - 1} rowsPerPage={pageSize} totalCount={totalCount} className="mt-12" onChange={handleChange} />;
};

export default ReceivedOffersPagination;
