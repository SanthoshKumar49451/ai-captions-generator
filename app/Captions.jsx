"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, Image, Sparkles, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Captions = () => {
  const [captions, setCaptions] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setCaptions([]);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const handleRemoveImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setCaptions([]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image!");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/captionsGenerator", formData);
      const { captions } = res.data;

      if (!captions || captions.length === 0) {
        toast.warn("No captions returned.");
        setCaptions([]);
      } else {
        setCaptions(captions);
        toast.success("Captions generated successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to generate captions.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-2 py-6 sm:px-4 md:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl  mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3 sm:mb-4">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            AI Caption Generator
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-md mx-auto">
            Upload your image and get creative captions powered by AI
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col  gap-6 md:gap-10 lg:gap-12 items-center ">
          {/* Upload Section */}
          <div className="space-y-5 md:space-y-6">
            <div className="relative">
              <label
                htmlFor="file"
                className={`group relative flex flex-col items-center justify-center w-full h-56 sm:h-64 md:h-72 lg:h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  previewUrl
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 bg-gray-50 hover:bg-purple-50"
                }`}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl"
                      style={{ display: "block" }}
                      onError={(e) => {
                        console.error("Image failed to load:", e);
                        handleRemoveImage();
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-2xl flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm sm:text-base">
                        Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 sm:p-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
                      Drop your image here
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
                      or click to browse
                    </p>
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-medium rounded-full group-hover:shadow-lg transition-shadow">
                      <Image className="w-4 h-4 mr-2" />
                      Choose File
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-base sm:text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Captions...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Captions
                </div>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-5 md:space-y-6 w-full">
            {captions.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    Generated Captions
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4 h-48 sm:h-56 max-w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {captions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => copyToClipboard(item.title)}
                      className="group p-3 sm:p-4 md:p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg font-medium leading-relaxed flex-1">
                          {item.title}
                        </p>
                        <button className="ml-2 sm:ml-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-lg">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    Click any caption to copy to clipboard
                  </p>
                </div>
              </div>
            ) : (
              !isLoading && (
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Image className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
                    No captions yet
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Upload an image to get started with AI-generated captions
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Captions;
