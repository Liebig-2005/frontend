import { useState, useEffect, useRef } from "react";

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const abortControllerRef = useRef(null);
  const [location, setLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    city: "Bengaluru",
    country: "India"
  });

  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=4&language=en&format=json`,
        { signal: abortController.signal }
      );

      if (!geoResponse.ok) {
        return;
      }

      const geoData = await geoResponse.json();

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      if (geoData.results && geoData.results.length > 0) {
        // Filter to only show Indian locations
        const indianLocations = geoData.results.filter((result) => {
          const isIndia = result.country_code === "IN" || 
                          result.country === "India" || 
                          (result.country && result.country.toLowerCase().includes("india"));
          return isIndia;
        });

        setSuggestions(indianLocations);
        setShowSuggestions(indianLocations.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return;
      }
      console.error("Suggestions fetch error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setSearching(true);
    setError(null);
    setShowSuggestions(false);

    try {
      // Use Open-Meteo geocoding API
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error(`Geocoding failed: ${geoResponse.status}`);
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Location not found. Please try a different city name.");
      }

      const result = geoData.results[0];
      
      // Check if location is in India
      const isIndia = result.country_code === "IN" || 
                      result.country === "India" || 
                      (result.country && result.country.toLowerCase().includes("india"));
      
      if (!isIndia) {
        throw new Error("Please search for locations in India only.");
      }

      setLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        city: result.name,
        country: result.country || "India"
      });

      // Fetch weather for the new location
      await fetchWeather(result.latitude, result.longitude, result.name, result.country || "India");
      setSearchQuery("");
    } catch (err) {
      console.error("Location search error:", err);
      setError(err.message || "Failed to find location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    searchLocation(suggestion.name);
  };

  const fetchWeather = async (lat = location.latitude, lon = location.longitude, city = location.city, country = location.country) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&timezone=Asia%2FKolkata&forecast_days=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.hourly || !data.hourly.temperature_2m) {
        throw new Error("Invalid response structure from API");
      }

      // Pick current hour data
      const currentHourIndex = new Date().getHours();
      const weatherData = {
        temperature: data.hourly.temperature_2m[currentHourIndex]?.toFixed(1) || "N/A",
        humidity: data.hourly.relativehumidity_2m?.[currentHourIndex]?.toFixed(1) || "N/A",
        wind_speed: data.hourly.windspeed_10m?.[currentHourIndex]?.toFixed(1) || "N/A",
        weathercode: data.hourly.weathercode?.[currentHourIndex] || null,
        condition: getWeatherCondition(data.hourly.weathercode?.[currentHourIndex]),
        city: city,
        country: country,
      };

      setWeather(weatherData);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(`Failed to fetch weather data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Convert weather code to condition
  const getWeatherCondition = (code) => {
    if (code === null || code === undefined) return "N/A";
    const conditions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return conditions[code] || "Unknown";
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Debounced suggestions fetch
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 150); // 150ms debounce for faster response

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-8 text-center">
          Weather Dashboard
        </h1>

        {/* Search Box */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/50 shadow-2xl max-w-2xl mx-auto mb-8 relative">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a city in India (e.g., Mumbai, Delhi, Chennai)"
                className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
                disabled={searching || loading}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-white/60 rounded-xl border border-white/50 shadow-2xl z-50 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-white/40 transition-colors duration-150 border-b border-white/30 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="font-semibold text-gray-800">{suggestion.name}</div>
                      <div className="text-sm text-gray-600">
                        {suggestion.admin1 && `${suggestion.admin1}, `}
                        {suggestion.country}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={searching || loading || !searchQuery.trim()}
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-3 text-center">
            Currently showing: <span className="font-semibold text-emerald-600">{location.city}, {location.country}</span>
          </p>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="backdrop-blur-xl bg-red-50/40 rounded-3xl p-8 border border-red-200/50 shadow-2xl max-w-md mx-auto text-center">
            <p className="text-lg text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => fetchWeather(location.latitude, location.longitude, location.city, location.country)}
              className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150"
            >
              Retry
            </button>
          </div>
        )}

        {/* Weather Info */}
        {(weather || loading) && (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">
                {loading ? location.city : weather?.city}, {loading ? location.country : weather?.country}
              </h2>
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-4">
                {loading ? (
                  <span className="text-2xl md:text-3xl">Loading weather data...</span>
                ) : (
                  `${weather?.temperature}°C`
                )}
              </div>
              <p className="text-xl text-gray-800 font-semibold mb-6">
                {loading ? "-" : weather?.condition}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border border-white/40 text-center">
                <p className="text-sm text-gray-600 mb-2 font-medium">Humidity</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "-" : `${weather?.humidity}%`}
                </p>
              </div>
              <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 border border-white/40 text-center">
                <p className="text-sm text-gray-600 mb-2 font-medium">Wind Speed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "-" : `${weather?.wind_speed} km/h`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
