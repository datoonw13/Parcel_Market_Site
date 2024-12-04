"use client";

import Pagination from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TransitionStartFunction, useTransition } from "react";

const SearchesPagination = ({
  rowsPerPage,
  totalCount,
  startTransition,
}: {
  rowsPerPage: number;
  totalCount: number;
  startTransition: TransitionStartFunction;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <Pagination
      initialPage={Number(params.get("page")) ? Number(params.get("page")) - 1 : 0}
      onChange={(page) => {
        startTransition(() => {
          params.set("page", (page + 1).toString());
          params.delete("viewId");
          router.push(`${pathname}?${params.toString()}`);
        });
      }}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
    />
  );
};
export default SearchesPagination;
