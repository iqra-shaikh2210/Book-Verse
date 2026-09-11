import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected genre
  const [selectedGenre, setSelectedGenre] = useState("Romance");

  const genres = [
    { name: "Romance"},
    { name: "Mystery"},
    { name: "Fantasy"},
    { name: "Thriller" },
    { name: "Fiction"},
  ];

  // Get books from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  // Get top 3 books for selected genre
  const topBooks = books
    .filter((book) => book.genre === selectedGenre)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="intro-section">

        <p className="small-heading">
          YOUR NEXT STORY AWAITS ✨
        </p>

        <h1>
          Find your next
          <br />
          favourite book.
        </h1>
        <p className="intro-text">
          Discover books based on your interests,
          mood and reading style.
        </p>
        <button
          className="ai-button"
          onClick={() => navigate("/Books")}
        >
          ✨ Find My Next Book
        </button>

      </section>


      {/* GENRE SECTION */}
      <section className="genres">

        <h2>Explore by Genre 🌷</h2>

        <div className="genre-container">

          {genres.map((genre) => (
            <button
              className={`genre-card ${
                selectedGenre === genre.name ? "active" : ""
              }`}
              key={genre.name}
              onClick={() => setSelectedGenre(genre.name)}
            >
              {genre.icon} {genre.name}
            </button>
          ))}

        </div>

      </section>


      {/* TOP BOOKS SECTION */}
      <section className="popular">

        <div className="genre-title-row">

          <h2>
            {genres.find(
              (genre) => genre.name === selectedGenre
            )?.icon}{" "}
            Top {selectedGenre} Reads
          </h2>

          <button
            className="view-all-button"
            onClick={() => navigate("/Books")}
          >
            View All
          </button>

        </div>


        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="book-container">

            {topBooks.map((book) => (

              <div
                className="book-card"
                key={book._id}
                onClick={() =>
                  navigate(`/BookDetails/${book._id}`)
                }
              >

                <div className="book-cover">

                  <img
                    src={book.cover}
                    alt={book.title}
                  />

                </div>

                <h3>{book.title}</h3>

                <p>
                  ⭐ {book.rating}
                </p>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Home;