"use client";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Auth() {
  const codeLength = 6;
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState("");

  const phoneValid = /^09\d{9}$/.test(phone.replace(/\s/g, ""));
  const codeValid = code.every((d) => /^\d$/.test(d));

  // focus first code input when entering the code step
  useEffect(() => {
    if (step === "code") {
      // small timeout to ensure inputs are mounted
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  // Masked input for phone number: 0912 345 6789
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let formatted = "";
    if (digits.length > 0) formatted += digits.slice(0, 4);
    if (digits.length > 4) formatted += " " + digits.slice(4, 7);
    if (digits.length > 7) formatted += " " + digits.slice(7, 11);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSendCode = () => {
    if (!phoneValid) {
      setError("لطفا شماره موبایل معتبر وارد کنید.");
      return;
    }
    setError("");
    console.log("ارسال کد برای:", phone.replace(/\s/g, ""));
    setStep("code");
  };

  const handleVerifyCode = () => {
    if (!codeValid) {
      setError("کد وارد شده نامعتبر است.");
      return;
    }
    setError("");
    console.log("ورود با کد:", code.join(""));
  };

  // handle typing into a specific box
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1); // keep last digit only
    const newCode = [...code];
    newCode[index] = val || "";
    setCode(newCode);

    // move focus forward if user typed a digit
    if (val && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // handle keyboard navigation / deletion
  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[index]) {
        // clear current box
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        // move to previous box if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < codeLength - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // paste into a specific input: fill forward from that index
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
    inputRefs.current[nextIndex]?.focus();
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
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[var(--main-color)] transition">
              <Phone className="mx-3 text-[var(--main-color)]" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="0915 123 4567"
                className="w-full p-3 text-right placeholder-gray-400 bg-transparent focus:outline-none"
                maxLength={13}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

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

            {/* Force LTR for the code inputs so they render left-to-right even in an RTL page */}
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
                  ref={(el:any) => (inputRefs.current[idx] = el)}
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
