import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
      <footer className="bg-white text-black py-6 px-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between">
          {/* Left Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold">Email</h3>
            <p className="text-gray-600">Hearth&Co@gmail.com</p>
            <h3 className="font-bold mt-4">Contact:</h3>
            <p className="text-blue-500"><a href="tel:9816977218">9816977218</a></p>
            <p className="text-blue-500"><a href="tel:9816977218">9816977218</a></p>
            <div className="flex space-x-4 mt-4">
              {/* Social Icons */}
              <a href="#" className="text-xl"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-xl"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-xl"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-xl"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
  
          {/* Middle Section */}
          <div className="flex flex-wrap gap-10">
            <div>
              <h3 className="font-bold">Company</h3>
              <ul className="text-gray-600">
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/contact-us">Contact Us</Link></li>
                <li><Link to="/help-center">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Support</h3>
              <ul className="text-gray-600">
                <li><Link to="/user-guide">User Guide</Link></li>
                <li><Link to="/faqs">FAQs Page</Link></li>
                <li><Link to="/support-team">Support Team</Link></li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* Bottom Section */}
        <div className="border-t mt-6 pt-4 text-center text-gray-600">
          <p>© 2024 Hearth&Co. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/login" className="hover:underline">Terms of Service</Link>
            <Link to="/cookies-settings" className="hover:underline">Cookies Settings</Link>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
