import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  text = "در حال بارگذاری...", 
  className = "" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 rounded-full border-4 border-[var(--main-color)]/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--main-color)] animate-spin"></div>
                    </div>
                    <div className="text-[var(--main-color)] font-semibold">{text}</div>
                </div>
            </div>
  );
}
