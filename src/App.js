import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import DiseaseScannerPage from "./pages/DiseaseScannerPage";
import WeatherPage from "./pages/WeatherPage";
import MarketPage from "./pages/MarketPage";
import RecommendationPage from "./pages/RecommendationPage";
import About from "./pages/About";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar /> {/* Must be inside Router */}

      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/scan" element={<DiseaseScannerPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/recommend" element={<RecommendationPage />} />
          <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
