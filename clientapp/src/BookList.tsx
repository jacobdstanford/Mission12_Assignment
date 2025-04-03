import React, { useEffect, useState } from 'react';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}



interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}



const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
  });



  // Fetch data from the API
  const fetchBooks = async (page: number, size: number, order: string) => {
    setLoading(true);

    try {
        const response = await fetch(
            `http://localhost:5260/api/books?pageNumber=${page}&pageSize=${size}&sortOrder=${order}`
          );
          
      const data = await response.json();
      setBooks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching books:', error);
    }

    setLoading(false);
  };




  useEffect(() => {
    fetchBooks(currentPage, pageSize, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortOrder]);




  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };




  // Handle page size changes
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };




  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (




    <div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-secondary" onClick={toggleSortOrder}>
          Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>

        <div>
          <label htmlFor="pageSizeSelect" className="me-2">
            Results per page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>




      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookId}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>${b.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>




      <div className="d-flex justify-content-center align-items-center my-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>

        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>



        <button
          className="btn btn-outline-primary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
