"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  showUrl?: boolean;
}

export default function QRCodeDisplay({ 
  value, 
  size = 200, 
  className = "",
  showUrl = false 
}: QRCodeDisplayProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (value) {
      generateQRCode();
    }
  }, [value, size]);

  const generateQRCode = async () => {
    if (!value) return;
    
    setIsGenerating(true);
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(value, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      
      setQrCodeDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--main-color)]"></div>
      </div>
    );
  }

  if (!qrCodeDataUrl) {
    return (
      <div className={`flex items-center justify-center text-gray-500 ${className}`}>
        خطا در تولید QR Code
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src={qrCodeDataUrl}
        alt="QR Code"
        className="border rounded-lg"
      />
      {showUrl && (
        <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded text-center break-all">
          {value}
        </p>
      )}
    </div>
  );
}
