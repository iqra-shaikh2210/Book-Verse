const Book = require("../models/Book");

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);

    res.status(500).json({
      message: "Failed to fetch books"
    });
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);

    res.status(500).json({
      message: "Failed to fetch book"
    });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { search } = req.query;

    const books = await Book.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } }
      ]
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching books:", error);

    res.status(500).json({
      message: "Failed to search books"
    });
  }
};

// Get books by genre
const getBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const books = await Book.find({
      genre: { $regex: `^${genre}$`, $options: "i" }
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books by genre:", error);

    res.status(500).json({
      message: "Failed to fetch books by genre"
    });
  }
};

module.exports = {
  getBooks,
  getBookById,
  searchBooks,
  getBooksByGenre
};