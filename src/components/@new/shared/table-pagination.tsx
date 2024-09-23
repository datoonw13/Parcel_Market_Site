"use client";

import { FC } from "react";
import ReactPaginate from "react-paginate";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowIconLeft1, ArrowIconRight1 } from "../icons/ArrowIcons";

interface TablePaginationProps {
  rowsPerPage: number;
  totalCount: number;
  className?: string;
  currentPage?: number;
}
const TablePagination: FC<TablePaginationProps> = ({ rowsPerPage, totalCount, className, currentPage }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const pathname = usePathname();
  const router = useRouter();
  const handlePageClick = (event: any) => {
    params.set("page", (Number(event.selected) + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    Math.ceil(totalCount / rowsPerPage) > 1 && (
      <>
        <ReactPaginate
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          forcePage={currentPage}
          pageCount={Math.ceil(totalCount / rowsPerPage)}
          previousLabel={
            <div className="w-full h-full flex items-center justify-center">
              <ArrowIconLeft1 className="fill-grey-400" />
            </div>
          }
          nextLabel={
            <div className="w-full h-full flex items-center justify-center">
              <ArrowIconRight1 className="fill-grey-400" />
            </div>
          }
          pageClassName="w-8 h-8 border border-grey-200 rounded-[4px] font-medium text-sm [&.active]:bg-primary-main [&.active]:border-primary-main [&.active]:text-white"
          pageLinkClassName="w-full h-full flex items-center justify-center "
          previousClassName="w-8 h-8 border border-grey-200 rounded-[4px] [&.disabled]:bg-grey-100 [&.disabled]:border-grey-100"
          nextClassName="w-8 h-8 border border-grey-200 rounded-[4px] [&.disabled]:bg-grey-100 [&.disabled]:border-grey-100"
          breakLabel="..."
          containerClassName="flex items-center gap-2"
          activeClassName="active"
          className={clsx("flex justify-center gap-2", className)}
          renderOnZeroPageCount={null}
        />
      </>
    )
  );
};

export default TablePagination;
