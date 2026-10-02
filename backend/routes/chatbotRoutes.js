const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// 1. Comprehensive dictionary linking raw human feelings directly to genres
const emotionDictionary = {
  sad: {
    words: ["sad", "depressed", "heartbroken", "crying", "unhappy", "lonely", "hurt", "grief", "gloomy"],
    genres: ["Romance", "Fiction"],
    reply: "Sending you a warm virtual hug. Here are gentle, touching stories to comfort your heart:"
  },
  stressed: {
    words: ["stressed", "anxious", "overwhelmed", "exhausted", "tired", "busy", "relax", "calm", "cozy"],
    genres: ["Romance", "Fantasy"],
    reply: "Take a deep breath and relax. Here are cozy, peaceful books to help you escape the noise:"
  },
  thrilled: {
    words: ["bored", "thrill", "edge", "scary", "mystery", "murder", "detective", "crime", "dark", "intense"],
    genres: ["Thriller", "Mystery"],
    reply: "Ready for an adrenaline rush? These gripping page-turners will keep you hooked until late night:"
  },
  escapist: {
    words: ["adventure", "magic", "magical", "dreamy", "escape", "dragons", "kingdom", "witch", "wizard"],
    genres: ["Fantasy"],
    reply: "Let us transport you to another world. Here are enchanting worlds to dive into:"
  },
  happy: {
    words: ["happy", "romantic", "love", "cheerful", "fun", "cute", "sweet", "dating", "couple", "feel-good"],
    genres: ["Romance", "Fiction"],
    reply: "Love this radiant energy! Here are heartwarming stories full of warmth and charm:"
  }
};

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        reply: "Tell me how you are feeling or what vibe you are looking for today!",
        books: []
      });
    }

    const lowerMessage = message.toLowerCase();

    // 2. Scan the user message for emotional triggers
    let detectedEmotionKey = null;
    let targetGenres = [];
    let customReply = "Here are top handpicked books matching your current vibe:";

    for (const [key, data] of Object.entries(emotionDictionary)) {
      const matchFound = data.words.some((word) => lowerMessage.includes(word));
      if (matchFound) {
        detectedEmotionKey = key;
        targetGenres = data.genres;
        customReply = data.reply;
        break; // Match the primary emotion found
      }
    }

    // Default to a balanced mix across top genres if no specific emotion keyword matches
    if (targetGenres.length === 0) {
      targetGenres = ["Romance", "Mystery", "Fantasy", "Thriller", "Fiction"];
    }

    // 3. Query candidate books from MongoDB matching the target genres
    const candidateBooks = await Book.find({
      genre: { $in: targetGenres }
    });

    // 4. Calculate an emotional relevance score for every book
    const scoredBooks = candidateBooks.map((book) => {
      let score = 0;

      // Genre alignment: 40 points
      if (targetGenres.includes(book.genre)) {
        score += 40;
      }

      // Description text relevance: up to 30 points
      const bookDesc = (book.description || "").toLowerCase();
      const userWords = lowerMessage.split(/\s+/);
      let wordHits = 0;

      userWords.forEach((word) => {
        if (word.length > 3 && bookDesc.includes(word)) {
          wordHits += 1;
        }
      });
      score += Math.min(wordHits * 10, 30);

      // Star rating weight: up to 20 points
      const rating = Number(book.rating) || 0;
      score += (rating / 5) * 20;

      // Modern publication factor: 10 points
      const year = Number(book.year) || 0;
      if (year >= 2015) {
        score += 10;
      }

      return {
        book,
        score
      };
    });

    // 5. Sort highest score first and pick the top 4 recommendations
    scoredBooks.sort((a, b) => b.score - a.score);
    const topPicks = scoredBooks.slice(0, 4).map((item) => item.book);

    return res.status(200).json({
      reply: customReply,
      books: topPicks
    });
  } catch (error) {
    console.error("Emotion Chatbot Error:", error);
    return res.status(500).json({
      reply: "Oops, my book radar ran into an issue. Please try again!",
      books: []
    });
  }
});

module.exports = router;