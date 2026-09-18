import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, ChevronDown } from "lucide-react";
import { useCurrency } from "../../hooks/useCurrency";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, changeCurrency, getSymbol } = useCurrency();

  // Get WhatsApp number from env
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your courses. Can you help me?")}`;

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Add glass shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
    setCurrencyOpen(false);
  }, [location]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Handle currency change - Refresh page
  const handleCurrencyChange = (newCurrency) => {
    changeCurrency(newCurrency);
    setCurrencyOpen(false);
    closeMenu();
    window.location.reload();
  };

  // Handle cross-page and same-page section scrolling
  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    closeMenu();

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 72;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    }, 100);
  };

  // Scroll to section when navigating from another page
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        
        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-box">CG</span>
          <span className="logo-text">
            Courses<span className="logo-accent">Guy</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink 
            to="/courses" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Courses
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            About
          </NavLink>
        </nav>

        {/* Currency Dropdown - Always visible on desktop */}
        <div className="currency-dropdown">
          <button 
            className="currency-toggle"
            onClick={() => setCurrencyOpen(!currencyOpen)}
          >
            <span>{getSymbol()} {currency}</span>
            <ChevronDown size={14} className={currencyOpen ? 'rotate' : ''} />
          </button>
          
          {currencyOpen && (
            <div className="currency-menu">
              <button 
                className={`currency-option ${currency === 'USD' ? 'active' : ''}`}
                onClick={() => handleCurrencyChange('USD')}
              >
                <span className="currency-flag">🌐</span>
                <span className="currency-symbol">$</span>
                <span>USD - Dollar</span>
              </button>
              <button 
                className={`currency-option ${currency === 'INR' ? 'active' : ''}`}
                onClick={() => handleCurrencyChange('INR')}
              >
                <span className="currency-flag">🇮🇳</span>
                <span className="currency-symbol">₹</span>
                <span>INR - Rupee</span>
              </button>
              <button 
                className={`currency-option ${currency === 'PKR' ? 'active' : ''}`}
                onClick={() => handleCurrencyChange('PKR')}
              >
                <span className="currency-flag">🇵🇰</span>
                <span className="currency-symbol">₨</span>
                <span>PKR - Rupee</span>
              </button>
            </div>
          )}
        </div>

        {/* Desktop WhatsApp CTA */}
        <a
          href={WHATSAPP_LINK}
          className="navbar-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>

        {/* Animated Mobile Hamburger Button */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink 
            to="/courses" 
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            Courses
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => `mobile-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            About
          </NavLink>

          <a
            href={WHATSAPP_LINK}
            className="mobile-link mobile-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            <MessageCircle size={20} />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;