import { useState } from "react";
import { useNavigate } from "react-router";
import "../styles/ChatBot.css";

function ChatBot() {
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
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    // 1. Append user message to message feed
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, books: [] }
    ]);
    setLoading(true);

    try {
      // 2. Send request to backend chat route
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();

      // 3. Append bot reply and matched books
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
      {/* Floating Trigger Button */}
      <button
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Book Verse Chat Assistant"
      >
        {isOpen ? "✕" : "Ask VerseAi✨"}
      </button>

      {/* Floating macOS Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-titles">
              <h3>Verse AI✨</h3>
              <span>Your Personal Mood Assistant</span>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble-row ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                  {/* Quick Starter Suggestion Chips */}{messages.length === 1 && (
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

                  {/* Render Book Cards inside Bot Response */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="chatbot-books-grid">
                      {msg.books.map((book) => (
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
                            <span className="chatbot-book-rating">★ {book.rating}</span>
                          </div>
                        </div>
                      ))}
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

          {/* Input Form */}
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