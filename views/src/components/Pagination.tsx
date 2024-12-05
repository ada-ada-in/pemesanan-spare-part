import React from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: {
  totalItems: any;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
}) {
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="pagination-container">
      <ReactPaginate
        breakLabel={"..."}
        pageCount={pageCount}
        forcePage={currentPage - 1}
        onPageChange={(event) => onPageChange(event.selected + 1)}
        containerClassName="flex items-center justify-center gap-2 fonts-semibold text-white p-2 bg-blue-700"
        activeClassName="bg-white text-blue-700 font-bold rounded"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
      />
    </div>
  );
}
