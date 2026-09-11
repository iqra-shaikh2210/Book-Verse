const mongoose = require("mongoose");
const Book = require("./models/Book");
const books = require("./data/books.json");

const seedBooks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/bookverse");

    console.log("MongoDB connected successfully");

    // Remove old books
    await Book.deleteMany({});

    console.log("Old books deleted");

    // Insert all books from books.json
    await Book.insertMany(books);

    console.log(`${books.length} books inserted successfully`);

    // Close connection
    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error inserting books:", error);
    process.exit(1);
  }
};

seedBooks();