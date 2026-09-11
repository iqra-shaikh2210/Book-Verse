const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    genre: {
      type: String,
      required: true,
      enum: ["Romance", "Mystery", "Fantasy", "Thriller", "Fiction"]
    },

    description: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },

    year: {
      type: Number,
      required: true
    },

    cover: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;