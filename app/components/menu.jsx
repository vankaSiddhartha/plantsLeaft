"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-green-800 p-4 shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
      
          <span className="text-white text-2xl font-bold">FarmerAi</span>

        {/* Navigation Links */}
        <ul className="flex space-x-8">
          <li>
            <Link
              href="/"
              className="text-white text-lg font-medium px-4 py-2 rounded-md transition-transform duration-300 ease-in-out transform hover:bg-orange-500 hover:scale-110"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/post"
              className="text-white text-lg font-medium px-4 py-2 rounded-md transition-transform duration-300 ease-in-out transform hover:bg-orange-500 hover:scale-110"
            >
              Post
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className="text-white text-lg font-medium px-4 py-2 rounded-md transition-transform duration-300 ease-in-out transform hover:bg-orange-500 hover:scale-110"
            >
              Map
            </Link>
          </li>
          <li>
            <Link
              href="/contacts"
              className="text-white text-lg font-medium px-4 py-2 rounded-md transition-transform duration-300 ease-in-out transform hover:bg-orange-500 hover:scale-110"
            >
              Contacts
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
