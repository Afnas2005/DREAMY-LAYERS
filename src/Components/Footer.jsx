
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-pink-100 text-center py-6 mt-12">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} SweetBite. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
