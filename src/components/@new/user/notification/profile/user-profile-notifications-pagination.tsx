"use client";

import Pagination from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const UserProfileNotificationsPagination = ({ pageSize, totalCount }: { pageSize: number; totalCount: number }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <Pagination
      className="py-6"
      initialPage={Number(params.get("page")) ? Number(params.get("page")) - 1 : 0}
      onChange={(page) => {
        params.set("page", (page + 1).toString());
        router.push(`${pathname}?${params.toString()}`);
      }}
      rowsPerPage={pageSize}
      totalCount={totalCount}
    />
  );
};
export default UserProfileNotificationsPagination;
