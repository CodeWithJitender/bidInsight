import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faBars,
  faXmark,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "AI Toolset", path: "/ai-toolset" },
  { label: "Bids", path: "/bids" },
  { label: "Plans & Pricing", path: "/pricing" },
  { label: "About Us", path: "/about" },
  { label: "Help Center", path: "/help" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="text-white px-4 py-5">
      <div className="container-fixed flex items-center justify-between space-x-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2  bg-white/10 p-3 lg:p-4 xl:p-6 rounded-2xl lg:rounded-3xl xl:rounded-[30px] backdrop-blur-md"
        >
          <img src="icon.png" className="w-5 h-5" />
          <span className="text-lg font-semibold font-h">BidInsight</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-4 xl:gap-10 bg-white/10 p-3 lg:p-4 xl:p-6 rounded-2xl lg:rounded-3xl xl:rounded-[30px] backdrop-blur-xl">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="hover:text-blue-300 transition font-h text-base xl:text-lg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-white/10 p-3 lg:p-4 xl:p-6 rounded-2xl lg:rounded-3xl xl:rounded-[30px] backdrop-blur-md hover:bg-white/20">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <Link
            to="/login"
            className="flex items-center space-x-2 bg-white/10 p-3 lg:p-4 xl:p-6 rounded-2xl lg:rounded-3xl xl:rounded-[30px] backdrop-blur-md hover:bg-white/20 font-semibold"
          >
            <FontAwesomeIcon icon={faUser} />
            <span className="font-h text-base xl:text-lg">Register / Login</span>
          </Link>
        </div>

        {/* Hamburger (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-3 p-4 text-sm font-medium">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-blue-300 transition"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex justify-between items-center pt-3 border-t border-white/20">
              <button className="p-2 rounded-full hover:bg-white/20 transition">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Register / Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
