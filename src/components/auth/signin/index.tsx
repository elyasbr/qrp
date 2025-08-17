"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { otpLoginByMobile, acceptLoginByMobile, setRole } from "@/services/api/userService";
import { decodeJwt } from "@/services/api/auth";
import { extractToken } from "@/services/api/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { extractAndTranslateError } from "@/utils/errorTranslations";
import { useSnackbar } from "@/hooks/useSnackbar";
import Snackbar from "@/components/common/Snackbar";

export default function SignIn({ title = "ورود به سامانه" }: { title?: string }) {
  const phoneLength = 11;
  const codeLength = 6;

  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(phoneLength).fill(""));
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [rolesToSelect, setRolesToSelect] = useState<any[] | null>(null);
  const [settingRole, setSettingRole] = useState(false);
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  // Helper function to wait for authentication to complete
  const waitForAuth = async (maxAttempts = 10) => {
    console.log('waitForAuth: Starting to wait for authentication...');
    for (let i = 0; i < maxAttempts; i++) {
      console.log(`waitForAuth: Attempt ${i + 1}, isLoggedIn: ${isLoggedIn}`);
      if (isLoggedIn) {
        console.log('waitForAuth: Authentication successful!');
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('waitForAuth: Authentication timeout, returning false');
    return false;
  };
  const { showError, snackbar, hideSnackbar } = useSnackbar();

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
      showError("لطفا شماره موبایل معتبر وارد کنید.");
      return;
    }
    try {
      const mobile = formatMobile(phoneDigits);
      await otpLoginByMobile(mobile);
      setStep("code");
    } catch (err: any) {
      showError(extractAndTranslateError(err));
    }
  };

  const handleVerifyCode = async () => {
    if (!codeValid) {
      showError("کد وارد شده نامعتبر است.");
      return;
    }
    try {
      const mobile = formatMobile(phoneDigits);
      const res = await acceptLoginByMobile(mobile, code.join(""));
      console.log('Login response:', res);
      const token = extractToken(res);
      console.log('Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');
      if (token) {
        // Use the login function from useAuth hook
        console.log('Calling login with token...');
        login(token);
        console.log('Login called, checking auth status...');
        
        // Debug: Check if token is stored in localStorage
        setTimeout(() => {
          const storedToken = localStorage.getItem('authToken');
          console.log('Stored token in localStorage:', storedToken ? storedToken.substring(0, 20) + '...' : 'No token');
        }, 200);
        const payload: any = decodeJwt(token) || {};
        const roles = payload?.roles || payload?.role || [];

        if (Array.isArray(roles) && roles.length === 1) {
          // prefer rowId as roleId when available (backend expects rowId in roleId)
          const roleToSend = roles[0]?.rowId || roles[0]?.slug || roles[0];
          setSettingRole(true);
          const roleResponse = await setRole(roleToSend);
          setSettingRole(false);
          
          // Check if setRole returned a new token and update it
          const newToken = extractToken(roleResponse);
          if (newToken) {
            login(newToken);
          }
          
          // Wait for authentication to complete
          const authComplete = await waitForAuth();
          if (authComplete) {
            router.push("/dashboard");
          } else {
            showError("خطا در احراز هویت. لطفاً دوباره تلاش کنید.");
          }
          return;
        }

        if (Array.isArray(roles) && roles.length > 1) {
          setRolesToSelect(roles);
          return;
        }

        // Wait for authentication to complete
        const authComplete = await waitForAuth();
        if (authComplete) {
          router.push("/dashboard");
        } else {
          showError("خطا در احراز هویت. لطفاً دوباره تلاش کنید.");
        }
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      showError(extractAndTranslateError(err));
    }
  };

  const chooseRole = async (role: any) => {
    if (!role) return;
    try {
      setSettingRole(true);
      const roleToSend = role?.rowId || role?.slug || role;
      const roleResponse = await setRole(roleToSend);
      setSettingRole(false);
      
      // Check if setRole returned a new token and update it
      const newToken = extractToken(roleResponse);
      if (newToken) {
        login(newToken);
      }
      
      // Wait for authentication to complete
      const authComplete = await waitForAuth();
      if (authComplete) {
        router.push("/dashboard");
      } else {
        showError("خطا در احراز هویت. لطفاً دوباره تلاش کنید.");
      }
    } catch (err: any) {
      setSettingRole(false);
      showError(extractAndTranslateError(err));
    }
  };

  return (
    <>
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
                    ref={(el: any) => (codeInputRefs.current[idx] = el)}
                    aria-label={`کد رقم ${idx + 1}`}
                    className="w-10 h-10 lg:w-12 lg:h-12 text-center border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={!codeValid}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  codeValid ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                ورود به سامانه
              </button>

              <button
                onClick={() => {
                  setStep("phone");
                  setCode(Array(codeLength).fill(""));
                }}
                className="mt-2 text-sm text-[var(--main-color)] hover:underline cursor-pointer"
              >
                بازگشت به مرحله قبل
              </button>
            </div>
          )}

          {rolesToSelect && (
            <div className="space-y-4">
              <label className="block text-gray-700 font-medium mb-1">انتخاب نقش</label>
              <div className="space-y-2">
                {rolesToSelect.map((role, idx) => (
                  <button
                    key={idx}
                    onClick={() => chooseRole(role)}
                    disabled={settingRole}
                    className={`w-full p-3 text-right rounded-lg border transition-all ${
                      settingRole
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white hover:bg-gray-50 border-gray-300 hover:border-[var(--main-color)]"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {role?.name || role?.label || role?.title || `نقش ${idx + 1}`}
                    </div>
                    {role?.description && (
                      <div className="text-sm text-gray-500 mt-1">{role.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {settingRole && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--main-color)] mx-auto mb-2"></div>
              <p className="text-gray-600">در حال تنظیم نقش...</p>
            </div>
          )}
        </div>
      </div>

      {/* Snackbar for errors */}
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
