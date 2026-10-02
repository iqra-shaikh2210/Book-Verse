require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");
const booksData = require("./data/books.json");

// Connect directly to your MongoDB database
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookverse");

// Function to empty old books and insert the new books
const seedDatabase = async () => {
  // Step 1: Wipe all old records
  await Book.deleteMany({});
  console.log("Old books deleted from MongoDB");

  // Step 2: Insert your updated JSON file
  await Book.insertMany(booksData);
  console.log(`${booksData.length} books inserted successfully!`);

  // Step 3: Close the script automatically
  process.exit();
};

// Run the function
seedDatabase();