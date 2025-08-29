"use client";
import { useState } from "react";
import { uploadFile } from "@/services/api/uploadService";
import { useSnackbar } from "@/hooks/useSnackbar";
import { testNetworkConnectivity, logNetworkTestResults } from "@/utils/networkTest";

export default function UploadTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [networkTestResult, setNetworkTestResult] = useState<any>(null);
  const [testingNetwork, setTestingNetwork] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError("لطفاً فایلی انتخاب کنید");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await uploadFile(selectedFile, false);

      setUploadResult(result);
      showSuccess("آپلود موفقیت‌آمیز بود!");
      
    } catch (error) {
      console.error("Upload failed:", error);
      if (error instanceof Error) {
        showError(`خطا در آپلود: ${error.message}`);
      } else {
        showError("خطای نامشخص در آپلود");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleNetworkTest = async () => {
    setTestingNetwork(true);
    setNetworkTestResult(null);

    try {
      const results = await testNetworkConnectivity();
      logNetworkTestResults(results);
      setNetworkTestResult(results);
      showSuccess("تست شبکه تکمیل شد. نتایج در کنسول نمایش داده شد.");
    } catch (error) {
      console.error("Network test failed:", error);
      showError("خطا در تست شبکه");
    } finally {
      setTestingNetwork(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">تست آپلود فایل</h2>
      
      <div className="space-y-4">
        {/* Network Test Button */}
        <button
          onClick={handleNetworkTest}
          disabled={testingNetwork}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {testingNetwork ? "در حال تست شبکه..." : "تست اتصال شبکه"}
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            انتخاب فایل
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {selectedFile && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>نام فایل:</strong> {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>حجم:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm text-gray-600">
              <strong>نوع:</strong> {selectedFile.type}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "در حال آپلود..." : "آپلود فایل"}
        </button>

        {uploadResult && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">نتیجه آپلود:</h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}

        {networkTestResult && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">نتایج تست شبکه:</h3>
            <pre className="text-sm text-blue-700 overflow-auto max-h-40">
              {JSON.stringify(networkTestResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
