import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./BookDetails.css";

function BookDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    fetch(`https://book-verse-backend-7dpu.onrender.com/api/books/${id}`)

      .then((response) => {

        if (!response.ok) {
          throw new Error("Book not found");
        }

        return response.json();

      })

      .then((data) => {
        setBook(data);
        setLoading(false);
      })

      .catch((error) => {
        console.log(error);
        setError("Unable to load book details.");
        setLoading(false);
      });

  }, [id]);


  if (loading) {
    return (
      <div className="book-details-page">
        <h2>Loading book details...</h2>
      </div>
    );
  }


  if (error || !book) {
    return (
      <div className="book-details-page">
        <h2>{error || "Book not found"}</h2>

        <button
          className="back-button"
          onClick={() => navigate("/Books")}
        >
          Back to Explore
        </button>
      </div>
    );
  }


  return (

    <div className="book-details-page">

      <div className="book-details-card">

        {/* BOOK COVER */}

 <div 
  className="book-details-image" 
  style={{ 
    width: "280px", 
    height: "420px", 
    backgroundColor: "#F8F1ED", 
    borderRadius: "12px", 
    overflow: "hidden" 
  }}
>
  {book?.cover ? (
    <img
      src={book.cover}
      alt={book.title || "Book Cover"}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        borderRadius: "12px"
      }}
      onError={(e) => {
        e.target.style.display = "none";
        if (e.target.nextElementSibling) {
          e.target.nextElementSibling.style.display = "flex";
        }
      }}
    />
  ) : null}
  <div
    style={{
      display: book?.cover ? "none" : "flex",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3.5rem",
      backgroundColor: "#F8F1ED",
      color: "#633C4F"
    }}
  >
    📖
  </div>
</div>


        {/* BOOK INFORMATION */}

        <div className="book-details-info">

          <p className="book-details-genre">
            {book.genre}
          </p>

          <h1>
            {book.title}
          </h1>

          <p className="book-details-author">
            By {book.author}
          </p>

          <p className="book-details-rating">
            Rating: {book.rating}
          </p>

          <p className="book-details-year">
            Published: {book.year}
          </p>

          <p className="book-details-description">
            {book.description}
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/Books")}
          >
            Back to Explore
          </button>

        </div>

      </div>

    </div>

  );
}

export default BookDetails;