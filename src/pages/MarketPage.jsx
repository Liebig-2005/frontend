import { useState, useEffect } from "react";
import axios from "axios";

export default function MarketPage() {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru Urban");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";  // Sample API key
      const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
      const format = "json";
      const limit = 100; // Sample key returns max 10 records, but we'll request 100
  
      // Build filters according to API documentation
      const params = new URLSearchParams({
        "api-key": apiKey,
        format,
        limit,
      });
  
      // Add filters only if values are provided
      if (selectedState) {
        params.append("filters[state.keyword]", selectedState);
      }
      if (selectedDistrict) {
        params.append("filters[district]", selectedDistrict);
      }
      if (selectedCrop) {
        params.append("filters[commodity]", selectedCrop);
      }
  
      const response = await axios.get(`${baseUrl}?${params.toString()}`);
  
      const data = response.data;
  
      if (!data || !data.records || data.records.length === 0) {
        setPrices([]);
        setError("No data found for selected crop/region. Try different filters.");
      } else {
        // Map API response fields (API may return uppercase or lowercase field names)
        const priceData = data.records.map((rec) => {
          // Try different possible field name variations
          const date = rec.date || rec.trade_date || rec.TRADE_DATE || rec.reporting_date || rec.REPORTING_DATE || "N/A";
          const minPrice = rec.min_price || rec.MIN_PRICE || rec.min || rec.MIN || 0;
          const maxPrice = rec.max_price || rec.MAX_PRICE || rec.max || rec.MAX || 0;
          const modalPrice = rec.modal_price || rec.MODAL_PRICE || rec.modal || rec.MODAL || 0;
          
          return {
            date: date,
            min_price: minPrice,
            max_price: maxPrice,
            modal_price: modalPrice,
          };
        });
        setPrices(priceData);
        setError(null);
      }
    } catch (err) {
      console.error("Market prices fetch error:", err);
      if (err.response) {
        // API returned an error response
        if (err.response.status === 403) {
          setError("API access forbidden. Please check your API key.");
        } else if (err.response.status === 400) {
          setError("Invalid request parameters. Please check your filters.");
        } else {
          setError(`Failed to fetch market prices: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Failed to fetch live market prices. Please try again.");
      }
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch prices on component mount
  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-4 text-center">
          Market Prices
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Sample API key returns maximum 10 records. For full access, generate your own API key.
        </p>

        {/* Selector Section */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/50 shadow-2xl max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
            >
              <option>Rice</option>
              <option>Wheat</option>
              <option>Maize</option>
              <option>Tomato</option>
              <option>Onion</option>
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
            >
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
              <option>Delhi</option>
              <option>West Bengal</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
            >
              <option>Bengaluru Urban</option>
              <option>Mumbai</option>
              <option>Chennai</option>
              <option>Delhi</option>
              <option>Kolkata</option>
            </select>

            <button
              onClick={fetchPrices}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? "Loading..." : "Get Prices"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="backdrop-blur-xl bg-red-50/40 rounded-3xl p-8 border border-red-200/50 shadow-2xl max-w-md mx-auto text-center mb-8">
            <p className="text-lg text-red-600 font-semibold">{error}</p>
            <button
              onClick={fetchPrices}
              className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150"
            >
              Retry
            </button>
          </div>
        )}

        {/* Price Table */}
        {(prices.length > 0 || loading) && (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl max-w-5xl mx-auto overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-800 font-medium">Loading market prices...</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-6 text-center">
                  {selectedCrop} Prices - {selectedDistrict}, {selectedState}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="backdrop-blur-sm bg-white/30 border-b border-white/40">
                        <th className="px-6 py-4 text-sm font-bold text-gray-800 text-left">Date</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800 text-left">Min Price (₹)</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800 text-left">Max Price (₹)</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-800 text-left">Modal Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((row, index) => (
                        <tr
                          key={index}
                          className={`backdrop-blur-sm border-b border-white/30 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white/20" : "bg-white/10"
                          } hover:bg-white/30`}
                        >
                          <td className="px-6 py-4 text-gray-800 font-medium">
                            {row.date && row.date !== "N/A" 
                              ? new Date(row.date).toLocaleDateString('en-IN', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              : row.date || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-800">
                            {row.min_price > 0 ? `₹${row.min_price.toLocaleString('en-IN')}` : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-800">
                            {row.max_price > 0 ? `₹${row.max_price.toLocaleString('en-IN')}` : "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-semibold">
                            {row.modal_price > 0 ? `₹${row.modal_price.toLocaleString('en-IN')}` : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
