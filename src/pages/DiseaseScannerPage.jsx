import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export default function DiseaseScannerPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Handle file selection
  const handleImageChange = (file) => {
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  // Handle camera access
  const handleCameraClick = async () => {
    try {
      setCameraError(null);
      setShowCamera(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use rear camera on mobile
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          handleImageChange(file);
          closeCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // Close camera and stop stream
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraError(null);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageChange(file);
      } else {
        alert("Please drop an image file!");
      }
    }
  };

  // Handle scan button click
  const handleScan = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // Call backend API
      const response = await axios.post(API_ENDPOINTS.SCANNER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Validate response structure
      if (response.data && response.data.disease) {
        // Remove stars from all fields
        const removeStars = (text) => text ? text.replace(/\*/g, "").trim() : "";
        
        setResult({
          disease: removeStars(response.data.disease) || "Unknown",
          description: removeStars(response.data.description) || "No description available",
          treatment: removeStars(response.data.treatment) || "No treatment information available.",
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Scan error:", error);
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.detail || error.response.statusText || "Failed to scan image";
        
        // Check if it's a validation error (non-plant image)
        if (error.response.status === 400 && (errorMessage.includes("plant") || errorMessage.includes("farming"))) {
          alert(`⚠️ ${errorMessage}`);
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        // Request made but no response
        alert("Cannot connect to server. Please make sure the backend is running and accessible.");
      } else {
        // Other error
        alert(`Error scanning image: ${error.message || "Unknown error"}`);
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 mb-8 text-center">
          Crop Disease Scanner
        </h1>

        {/* Upload Section */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl max-w-2xl mx-auto mb-8">
          <div className="flex flex-col items-center">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full min-h-[200px] border-2 border-dashed rounded-2xl mb-6 backdrop-blur-sm transition-all duration-150 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/30 scale-105"
                  : "border-white/60 bg-white/20 hover:border-white/80 hover:bg-white/30"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-6">
                {preview ? (
                  <div className="relative w-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-md mx-auto h-64 object-cover rounded-2xl shadow-lg mb-4"
                    />
                    <button
                      onClick={() => {
                        setPreview(null);
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-150"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center mb-4">
                      <svg
                        className="w-16 h-16 text-emerald-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        {isDragging ? "Drop your image here" : "Drag & drop your image here"}
                      </p>
                      <p className="text-sm text-gray-600">or</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      {/* Camera Button */}
                      <button
                        onClick={handleCameraClick}
                        className="flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Take Photo</span>
                      </button>

                      {/* File Input */}
                      <label className="cursor-pointer flex items-center gap-2 backdrop-blur-sm bg-white/50 hover:bg-white/70 border border-white/60 rounded-xl px-6 py-3 text-gray-800 font-semibold transition-all duration-150 shadow-md hover:shadow-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        <span>Choose Image</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Scan Button */}
            <button
              onClick={handleScan}
              className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !selectedImage}
            >
              {loading ? "Scanning..." : "Scan Image"}
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-8 border border-white/50 shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-3">
              Disease Result:
            </h2>
            <p className="text-xl md:text-2xl text-gray-800 mb-6 font-bold">{result.disease}</p>
            
            <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-3">
              Description:
            </h3>
            <p className="text-base text-gray-800 mb-6 font-medium leading-relaxed">{result.description}</p>
            
            <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-3">
              Suggested Treatment:
            </h3>
            <p className="text-base text-gray-800 font-medium leading-relaxed">{result.treatment}</p>
          </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="backdrop-blur-xl bg-white/40 rounded-3xl p-6 border border-white/50 shadow-2xl max-w-2xl w-full mx-4 relative">
              <button
                onClick={closeCamera}
                className="absolute top-4 right-4 text-gray-800 hover:text-red-500 transition-colors duration-150 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
                  Camera
                </h3>

                {cameraError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 font-semibold mb-4">{cameraError}</p>
                    <button
                      onClick={closeCamera}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative w-full max-w-lg mb-6 rounded-2xl overflow-hidden bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto"
                        style={{ maxHeight: '70vh' }}
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={closeCamera}
                        className="backdrop-blur-sm bg-white/50 hover:bg-white/70 border border-white/60 rounded-xl px-6 py-3 text-gray-800 font-semibold transition-all duration-150 shadow-md hover:shadow-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="flex items-center gap-2 backdrop-blur-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Capture Photo
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
