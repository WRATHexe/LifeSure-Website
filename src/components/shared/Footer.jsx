import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-12">
          {/* Company Info - Enhanced */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                LifeSure
              </span>
            </div>

            <p className="text-gray-300 text-lg mb-8 max-w-3xl leading-relaxed">
              Secure your tomorrow today with our comprehensive life insurance
              solutions. We bring transparency, trust, and innovation to the
              insurance industry, making life insurance accessible and
              understandable for everyone.
            </p>

            {/* Enhanced Social Media Links */}
            <div className="flex justify-center space-x-8">
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zM4.5 24h15a4.5 4.5 0 004.5-4.5v-15A4.5 4.5 0 0021 0h-15A4.5 4.5 0 000 4.5v15A4.5 4.5 0 004.5 24z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info - Centered */}
          <div className="border-t border-gray-800 pt-8">
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-300">
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>info@lifesure.com</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>123 Insurance Ave, NY</span>
              </div>
            </div>
          </div>

          {/* Copyright - Centered */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </div>
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} LifeSure. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
