import "./saved.css";

function Saved({ savedBooks, setSavedBooks }) {

  const removeBook = (id) => {
    const updatedBooks = savedBooks.filter(
      (book) => book._id !== id
    );

    setSavedBooks(updatedBooks);
  };

  return (
    <div className="saved-page">

      <div className="saved-header">
        <p>YOUR PERSONAL COLLECTION</p>
        <h1>Saved Books</h1>
        <span>Books you've saved for later.</span>
      </div>

      {savedBooks.length === 0 ? (

        <div className="no-saved-books">
          <h2>No saved books yet</h2>
          <p>
            Go to Explore and save books you want to read.
          </p>
        </div>

      ) : (

        <div className="saved-books-list">

          {savedBooks.map((book) => (

            <div
              className="saved-book-card"
              key={book._id}
            >

              <div className="saved-book-cover">

                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                  />
                ) : (
                  <span>📖</span>
                )}

              </div>

              <div className="saved-book-info">

                <p className="saved-book-genre">
                  {book.genre}
                </p>

                <h2>{book.title}</h2>

                <p>{book.author}</p>

              </div>

              <button
                className="remove-button"
                onClick={() => removeBook(book._id)}
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Saved;