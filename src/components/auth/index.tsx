"use client";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Auth() {
  const phoneLength = 11; // 11 digits for phone number (e.g. 09123456789)
  const codeLength = 6;

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(phoneLength).fill(""));
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState("");

  // Phone number validation (must be 11 digits, start with 09)
  const phoneValid =
    phoneDigits.length === phoneLength &&
    phoneDigits.every((d) => /^\d$/.test(d)) &&
    phoneDigits[0] === "0" &&
    phoneDigits[1] === "9";

  // Code validation: all digits filled
  const codeValid = code.every((d) => /^\d$/.test(d));

  // Focus first input on step change
  useEffect(() => {
    if (step === "phone") {
      setTimeout(() => phoneInputRefs.current[0]?.focus(), 50);
    } else if (step === "code") {
      setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  // Handle phone digit change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1); // only last digit
    if (!val && e.target.value !== "") return; // ignore if invalid character typed

    const newDigits = [...phoneDigits];
    newDigits[idx] = val || "";
    setPhoneDigits(newDigits);

    if (val && idx < phoneLength - 1) {
      phoneInputRefs.current[idx + 1]?.focus();
    }
  };

  // Handle phone key down (navigation and deletion)
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

  // Paste on phone inputs: fill digits forward
  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, phoneLength - idx);
    if (!pasted) return;

    const newDigits = [...phoneDigits];
    pasted.split("").forEach((digit, i) => {
      newDigits[idx + i] = digit;
    });
    setPhoneDigits(newDigits);

    const nextIndex = Math.min(idx + pasted.length, phoneLength - 1);
    phoneInputRefs.current[nextIndex]?.focus();
  };

  // Handle code digit change, keydown, and paste are unchanged (same as before)
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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, codeLength - index);
    if (!pasted) return;

    const newCode = [...code];
    pasted.split("").forEach((digit, i) => {
      newCode[index + i] = digit;
    });
    setCode(newCode);

    const nextIndex = Math.min(index + pasted.length, codeLength - 1);
    codeInputRefs.current[nextIndex]?.focus();
  };

  // Send code after phone validation
  const handleSendCode = () => {
    if (!phoneValid) {
      setError("لطفا شماره موبایل معتبر وارد کنید.");
      return;
    }
    setError("");
    console.log("ارسال کد برای:", phoneDigits.join(""));
    setStep("code");
  };

  // Verify code input
  const handleVerifyCode = () => {
    if (!codeValid) {
      setError("کد وارد شده نامعتبر است.");
      return;
    }
    setError("");
    console.log("ورود با کد:", code.join(""));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] text-[var(--foreground)] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 space-y-8 transition">
        <h1 className="text-3xl font-extrabold text-center text-[var(--main-color)] mb-4">
          ورود به سامانه
        </h1>

        {step === "phone" && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-1">شماره موبایل</label>
            <div dir="ltr" className="flex justify-center gap-1 ">
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
                  ref={(el:any) => (phoneInputRefs.current[idx] = el)}
                  aria-label={`شماره موبایل رقم ${idx + 1}`}
                  className="w-6 lg:w-7 h-8 text-center border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              onClick={handleSendCode}
              disabled={!phoneValid}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                phoneValid ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              دریافت کد تایید
            </button>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-1">کد تایید</label>

            <div dir="ltr" className="flex flex-row items-center justify-center gap-3">
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
                  onPaste={(e) => handlePaste(e, idx)}
                  onFocus={(e) => e.currentTarget.select()}
                  ref={(el:any) => (codeInputRefs.current[idx] = el)}
                  aria-label={`کد رقم ${idx + 1}`}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Link href="/dashboard">
              <button
                onClick={handleVerifyCode}
                disabled={!codeValid}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  codeValid ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ورود به سامانه
              </button>
            </Link>

            <button
              onClick={() => {
                setStep("phone");
                setCode(Array(codeLength).fill(""));
                setError("");
              }}
              className="mt-2 text-sm text-[var(--main-color)] hover:underline cursor-pointer"
            >
              بازگشت به مرحله قبل
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
