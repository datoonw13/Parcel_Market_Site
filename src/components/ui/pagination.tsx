"use client";

import { FC } from "react";
import ReactPaginate from "react-paginate";
import clsx from "clsx";
import { FaChevronLeft } from "react-icons/fa";
import { ChevronRight } from "@mui/icons-material";

interface PaginationProps {
  rowsPerPage: number;
  totalCount: number;
  className?: string;
  initialPage?: number;
  onChange: (page: number) => void;
}
const Pagination: FC<PaginationProps> = ({ rowsPerPage, totalCount, className, initialPage = 0, onChange }) => {
  const handlePageClick = (event: any) => {
    onChange(Number(event.selected));
  };

  return  Math.ceil(totalCount / rowsPerPage) < 2 ? null :  (
    <>
      <ReactPaginate
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        forcePage={initialPage}
        pageCount={Math.ceil(totalCount / rowsPerPage)}
        previousLabel={
          <div className="w-full h-full flex items-center justify-center">
            <FaChevronLeft className="fill-grey-400" />
          </div>
        }
        nextLabel={
          <div className="w-full h-full flex items-center justify-center">
            <ChevronRight className="fill-grey-400" />
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
  );
};

export default Pagination;
