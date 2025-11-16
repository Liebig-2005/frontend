import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]); // Chat history
  const [input, setInput] = useState("");       // User input
  const [loading, setLoading] = useState(false);
  const [greetingSent, setGreetingSent] = useState(false);
  const messagesEndRef = useRef(null);

  // Send greeting message when component mounts
  useEffect(() => {
    if (!greetingSent) {
      const greeting = {
        sender: "bot",
        text: "Hello! I'm your agricultural assistant. I can help you with farming advice, crop diseases, soil management, weather information, and market prices. How can I assist you with your farming needs today?"
      };
      setMessages([greeting]);
      setGreetingSent(true);
    }
  }, [greetingSent]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chatbot/", {
        message: input,
      });

      // ✅ Backend returns { "response": "..." }
      const botReply = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Chatbot API error:", err);
      let errorMsg = "Error: Could not get response.";
      if (err.response) {
        errorMsg = `Error: ${err.response.data?.detail || err.response.statusText || "Failed to get response"}`;
      } else if (err.request) {
        errorMsg = "Cannot connect to server. Please make sure the backend is running on http://localhost:8000";
      }
      const errorMessage = { sender: "bot", text: errorMsg };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-8 text-center">
          Crop Chatbot
        </h1>

        {/* Chat Window */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/50 shadow-2xl max-w-3xl mx-auto flex flex-col h-[500px] overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 px-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[70%] break-words ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-medium shadow-lg"
                      : "backdrop-blur-xl bg-white/60 border border-white/50 text-gray-800 font-medium shadow-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <div className="px-4 py-3 rounded-2xl max-w-[70%] backdrop-blur-xl bg-white/60 border border-white/50 text-gray-800 font-medium shadow-md">
                  <span className="inline-block animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}