import { useState } from "react";
import { Link } from "react-router";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  let navLinksClass = "nav-links";
  if (isOpen) {
    navLinksClass = "nav-links open";
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        BookVerse
      </Link>

      <button 
        className="hamburger-btn" 
        onClick={toggleMenu}
        aria-label="Toggle Navigation Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={navLinksClass}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/Books" onClick={closeMenu}>Explore</Link>
        <Link to="/Saved" onClick={closeMenu}>Saved</Link>
      </div>
    </nav>
  );
}
export default Navbar;