import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = ["AgriAdvisor", "Free Agri Tool"];
  
  useEffect(() => {
    let timeout;
    const currentIndex = displayText.length;
    const fullText = texts[currentTextIndex];
    
    if (!isDeleting && currentIndex < fullText.length) {
      // Typing
      timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
      }, 80);
    } else if (!isDeleting && currentIndex === fullText.length) {
      // Pause before deleting
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && currentIndex > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex - 1));
      }, 50);
    } else if (isDeleting && currentIndex === 0) {
      // Switch to next text
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, 300);
    }
    
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex, texts]);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden m-0 p-0">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section - Full Width Full Height */}
      <div className="h-screen w-full flex items-center justify-center relative z-10">
        <div className="text-center w-full h-full flex items-center justify-center">
          <div className="backdrop-blur-xl bg-white/30 rounded-none p-12 md:p-16 lg:p-20 border border-white/40 shadow-2xl w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-8 leading-tight">
              <span className="inline-block">{displayText}</span>
              <span className="typing-cursor inline-block w-2 h-16 md:h-20 lg:h-24 bg-gradient-to-b from-emerald-500 to-teal-500 ml-2 align-middle">|</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
              All-in-one platform for crop health, market prices, weather, and planting recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Chatbot Card */}
          <Link 
            to="/chat" 
            className="group backdrop-blur-xl bg-white/40 hover:bg-white/60 rounded-2xl p-6 border border-white/50 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                💬
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-3 text-center group-hover:text-green-800 transition-colors">
              Chatbot Assistant
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-center flex-grow">
              Ask questions about crops, farming techniques, or market trends in simple language.
            </p>
          </Link>

          {/* Disease Scanner Card */}
          <Link 
            to="/scan" 
            className="group backdrop-blur-xl bg-white/40 hover:bg-white/60 rounded-2xl p-6 border border-white/50 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🔍
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-3 text-center group-hover:text-green-800 transition-colors">
              Crop Disease Scanner
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-center flex-grow">
              Upload a picture of your crop to quickly identify diseases and get treatment suggestions.
            </p>
          </Link>

          {/* Weather Card */}
          <Link 
            to="/weather" 
            className="group backdrop-blur-xl bg-white/40 hover:bg-white/60 rounded-2xl p-6 border border-white/50 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🌤️
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-3 text-center group-hover:text-green-800 transition-colors">
              Weather Updates
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-center flex-grow">
              Get real-time weather information for your region to plan your farming activities.
            </p>
          </Link>

          {/* Market Prices Card */}
          <Link 
            to="/market" 
            className="group backdrop-blur-xl bg-white/40 hover:bg-white/60 rounded-2xl p-6 border border-white/50 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-3 text-center group-hover:text-green-800 transition-colors">
              Market Prices
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-center flex-grow">
              Check live market prices for crops in your region to make better selling decisions.
            </p>
          </Link>

          {/* Recommendations Card */}
          <Link 
            to="/recommend" 
            className="group backdrop-blur-xl bg-white/40 hover:bg-white/60 rounded-2xl p-6 border border-white/50 shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full"
          >
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                🌾
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-3 text-center group-hover:text-green-800 transition-colors">
              Planting Recommendations
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-center flex-grow">
              Receive suggestions on what crops to plant based on season, weather, and region.
            </p>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        .animate-blob {
          animation: blob 3s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 1s;
        }
        .animation-delay-4000 {
          animation-delay: 2s;
        }
        .typing-cursor {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}
