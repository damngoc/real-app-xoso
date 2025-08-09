import React from "react";

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex items-center space-x-2">
    <button
      className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
      onClick={onPrev}
      disabled={currentPage === 1}
    >
      Trước
    </button>
    <span className="px-3 py-1 text-sm text-white bg-purple-600 rounded">
      {currentPage}
    </span>
    <button
      className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
      onClick={onNext}
      disabled={currentPage === totalPages}
    >
      Sau
    </button>
  </div>
);

export default Pagination;
