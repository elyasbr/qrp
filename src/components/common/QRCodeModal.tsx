"use client";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Share2, Copy } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
  insuranceNumber?: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  petId,
  petName,
  insuranceNumber,
}: QRCodeModalProps) {
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
      // Generate QR code with just the URL
      const petUrl = `https://${window.location.host}/pet/${petId}`;

      const qrCodeDataUrl = await QRCode.toDataURL(petUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
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
        const shareText = insuranceNumber
          ? `Scan this QR code to view ${petName}'s information\nشماره بیمه: ${insuranceNumber}`
          : `Scan this QR code to view ${petName}'s information`;

        await navigator.share({
          title: `QR Code for ${petName}`,
          text: shareText,
          files: [
            new File([blob], `qr-code-${petName}.png`, { type: "image/png" }),
          ],
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
    const petUrl = `https://${window.location.host}/pet/${petId}`;
    const copyText = insuranceNumber
      ? `${petUrl}\nشماره بیمه: ${insuranceNumber}`
      : petUrl;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying URL:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        {copied && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-[60]">
            <div className="px-3 py-2 sm:px-4 sm:py-2 bg-[var(--main-color)] text-white text-xs sm:text-sm rounded-full shadow-lg">
              کپی شد
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              QR Code
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">برای {petName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[var(--main-color)]"></div>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                در حال تولید QR Code...
              </p>
            </div>
          ) : qrCodeDataUrl ? (
            <div className="text-center w-full">
              <div className="bg-white p-2 sm:p-4 rounded-lg shadow-lg border mb-3 sm:mb-4">
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code for ${petName}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 px-2">
                این QR Code را اسکن کنید تا اطلاعات {petName} را مشاهده کنید
              </p>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded mx-2 break-all">
                {`https://${window.location.host}/pet/${petId}`}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                شماره بیمه: {insuranceNumber || "تعیین نشده"}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm sm:text-base">
              خطا در تولید QR Code
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {qrCodeDataUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center gap-2 bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <Download size={16} />
              دانلود
            </button>
            <button
              onClick={shareQRCode}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <Share2 size={16} />
              اشتراک
            </button>
            <button
              onClick={copyUrl}
              className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <Copy size={16} />
              کپی لینک
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
