import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faBars,
  faXmark,
  faChartBar,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
// ✅ ADD THESE IMPORTS AT TOP
import { useDispatch } from 'react-redux';
import { clearProfile } from '../redux/reducer/profileSlice'; // Update path as needed
import { persistor } from '../redux/store'; // Update path as needed

const navItems = [
  { label: "Home", path: "/" },
  { label: "A.I. Toolset", path: "/ai-toolset" },
  { label: "Bids", path: "/dashboard" },
  { label: "Plans & Pricing", path: "/pricing" },
  { label: "About Us", path: "/about" },
  // { label: "Help Center", path: "/help" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if user is authenticated
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  // Scroll detection for background change and navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Background detection - if scrolled past certain point, consider it white background
      setScrolled(currentScrollY > 100);

      // Navbar hide/show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up or at top - show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle logout functionality
  const handleLogout = useCallback(async () => {
    try {
      // 1. Clear localStorage & sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // 2. Clear Redux profile state
      dispatch(clearProfile());

      // 3. Purge persist store (MOST IMPORTANT)
      await persistor.purge();
      await persistor.flush();

      // 4. Navigate to login page
      navigate('/login');

      console.log('✅ Complete logout - All data cleared');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Fallback navigation
      window.location.href = '/login';
    }
  }, [navigate, dispatch]);

  // Close mobile menu when route changes
  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Dynamic navbar styling based on scroll position
  const getNavbarClasses = () => {
    let baseClasses = "fixed top-0 left-0 right-0 z-50 text-white px-4 py-4 transition-all duration-500 ease-out transform";

    if (scrolled) {
      // On white background - use professional gradient with better shadow
      baseClasses += " bg-gradient-to-r from-slate-900/98 via-slate-800/98 to-slate-900/98 backdrop-blur-xl shadow-2xl";
    } else {
      // On colored background - use transparent with subtle glow
      baseClasses += " bg-transparent";
    }

    if (isVisible) {
      baseClasses += " translate-y-0 opacity-100";
    } else {
      baseClasses += " -translate-y-full opacity-80";
    }

    return baseClasses;
  };

  // Dynamic content styling
  const getContentClasses = (isLogo = false) => {
    let baseClasses = "transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98]";

    if (scrolled) {
      if (isLogo) {
        baseClasses += " bg-gradient-to-r from-slate-700/60 to-slate-600/60 backdrop-blur-xl border border-white/5 shadow-lg";
      } else {
        baseClasses += " bg-gradient-to-r from-slate-700/40 to-slate-600/40 backdrop-blur-xl border border-white/5 shadow-md";
      }
    } else {
      baseClasses += " bg-white/10 backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/15";
    }

    return baseClasses;
  };

  return (
    <>
      {/* Spacer to prevent content jump when navbar becomes fixed */}
      <div className="h-20" />

      <nav className={getNavbarClasses()}>
        <div className="container-fixed flex items-center justify-between space-x-3">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center space-x-2 p-3 lg:p-4 xl:p-5 rounded-2xl lg:rounded-3xl xl:rounded-[30px] group ${getContentClasses(true)}`}
          >
            <img
              src="/icon.png"
              alt="BidInsight Logo"
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
            />
            <span className="text-lg font-semibold font-h bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              BidInsight
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className={`hidden md:flex items-center gap-3 xl:gap-6 p-3 lg:p-4 xl:p-5 rounded-2xl lg:rounded-3xl xl:rounded-[30px] ${getContentClasses()}`}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="relative transition-all duration-300 font-h text-base xl:text-lg group px-2 py-1 rounded-lg"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/user-profile"
                className={`flex items-center space-x-2 p-3 lg:p-4 xl:p-5 rounded-2xl lg:rounded-3xl xl:rounded-[30px] hover:bg-white/20 font-semibold group relative overflow-hidden ${getContentClasses()}`}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                {/* <span className="font-h text-base xl:text-lg">Profile</span> */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-2 p-3 lg:p-4 xl:p-6 rounded-2xl lg:rounded-3xl xl:rounded-[30px] hover:bg-white/20 font-semibold group relative overflow-hidden ${getContentClasses()}`}
              >
                <span className="font-h text-base xl:text-lg relative z-10">
                  Register / Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <FontAwesomeIcon
                icon={menuOpen ? faXmark : faBars}
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden mt-3 space-y-3 p-4 text-sm font-medium animate-in slide-in-from-top-5 duration-300">
            <div className={`rounded-xl p-6 space-y-2 ${getContentClasses()}`}>
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className="block transition-all p-2 rounded-lg animate-in slide-in-from-left-3 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 pt-3 border-t border-white/20 animate-in slide-in-from-bottom-3 duration-300" style={{ animationDelay: '300ms' }}>
                <button
                  className="p-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 self-start"
                  aria-label="Search"
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>

                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/dashboard?page=1&pageSize=25&bid_type=Active&ordering=closing_date"
                      onClick={handleNavClick}
                      className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                    >
                      <FontAwesomeIcon
                        icon={faChartBar}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/user-profile"
                      onClick={handleNavClick}
                      className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        handleNavClick();
                      }}
                      className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/30 transition-all duration-300 hover:scale-105 group"
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={handleNavClick}
                    className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <span>Register / Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;