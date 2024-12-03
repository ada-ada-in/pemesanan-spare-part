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
    <ReactPaginate
      className="flex items-center justify-center gap-2 fonts-semibold text-white p-2 bg-blue-700"
      breakLabel={"..."}
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={(event) => onPageChange(event.selected)}
      containerClassName={"pagination"}
      activeClassName={"active"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"page-item"}
      previousLinkClassName={"page-link"}
      nextClassName={"page-item"}
      nextLinkClassName={"page-link"}
      breakClassName={"page-item"}
      breakLinkClassName={"page-link"}
    />
  );
}
