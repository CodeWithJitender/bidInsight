import React from 'react';

const Pagination = ({ totalResults = 24797, perPage = 25, currentPage, onPageChange }) => {
  console.log(currentPage, totalResults, perPage);

  const totalPages = Math.ceil(totalResults / perPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 9;
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 px-3 pt-8">

      <div className="text-sm">
        <span className="font-inter text-white font-medium text-sm">
          {totalResults === 0 ? 0 : ((currentPage - 1) * perPage + 1)}
          - {Math.min(currentPage * perPage, totalResults)} of {totalResults} results found
        </span>
      </div>

      <div className="flex items-center space-x-1 text-sm font-semibold">
        {/* First Page */}
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="px-2 text-3xl text-white disabled:opacity-30"
        >
          «
        </button>

        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 text-white text-3xl disabled:opacity-30"
        >
          ‹
        </button>

        {/* Numbered Pages */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-2 py-1 text-lg rounded ${page === currentPage
                ? 'text-white font-bold underline'
                : 'text-gray-300 hover:text-white'
              }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 text-3xl text-white disabled:opacity-30"
        >
          ›
        </button>

        {/* Last Page */}
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 text-3xl text-white disabled:opacity-30"
        >
          »
        </button>
      </div>


      <div className="text-sm flex items-center gap-2">
        <span className='font-inter font-medium text-white text-sm'>Result per page:</span>
        <span className="px-2 py-1 rounded bg-btn text-white">{perPage}</span>
      </div>


    </div>
  );
};

export default Pagination;
