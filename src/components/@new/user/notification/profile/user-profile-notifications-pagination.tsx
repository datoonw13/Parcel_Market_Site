"use client";

import Pagination from "@/components/@new/shared/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const PAGE_SIZE = 10;

const UserProfileNotificationsPagination = ({ totalCount }: { totalCount: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const page = Number(params.get("page")) || 1;

  const handleChange = useCallback(
    (newValue: number) => {
      params.set("page", (newValue + 1).toString());
      replace(`${pathname}?${params.toString()}`);
    },
    [params, pathname, replace]
  );

  useEffect(() => {
    if (page > Math.ceil(totalCount / PAGE_SIZE)) {
      handleChange(0);
    }
  }, [handleChange, page, totalCount]);

  return Math.ceil(totalCount / PAGE_SIZE) < 2 ? null : (
    <Pagination initialPage={page - 1} rowsPerPage={PAGE_SIZE} totalCount={totalCount} className="mt-12" onChange={handleChange} />
  );
};

export default UserProfileNotificationsPagination;
