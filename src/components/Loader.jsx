import React from "react";

export default function Loader({ size = "md", text = "Loading...", variant = "spinner" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  if (variant === "dots") {
    return (
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {text && <p className={`text-gray-600 ${textSizes[size]}`}>{text}</p>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="flex flex-col items-center justify-center h-40 space-y-4">
        <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
        {text && <p className={`text-gray-600 ${textSizes[size]}`}>{text}</p>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center h-40 space-y-4">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600`}></div>
      {text && <p className={`text-gray-600 ${textSizes[size]}`}>{text}</p>}
    </div>
  );
}
