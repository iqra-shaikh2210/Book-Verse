import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/ChatBot.css";

function ChatBot({ savedBooks = [], setSavedBooks = () => {} }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! Tell me what kind of book, mood, or story you're looking for today",
      books: []
    }
  ]);

  // Toggle saving full book object to match Saved.jsx
  const handleToggleSave = (e, book) => {
    e.stopPropagation(); // Prevents opening BookDetails

    const isAlreadySaved = savedBooks.some((b) => b._id === book._id);
    let updated;

    if (isAlreadySaved) {
      updated = savedBooks.filter((b) => b._id !== book._id);
    } else {
      updated = [...savedBooks, book];
    }

    setSavedBooks(updated);
    localStorage.setItem("savedBooks", JSON.stringify(updated));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, books: [] }
    ]);
    setLoading(true);

    try {
      const response = await fetch("https://book-verse-backend-7dpu.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Here are some books you might enjoy:",
          books: data.books || []
        }
      ]);
    } catch (error) {
      console.error("Chatbot Fetch Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops, I had trouble checking the bookshelves. Please try again!",
          books: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <button
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Book Verse Chat Assistant"
      >
        {isOpen ? "✕" : "Ask VerseAi✨"}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-titles">
              <h3>Verse AI✨</h3>
              <span>Your Personal Mood Assistant</span>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble-row ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                  {messages.length === 1 && (
                    <div className="chatbot-quick-chips">
                      <button type="button" onClick={() => setInputMessage("Cozy slow-burn romance")}>
                        Cozy Romance
                      </button>
                      <button type="button" onClick={() => setInputMessage("Dark psychological thriller")}>
                        Dark Thriller
                      </button>
                      <button type="button" onClick={() => setInputMessage("Magical fantasy quest")}>
                        Epic Fantasy
                      </button>
                    </div>
                  )}

                  {msg.books && msg.books.length > 0 && (
                    <div className="chatbot-books-grid">
                      {msg.books.map((book) => {
                        const isSaved = savedBooks.some((b) => b._id === book._id);

                        return (
                          <div
  key={book._id}
  className="chatbot-book-card"
  onClick={() => {
    setIsOpen(false);
    navigate(`/BookDetails/${book._id}`);
  }}
>
  <div className="chatbot-book-cover">
    {book.cover ? (
      <img src={book.cover} alt={book.title} />
    ) : (
      <span>📖</span>
    )}
  </div>

  <div className="chatbot-book-details">
    <h4>{book.title}</h4>
    <p className="chatbot-book-author">{book.author}</p>

    {/* Dedicated Meta Row separating Rating and Save Button */}
    <div className="chatbot-book-meta-row">
      <span className="chatbot-book-rating">★ {book.rating}</span>
      <button
        type="button"
        className={`chatbot-save-btn ${isSaved ? "saved" : ""}`}
        onClick={(e) => handleToggleSave(e, book)}
      >
        {isSaved ? "Saved" : "+ Save"}
      </button>
    </div>
  </div>
</div>
      
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble-row bot">
                <div className="chat-bubble bot loading-bubble">
                  <span>Finding your next read... </span>
                </div>
              </div>
            )}
          </div>

          <form className="chatbot-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="e.g. cozy romance or dark thriller..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;