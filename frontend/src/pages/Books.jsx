import { useState, useEffect } from "react";
import "./Books.css";
import { useNavigate } from "react-router";

function Books({ savedBooks, setSavedBooks }) {

  // Stores the selected genre
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Stores the text entered in the search box
  const [searchText, setSearchText] = useState("");

  // Stores all books received from MongoDB
  const [books, setBooks] = useState([]);

  // Shows loading message while books are being fetched
  const [loading, setLoading] = useState(true);

  // Stores the current page number
  const [currentPage, setCurrentPage] = useState(1);

  // Number of books we want to show on one page
  const booksPerPage = 15;

  // Used to navigate to Book Details
  const navigate = useNavigate();


  // ==========================================
  // GET BOOKS FROM BACKEND
  // ==========================================

  useEffect(() => {

    fetch("http://localhost:5000/api/books")

      .then((response) => response.json())

      .then((data) => {

        console.log(data);

        setBooks(data);

        setLoading(false);

      })

      .catch((error) => {

        console.log("Error fetching books:", error);

        setLoading(false);

      });

  }, []);


  // ==========================================
  // SEARCH + GENRE FILTER
  // ==========================================

  const filteredBooks = books.filter((book) => {

    const matchesSearch =
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.author.toLowerCase().includes(searchText.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" ||
      book.genre.toLowerCase() === selectedGenre.toLowerCase();

    return matchesSearch && matchesGenre;

  });


  // ==========================================
  // PAGINATION
  // ==========================================

  // Calculate total number of pages
  const totalPages = Math.ceil(
    filteredBooks.length / booksPerPage
  );


  // Find the starting position of the current page
  const startIndex =
    (currentPage - 1) * booksPerPage;


  // Get only 15 books for the current page
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  );


  // ==========================================
  // RESET FILTERS
  // ==========================================

  const clearFilters = () => {

    setSelectedGenre("All");

    setSearchText("");

    // Go back to page 1
    setCurrentPage(1);

  };


  // ==========================================
  // SAVE BOOK
  // ==========================================

  const saveBook = (book) => {

    const alreadySaved = savedBooks.some(
      (savedBook) => savedBook._id === book._id
    );

    if (!alreadySaved) {

      setSavedBooks([...savedBooks, book]);

    }

  };


  // ==========================================
  // CHANGE GENRE
  // ==========================================

  const changeGenre = (genre) => {

    setSelectedGenre(genre);

    // Whenever genre changes,
    // start from page 1
    setCurrentPage(1);

  };


  // ==========================================
  // SEARCH CHANGE
  // ==========================================

  const handleSearch = (event) => {

    setSearchText(event.target.value);

    // Whenever search changes,
    // start from page 1
    setCurrentPage(1);

  };


  return (

    <div className="books-page">


      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="books-header">

        <p>BOOK VERSE COLLECTION</p>

        <h1>Explore Books</h1>

        <span>
          Find a story that feels like it was written for you.
        </span>

      </div>


      {/* ======================================
          SEARCH BOX
      ====================================== */}

      <div className="books-search">

        <input
          type="text"
          placeholder="Search by book title or author..."
          value={searchText}
          onChange={handleSearch}
        />

      </div>


      {/* ======================================
          GENRE FILTERS
      ====================================== */}

      <div className="genre-filters">

        <button
          onClick={() => changeGenre("All")}
        >
          All
        </button>

        <button
          onClick={() => changeGenre("Romance")}
        >
          Romance
        </button>

        <button
          onClick={() => changeGenre("Mystery")}
        >
          Mystery
        </button>

        <button
          onClick={() => changeGenre("Fantasy")}
        >
          Fantasy
        </button>

        <button
          onClick={() => changeGenre("Thriller")}
        >
          Thriller
        </button>

        <button
          onClick={() => changeGenre("Fiction")}
        >
          Fiction
        </button>

      </div>


      {/* ======================================
          BOOK COUNT + RESET
      ====================================== */}

      <div className="books-status">

        <p>
          Showing {currentBooks.length} of {filteredBooks.length} books
        </p>

        <button onClick={clearFilters}>
          Reset
        </button>

      </div>


      {/* ======================================
          BOOK GRID
      ====================================== */}

      <div className="books-grid">

        {loading ? (

          <div className="no-books">

            <h2>Loading books...</h2>

          </div>

        ) : currentBooks.length > 0 ? (

          currentBooks.map((book) => (

            <div
              className="book-card"
              key={book._id}
            >


              {/* BOOK IMAGE */}

              <div className="book-image">
                {/* BOOK IMAGE */}

<div className="book-image">
  {book.cover ? (
    <img
      src={book.cover}
      alt={book.title}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/400x600/e8ddd2/5c4033.png?text=${encodeURIComponent(book.title)}`;
      }}
    />
  ) : (
  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>📖</span>

  )}
</div>

              </div>


              {/* BOOK INFORMATION */}

              <div className="book-info">


                {/* GENRE */}

                <p className="book-genre">
                  {book.genre}
                </p>


                {/* TITLE */}

                <h2>
                  {book.title}
                </h2>


                {/* AUTHOR */}

                <p className="book-author">
                  {book.author}
                </p>


                {/* BOTTOM SECTION */}

                <div className="book-bottom">


                  {/* RATING */}

                  <span>
                    ★ {book.rating}
                  </span>


                  {/* VIEW DETAILS */}

                  <button
                    onClick={() =>
                      navigate(`/BookDetails/${book._id}`)
                    }
                  >
                    View Details
                  </button>


                  {/* SAVE BOOK */}

                  <button
                    onClick={() => saveBook(book)}
                  >
                    {
                      savedBooks.some(
                        (savedBook) =>
                          savedBook._id === book._id
                      )
                        ? "Saved"
                        : "Save"
                    }
                  </button>


                </div>

              </div>

            </div>

          ))

        ) : (

          /* ==================================
             NO BOOKS FOUND
             ================================== */

          <div className="no-books">

            <h2>No books found</h2>

            <p>
              Try another title, author or genre.
            </p>

            <button onClick={clearFilters}>
              Show All Books
            </button>

          </div>

        )}

      </div>


      {/* ======================================
          PAGINATION
      ====================================== */}

      {!loading && totalPages > 1 && (

        <div className="pagination">


          {/* PREVIOUS BUTTON */}

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            ← Previous
          </button>


          {/* PAGE NUMBERS */}

          <div className="page-numbers">

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (

              <button
                key={pageNumber}
                className={
                  currentPage === pageNumber
                    ? "active-page"
                    : ""
                }
                onClick={() =>
                  setCurrentPage(pageNumber)
                }
              >
                {pageNumber}
              </button>

            ))}

          </div>


          {/* NEXT BUTTON */}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next →
          </button>


        </div>

      )}

    </div>

  );

}

export default Books;