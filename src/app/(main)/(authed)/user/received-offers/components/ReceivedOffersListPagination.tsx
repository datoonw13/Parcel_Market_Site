"use client";

import Pagination from "@/components/@new/shared/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ReceivedOffersListPagination = ({ totalCount, page, pageSize }: { totalCount: number; page: number; pageSize: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const handleChange = (newValue: number) => {
    params.set('page', (newValue + 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return <Pagination initialPage={page - 1} rowsPerPage={pageSize} totalCount={totalCount} className="mt-12" onChange={handleChange} />;
};

export default ReceivedOffersListPagination;
