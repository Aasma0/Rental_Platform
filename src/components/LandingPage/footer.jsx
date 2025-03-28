import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8 px-6 md:px-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        {/* Left Section */}
        <div className="mb-8 md:mb-0">
          <h3 className="font-bold">Email</h3>
          <p className="text-gray-600">
            <a href="mailto:Hearth&Co@gmail.com" className="hover:underline">Hearth&Co@gmail.com</a>
          </p>
          <h3 className="font-bold mt-4">Contact</h3>
          <p className="text-blue-500">
            <a href="tel:9816977218" className="hover:underline">9816977218</a>
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-xl hover:text-blue-600" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-xl hover:text-pink-600" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-xl hover:text-blue-700" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-xl hover:text-red-600" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 gap-6 md:gap-10">
          <div>
            <h3 className="font-bold">Company</h3>
            <ul className="text-gray-600 space-y-2">
              <li><Link to="/about-us" className="hover:text-blue-600">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link to="/help-center" className="hover:text-blue-600">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Support</h3>
            <ul className="text-gray-600 space-y-2">
              <li><Link to="/user-guide" className="hover:text-blue-600">User Guide</Link></li>
              <li><Link to="/faqs" className="hover:text-blue-600">FAQs Page</Link></li>
              <li><Link to="/support-team" className="hover:text-blue-600">Support Team</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t mt-6 pt-4 text-center text-gray-600">
        <p>© 2024 Hearth&Co. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
          <Link to="/cookies-settings" className="hover:underline">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
