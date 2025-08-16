"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { otpLoginByMobile, acceptLoginByMobile, setRole } from "@/services/api/userService";
import { decodeJwt } from "@/services/api/auth";
import { useRouter } from "next/navigation";

export default function SignIn({ title = "ورود به سامانه" }: { title?: string }) {
  const phoneLength = 11;
  const codeLength = 6;

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(phoneLength).fill(""));
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [error, setError] = useState("");
  const [rolesToSelect, setRolesToSelect] = useState<any[] | null>(null);
  const [settingRole, setSettingRole] = useState(false);
  const router = useRouter();

  const phoneValid =
    phoneDigits.length === phoneLength &&
    phoneDigits.every((d) => /^\d$/.test(d)) &&
    phoneDigits[0] === "0" &&
    phoneDigits[1] === "9";

  // format collected digits (e.g. 09152944074) 
  const formatMobile = (digits: string[]) => {
    const raw = digits.join(""); // digits only
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

  const codeValid = code.every((d) => /^\d$/.test(d));

  useEffect(() => {
    if (step === "phone") setTimeout(() => phoneInputRefs.current[0]?.focus(), 50);
    else setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
  }, [step]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    if (!val && e.target.value !== "") return;
    const newDigits = [...phoneDigits];
    newDigits[idx] = val || "";
    setPhoneDigits(newDigits);
    if (val && idx < phoneLength - 1) phoneInputRefs.current[idx + 1]?.focus();
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
    if (val && index < codeLength - 1) codeInputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) codeInputRefs.current[index - 1]?.focus();
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
    pasted.split("").forEach((digit, i) => (newCode[index + i] = digit));
    setCode(newCode);
    const nextIndex = Math.min(index + pasted.length, codeLength - 1);
    codeInputRefs.current[nextIndex]?.focus();
  };

  const handleSendCode = async () => {
    if (!phoneValid) {
      setError("لطفا شماره موبایل معتبر وارد کنید.");
      return;
    }
    setError("");
    try {
      const mobile = formatMobile(phoneDigits);
      await otpLoginByMobile(mobile);
      setStep("code");
    } catch (err: any) {
      setError(err?.message || "خطا در ارسال کد");
    }
  };

  const handleVerifyCode = async () => {
    if (!codeValid) {
      setError("کد وارد شده نامعتبر است.");
      return;
    }
    setError("");
    try {
      const mobile = formatMobile(phoneDigits);
      const res = await acceptLoginByMobile(mobile, code.join(""));
      const token = res?.result?.token || res?.token || res?.data?.token || null;
      if (token) {
        if (typeof window !== "undefined") localStorage.setItem("authToken", token);
        const payload: any = decodeJwt(token) || {};
        const roles = payload?.roles || payload?.role || [];

        if (Array.isArray(roles) && roles.length === 1) {
          // prefer rowId as roleId when available (backend expects rowId in roleId)
          const roleToSend = roles[0]?.rowId || roles[0]?.slug || roles[0];
          setSettingRole(true);
          await setRole(roleToSend);
          setSettingRole(false);
          router.push("/dashboard");
          return;
        }

        if (Array.isArray(roles) && roles.length > 1) {
          setRolesToSelect(roles);
          return;
        }

        router.push("/dashboard");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "کد وارد شده اشتباه است");
    }
  };

  const chooseRole = async (role: any) => {
    if (!role) return;
    try {
      setSettingRole(true);
      const roleToSend = role?.rowId || role?.slug || role;
      await setRole(roleToSend);
      setSettingRole(false);
      router.push("/dashboard");
    } catch (err: any) {
      setSettingRole(false);
      setError(err?.message || "خطا در انتخاب نقش");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] text-[var(--foreground)] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 space-y-8 transition">
        <h1 className="text-3xl font-extrabold text-center text-[var(--main-color)] mb-4">{title}</h1>

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
                  ref={(el: any) => (phoneInputRefs.current[idx] = el)}
                  aria-label={`شماره موبایل رقم ${idx + 1}`}
                  className="w-6 lg:w-7 h-8 text-center border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button
              onClick={handleSendCode}
              disabled={!phoneValid}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${phoneValid ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
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
                  ref={(el: any) => (codeInputRefs.current[idx] = el)}
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
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${codeValid ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
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

        {rolesToSelect && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">انتخاب نقش</h2>
            <div className="flex flex-col gap-2">
              {rolesToSelect.map((r: any) => (
                <button
                  key={r.slug || r.rowId || r}
                  onClick={() => chooseRole(r)}
                  disabled={settingRole}
                  className="py-2 px-3 rounded-lg bg-[var(--main-color)] text-white"
                >
                  {r.slug || r}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ...existing code...
