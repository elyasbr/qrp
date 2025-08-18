"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { preRegisterMobile, acceptRegisterMobile } from "@/services/api/userService";
import { useRouter } from "next/navigation";
import { extractAndTranslateError } from "@/utils/errorTranslations";
import { useSnackbar } from "@/hooks/useSnackbar";
import Snackbar from "@/components/common/Snackbar";

export default function SignUp({ title = "ثبت نام" }: { title?: string }) {
  const phoneLength = 11;
  const codeLength = 6;

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(phoneLength).fill(""));
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { showError, showSuccess, snackbar, hideSnackbar } = useSnackbar();

  const phoneValid =
    phoneDigits.length === phoneLength &&
    phoneDigits.every((d) => /^\d$/.test(d)) &&
    phoneDigits[0] === "0" &&
    phoneDigits[1] === "9";

  const codeValid = code.every((d) => /^\d$/.test(d));

  // Format collected digits for API call
  const formatMobile = (digits: string[]) => {
    const raw = digits.join("");
    if (raw.startsWith("0")) {
      return `+98${raw.replace(/^0+/, "")}`;
    }
    if (raw.startsWith("98")) {
      return `+${raw}`;
    }
    if (raw.startsWith("9")) {
      return `+98${raw}`;
    }
    return `+98${raw}`;
  };

  // Check if error indicates duplicate mobile number
  const isDuplicateMobileError = (error: any) => {
    const errorResponse = error?.response;
    const errorData = errorResponse?.data || error?.data || error;
    const messageObj = errorData?.message || {};
    const errorCode = messageObj?.code || errorData?.code || error?.code;
    const errorMsg = messageObj?.msg || errorData?.msg || errorData?.message || error?.message;
    const errorText = errorData?.error || errorData?.text || errorData?.details || "";
    const errorString = typeof error === 'string' ? error : JSON.stringify(error);

    const errorCodeStr = String(errorCode || "");
    const errorMsgStr = String(errorMsg || "");
    const errorTextStr = String(errorText || "");

    return (
      errorCodeStr === "1001" ||
      errorMsgStr.includes("MOBILE_FIELD_USER_IS_DUPLICATED") ||
      errorTextStr.includes("MOBILE_FIELD_USER_IS_DUPLICATED") ||
      errorMsgStr.includes("duplicate") ||
      errorMsgStr.includes("duplicated") ||
      errorMsgStr.includes("already exists") ||
      errorMsgStr.includes("already registered") ||
      errorMsgStr.includes("Failed to accept mobile registration") ||
      errorString.includes("Failed to accept mobile registration") ||
      errorResponse?.status === 409 ||
      errorMsgStr.includes("قبلا ثبت نام") ||
      errorMsgStr.includes("موجود است")
    );
  };

  useEffect(() => {
    if (step === "phone") {
      setTimeout(() => phoneInputRefs.current[0]?.focus(), 50);
    } else {
      setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    if (!val && e.target.value !== "") return;
    
    const newDigits = [...phoneDigits];
    newDigits[idx] = val || "";
    setPhoneDigits(newDigits);
    
    if (val && idx < phoneLength - 1) {
      phoneInputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...phoneDigits];
      if (newDigits[idx]) {
        newDigits[idx] = "";
        setPhoneDigits(newDigits);
      } else if (idx > 0) {
        phoneInputRefs.current[idx - 1]?.focus();
        const prevDigits = [...phoneDigits];
        prevDigits[idx - 1] = "";
        setPhoneDigits(prevDigits);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newDigits = [...phoneDigits];
      newDigits[idx] = "";
      setPhoneDigits(newDigits);
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      phoneInputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < phoneLength - 1) {
      e.preventDefault();
      phoneInputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, phoneLength - idx);
    if (!pasted) return;
    
    const newDigits = [...phoneDigits];
    pasted.split("").forEach((digit, i) => (newDigits[idx + i] = digit));
    setPhoneDigits(newDigits);
    
    const nextIndex = Math.min(idx + pasted.length, phoneLength - 1);
    phoneInputRefs.current[nextIndex]?.focus();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = val || "";
    setCode(newCode);
    
    if (val && index < codeLength - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        codeInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      codeInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < codeLength - 1) {
      e.preventDefault();
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, codeLength - index);
    if (!pasted) return;
    
    const newCode = [...code];
    pasted.split("").forEach((digit, i) => (newCode[index + i] = digit));
    setCode(newCode);
    
    const nextIndex = Math.min(index + pasted.length, codeLength - 1);
    codeInputRefs.current[nextIndex]?.focus();
  };

  const handleSendCode = async () => {
    if (!phoneValid) {
      showError("لطفا شماره موبایل معتبر وارد کنید.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const mobile = formatMobile(phoneDigits);
      await preRegisterMobile(mobile);
      setStep("code");
    } catch (err: any) {
      if (isDuplicateMobileError(err)) {
        showError("این شماره قبلا ثبت نام کرده است.");
        setTimeout(() => router.push("/signin"), 2000);
      } else {
        showError(extractAndTranslateError(err));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!codeValid) {
      showError("کد وارد شده نامعتبر است.");
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const mobile = formatMobile(phoneDigits);
      await acceptRegisterMobile(mobile, code.join(""));
      showSuccess("ثبت نام با موفقیت انجام شد. لطفاً وارد شوید.");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: any) {
      if (isDuplicateMobileError(err)) {
        showError("این شماره قبلا ثبت نام کرده است.");
        setTimeout(() => router.push("/signin"), 2000);
      } else {
        showError(extractAndTranslateError(err));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setCode(Array(codeLength).fill(""));
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] text-[var(--foreground)] p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 space-y-8">
          <h1 className="text-3xl font-extrabold text-center text-[var(--main-color)] mb-4">
            {title}
          </h1>

          {step === "phone" && (
            <div className="space-y-4">
              <label className="block text-gray-700 font-medium mb-1">
                شماره موبایل
              </label>
              <div dir="ltr" className="flex justify-center gap-1">
                {phoneDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePhoneChange(e, idx)}
                    onKeyDown={(e) => handlePhoneKeyDown(e, idx)}
                    onPaste={(e) => handlePhonePaste(e, idx)}
                    onFocus={(e) => e.currentTarget.select()}
                    ref={(el: any) => (phoneInputRefs.current[idx] = el)}
                    aria-label={`شماره موبایل رقم ${idx + 1}`}
                    className="w-6 lg:w-7 h-8 text-center border outline-none border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                  />
                ))}
              </div>
              <button
                onClick={handleSendCode}
                disabled={!phoneValid || isProcessing}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  phoneValid && !isProcessing 
                    ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] cursor-pointer" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "در حال ارسال..." : "دریافت کد تایید"}
              </button>
            </div>
          )}

          {step === "code" && (
            <div className="space-y-4">
              <label className="block text-gray-700 font-medium mb-1">
                کد تایید
              </label>
              <div dir="ltr" className="flex justify-center gap-3">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e, idx)}
                    onKeyDown={(e) => handleCodeKeyDown(e, idx)}
                    onPaste={(e) => handleCodePaste(e, idx)}
                    onFocus={(e) => e.currentTarget.select()}
                    ref={(el: any) => (codeInputRefs.current[idx] = el)}
                    aria-label={`کد رقم ${idx + 1}`}
                    className="w-10 h-10 lg:w-12 lg:h-12 text-center border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent outline-none"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={!codeValid || isProcessing}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  codeValid && !isProcessing 
                    ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)] cursor-pointer" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "در حال ثبت نام..." : "ثبت نام"}
              </button>
              <button
                onClick={handleBackToPhone}
                disabled={isProcessing}
                className="mt-2 text-sm text-[var(--main-color)] hover:underline cursor-pointer disabled:opacity-50"
              >
                بازگشت به مرحله قبل
              </button>
            </div>
          )}

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-2">قبلاً ثبت نام کرده‌اید؟</p>
            <Link
              href="/signin"
              className="inline-block px-6 py-2 text-[var(--main-color)] border border-[var(--main-color)] rounded-lg hover:bg-[var(--main-color)] hover:text-white transition-colors"
            >
              وارد شوید
            </Link>
          </div>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        duration={snackbar.duration}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
        position="top-center"
      />
    </>
  );
}