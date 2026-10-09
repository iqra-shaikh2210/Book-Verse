import { Routes, Route, BrowserRouter } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ChatBot from "./components/chatbot";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Home from "./pages/Home";
import Saved from "./pages/Saved";

function App() {
  // 1. Read existing saved books from localStorage on initial load
  const [savedBooks, setSavedBooks] = useState(() => {
    try {
      const storedBooks = localStorage.getItem("bookverse_saved");
      return storedBooks ? JSON.parse(storedBooks) : [];
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return [];
    }
  });

  // 2. Sync savedBooks to localStorage whenever the array changes
  useEffect(() => {
    try {
      localStorage.setItem("bookverse_saved", JSON.stringify(savedBooks));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [savedBooks]);

  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Books"
            element={
              <Books
                savedBooks={savedBooks}
                setSavedBooks={setSavedBooks}
              />
            }
          />
          <Route path="/BookDetails/:id" element={<BookDetails />} />
          <Route
            path="/Saved"
            element={
              <Saved
                savedBooks={savedBooks}
                setSavedBooks={setSavedBooks}
              />
            }
          />
        </Routes>
        <ChatBot savedBooks={savedBooks} setSavedBooks={setSavedBooks} />
      </div>
    </BrowserRouter>
  );
}

export default App;