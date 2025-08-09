"use client";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function Auth() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const codeLength = 6;
  const codeInputs = Array.from({ length: codeLength });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState("");

  const phoneValid = /^09\d{9}$/.test(phone.replace(/\s/g, ""));
  const codeValid = /^\d{4,6}$/.test(code);

  // Masked input for phone number: 0912 345 6789
  const formatPhone = (value: string) => {
    // Keep only digits, max 11 characters
    let digits = value.replace(/\D/g, "").slice(0, 11);

    let formatted = "";
    if (digits.length > 0) {
      formatted += digits.slice(0, 4); // 0912
    }
    if (digits.length > 4) {
      formatted += " " + digits.slice(4, 7); // 345
    }
    if (digits.length > 7) {
      formatted += " " + digits.slice(7, 11); // 6789
    }

    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always format and set the value
    setPhone(formatPhone(e.target.value));
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
    console.log("ورود با کد:", code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] text-[var(--foreground)] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 space-y-8 transition">
        <h1 className="text-3xl font-extrabold text-center text-[var(--main-color)] mb-4">
          ورود به سامانه
        </h1>

        {step === "phone" && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-1">
              شماره موبایل
            </label>
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
              className={`w-full py-3 rounded-lg text-white font-semibold transition
                ${phoneValid
                  ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]"
                  : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              دریافت کد تایید
            </button>
          </div>
        )}

        {step === "code" && (
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-1">
              کد تایید
            </label>
            <div className="flex items-center justify-center gap-2">
              {codeInputs.map((_, idx) => {
                // RTL: show code from right to left
                const rtlIdx = codeLength - 1 - idx;
                return (
                  <input
                    dir="rtl"
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[rtlIdx] || ""}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (!val) return;
                      let newCode = code.padStart(codeLength, "").split("");
                      newCode[rtlIdx] = val[val.length - 1];
                      const joined = newCode.join("").slice(-codeLength);
                      setCode(joined.trimStart());
                      if (val && idx > 0) {
                        inputRefs.current[idx - 1]?.focus();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Backspace") {
                        let newCode = code.padStart(codeLength, "").split("");
                        if (newCode[rtlIdx]) {
                          newCode[rtlIdx] = "";
                          setCode(newCode.join("").trimStart());
                        } else if (idx < codeLength - 1) {
                          inputRefs.current[idx + 1]?.focus();
                        }
                      }
                    }}
                    ref={el => { inputRefs.current[idx] = el; }}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                    style={{ direction: "ltr" }}
                  />
                );
              })}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Link href={'/dashboard'}>
              <button
                onClick={handleVerifyCode}
                disabled={!codeValid}
                className={`w-full py-3 cursor-pointer rounded-lg text-white font-semibold transition
                  ${codeValid
                    ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]"
                    : "bg-gray-400 cursor-not-allowed]"
                  }`}
              >
                ورود به سامانه
              </button>
            </Link>
            <button
              onClick={() => {
                setStep("phone");
                setCode("");
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
