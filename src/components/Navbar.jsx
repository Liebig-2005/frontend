import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/50 shadow-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-150">
          AgriAdvisor
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4 md:space-x-6 text-base md:text-lg hidden md:flex">
          <Link 
            to="/" 
            className="text-gray-800 font-semibold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-150"></span>
          </Link>
          <Link 
            to="/scan" 
            className="text-gray-800 font-semibold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 relative group"
          >
            Disease Detection
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-150"></span>
          </Link>
          <Link 
            to="/market" 
            className="text-gray-800 font-semibold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 relative group"
          >
            Market Prices
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-150"></span>
          </Link>
          <Link 
            to="/weather" 
            className="text-gray-800 font-semibold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 relative group"
          >
            Weather
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-150"></span>
          </Link>
          <Link 
            to="/recommend" 
            className="text-gray-800 font-semibold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 relative group"
          >
            Recommendations
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-150"></span>
          </Link>
          <Link 
            to="/about" 
            className="text-gray-800 font-semibold hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 transition-all duration-150 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-full transition-all duration-150"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800 hover:text-emerald-500 transition-colors duration-150">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
    </nav>
  );
}
