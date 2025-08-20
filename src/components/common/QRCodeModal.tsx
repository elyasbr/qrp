"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Share2, Copy } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
}

export default function QRCodeModal({ isOpen, onClose, petId, petName }: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && petId) {
      generateQRCode();
    }
  }, [isOpen, petId]);

  const generateQRCode = async () => {
    if (!petId) return;
    
    setIsGenerating(true);
    try {
      // Generate the URL for the pet
      const petUrl = `${window.location.origin}/pet/${petId}`;
      
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(petUrl, {
        width: 300,
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

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement("a");
    link.download = `qr-code-${petName}-${petId}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (!qrCodeDataUrl) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl);
      const blob = await response.blob();
      
      if (navigator.share) {
        await navigator.share({
          title: `QR Code for ${petName}`,
          text: `Scan this QR code to view ${petName}'s information`,
          files: [new File([blob], `qr-code-${petName}.png`, { type: 'image/png' })]
        });
      } else {
        // Fallback: copy to clipboard or download
        downloadQRCode();
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
      downloadQRCode();
    }
  };

  const copyUrl = async () => {
    const petUrl = `${window.location.origin}/pet/${petId}`;
    try {
      await navigator.clipboard.writeText(petUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying URL:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {copied && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[60]">
            <div className="px-4 py-2 bg-[var(--main-color)] text-white text-sm rounded-full shadow-lg">
              کپی شد
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
            <p className="text-sm text-gray-600">برای {petName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mb-6">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color)]"></div>
              <p className="text-gray-600">در حال تولید QR Code...</p>
            </div>
          ) : qrCodeDataUrl ? (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-lg border mb-4">
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code for ${petName}`}
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                این QR Code را اسکن کنید تا اطلاعات {petName} را مشاهده کنید
              </p>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                {`${window.location.origin}/pet/${petId}`}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              خطا در تولید QR Code
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {qrCodeDataUrl && (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Download size={16} />
              دانلود
            </button>
            <button
              onClick={shareQRCode}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Share2 size={16} />
              اشتراک
            </button>
            <button
              onClick={copyUrl}
              className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Copy size={16} />
              کپی لینک
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">نحوه استفاده:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• این QR Code را با دوربین گوشی اسکن کنید</li>
            <li>• یا آن را دانلود کرده و چاپ کنید</li>
            <li>• هر کسی می‌تواند با اسکن این کد، اطلاعات پت را ببیند</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
