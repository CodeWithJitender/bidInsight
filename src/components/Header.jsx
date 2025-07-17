import React, { useEffect } from 'react'
import Navbar from './Navbar'
import  $  from "jquery"

function Header() {
   useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const header = document.getElementById("header");
      if (!header) return;

      const st = window.pageYOffset || document.documentElement.scrollTop;
      header.style.transform =
        st > lastScrollTop && st > 50 ? "translateY(-100%)" : "translateY(0)";
      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className='fixed top-0 w-full' id='header'>
     <Navbar/>
    </header>
  )
}

export default Header
