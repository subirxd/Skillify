import React, { useState, useEffect } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../../assets/Logo/logo-white.png";
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../Services/apiConnector";
import { categories } from "../../Services/apis";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(result.data.allCategory);
      } catch (error) {
        console.log("Could not fetch the category list");
      }
    };
    fetchCategories();
  }, []);

  // --- REFACTORED matchRoute FUNCTION ---
  const matchRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <header className="top-0 z-50 w-full bg-richblack-900 shadow-sm transition-all duration-300">
      <div className="w-11/12 max-w-7xl mx-auto flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy" alt="Logo" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex">
          <ul className="flex gap-x-6 text-pure-greys-25 font-medium">
            {NavbarLinks.map((link, index) => (
              <li key={index} className="relative group">
                {link.title === "Catalog" ? (
                  <div className="flex items-center gap-x-1 cursor-pointer transition-all duration-200 hover:text-yellow-25">
                    <p>{link.title}</p>
                    <BsChevronDown className="mt-0.5 text-xs transition-transform duration-200 group-hover:rotate-180" />

                    {/* Dropdown */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[220px] rounded-lg bg-richblack-800 p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 bg-richblack-800"></div>
                      {subLinks.length ? (
                        subLinks.map((subLink, idx) => (
                          <Link
                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                            key={idx}
                            className="block px-3 py-2 rounded-md text-pure-greys-25 hover:bg-richblack-700 hover:text-yellow-25 transition-all duration-200"
                          >
                            {subLink.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-pure-greys-200">Loading...</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`hover:text-yellow-25 transition-all duration-200 ${
                      matchRoute(link?.path) ? "text-yellow-50" : "text-richblack-25"
                    }`}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-x-4">
          {/* Cart */}
          {user && user.accountType !== "instructor" && (
            <Link to="/dashboard/cart" className="relative transition-all duration-200 hover:scale-110">
              <AiOutlineShoppingCart className="text-2xl text-pure-greys-25" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full bg-pink-200 text-black text-xs font-bold grid place-items-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Auth Buttons */}
          {!token && (
            <div className="hidden md:flex gap-x-4">
              <Link to="/login">
                <button className="px-4 py-2 rounded-md bg-richblack-800 text-richblack-25 border border-richblack-700 hover:bg-richblack-700 hover:border-richblack-600 transition-all duration-200">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 rounded-md bg-yellow-25 text-richblack-900 font-semibold border border-yellow-25 hover:bg-yellow-50 transition-all duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {token && <ProfileDropDown />}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-pure-greys-25 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-16 left-0 w-full bg-richblack-800 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2 text-pure-greys-25 font-medium">
          {NavbarLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path || "#"}
              className={`block px-3 py-2 rounded-md hover:bg-richblack-700 transition-all duration-200 ${
                matchRoute(link?.path) ? "text-yellow-50" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          {!token && (
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/login">
                <button className="w-full text-left px-3 py-2 rounded-md bg-richblack-700 hover:bg-richblack-600 transition-all duration-200">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full text-left px-3 py-2 rounded-md bg-yellow-25 text-richblack-900 font-semibold hover:bg-yellow-50 transition-all duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;