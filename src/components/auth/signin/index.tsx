// "use client";
// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { otpLoginByMobile, acceptLoginByMobile, setRole } from "@/services/api/userService";
// import { decodeJwt } from "@/services/api/auth";
// import { extractToken } from "@/services/api/utils";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import { extractAndTranslateError } from "@/utils/errorTranslations";
// import { useSnackbar } from "@/hooks/useSnackbar";
// import Snackbar from "@/components/common/Snackbar";

// export default function SignIn({ title = "ورود به سامانه" }: { title?: string }) {
//   const phoneLength = 11;
//   const codeLength = 6;

//   const [step, setStep] = useState<"phone" | "code">("phone");
//   const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(phoneLength).fill(""));
//   const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
//   const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
//   const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
//   const [rolesToSelect, setRolesToSelect] = useState<any[] | null>(null);
//   const [settingRole, setSettingRole] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const router = useRouter();
//   const { login, isLoggedIn } = useAuth();

//   const { showError, snackbar, hideSnackbar } = useSnackbar();

//   const phoneValid =
//     phoneDigits.length === phoneLength &&
//     phoneDigits.every((d) => /^\d$/.test(d)) &&
//     phoneDigits[0] === "0" &&
//     phoneDigits[1] === "9";

//   // format collected digits (e.g. 09152944074) 
//   const formatMobile = (digits: string[]) => {
//     const raw = digits.join(""); // digits only
//     if (raw.startsWith("0")) {
//       return `+98${raw.replace(/^0+/, "")}`;
//     }
//     if (raw.startsWith("98")) {
//       return `+${raw}`;
//     }
//     if (raw.startsWith("9")) {
//       return `+98${raw}`;
//     }
//     return `+98${raw}`;
//   };

//   const codeValid = code.every((d) => /^\d$/.test(d));

//   useEffect(() => {
//     if (step === "phone") setTimeout(() => phoneInputRefs.current[0]?.focus(), 50);
//     else setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
//   }, [step]);

//   // Redirect to dashboard when authentication is successful
//   useEffect(() => {
//     if (isLoggedIn && !isProcessing) {
//       router.push("/dashboard");
//     }
//   }, [isLoggedIn, isProcessing, router]);

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
//     const val = e.target.value.replace(/\D/g, "").slice(-1);
//     if (!val && e.target.value !== "") return;
//     const newDigits = [...phoneDigits];
//     newDigits[idx] = val || "";
//     setPhoneDigits(newDigits);
//     if (val && idx < phoneLength - 1) phoneInputRefs.current[idx + 1]?.focus();
//   };

//   const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
//     if (e.key === "Backspace") {
//       e.preventDefault();
//       const newDigits = [...phoneDigits];
//       if (newDigits[idx]) {
//         newDigits[idx] = "";
//         setPhoneDigits(newDigits);
//       } else if (idx > 0) {
//         phoneInputRefs.current[idx - 1]?.focus();
//         const prevDigits = [...phoneDigits];
//         prevDigits[idx - 1] = "";
//         setPhoneDigits(prevDigits);
//       }
//     } else if (e.key === "Delete") {
//       e.preventDefault();
//       const newDigits = [...phoneDigits];
//       newDigits[idx] = "";
//       setPhoneDigits(newDigits);
//     } else if (e.key === "ArrowLeft" && idx > 0) {
//       e.preventDefault();
//       phoneInputRefs.current[idx - 1]?.focus();
//     } else if (e.key === "ArrowRight" && idx < phoneLength - 1) {
//       e.preventDefault();
//       phoneInputRefs.current[idx + 1]?.focus();
//     }
//   };

//   const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, phoneLength - idx);
//     if (!pasted) return;
//     const newDigits = [...phoneDigits];
//     pasted.split("").forEach((digit, i) => (newDigits[idx + i] = digit));
//     setPhoneDigits(newDigits);
//     const nextIndex = Math.min(idx + pasted.length, phoneLength - 1);
//     phoneInputRefs.current[nextIndex]?.focus();
//   };

//   const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const val = e.target.value.replace(/\D/g, "").slice(-1);
//     const newCode = [...code];
//     newCode[index] = val || "";
//     setCode(newCode);
//     if (val && index < codeLength - 1) codeInputRefs.current[index + 1]?.focus();
//   };

//   const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace") {
//       e.preventDefault();
//       if (code[index]) {
//         const newCode = [...code];
//         newCode[index] = "";
//         setCode(newCode);
//       } else if (index > 0) codeInputRefs.current[index - 1]?.focus();
//     } else if (e.key === "Delete") {
//       e.preventDefault();
//       const newCode = [...code];
//       newCode[index] = "";
//       setCode(newCode);
//     } else if (e.key === "ArrowLeft" && index > 0) {
//       e.preventDefault();
//       codeInputRefs.current[index - 1]?.focus();
//     } else if (e.key === "ArrowRight" && index < codeLength - 1) {
//       e.preventDefault();
//       codeInputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, codeLength - index);
//     if (!pasted) return;
//     const newCode = [...code];
//     pasted.split("").forEach((digit, i) => (newCode[index + i] = digit));
//     setCode(newCode);
//     const nextIndex = Math.min(index + pasted.length, codeLength - 1);
//     codeInputRefs.current[nextIndex]?.focus();
//   };

//   const handleSendCode = async () => {
//     if (!phoneValid) {
//       showError("لطفا شماره موبایل معتبر وارد کنید.");
//       return;
//     }
//     try {
//       const mobile = formatMobile(phoneDigits);
//       await otpLoginByMobile(mobile);
//       setStep("code");
//       showSuccess("کد تایید ارسال شد.");
//     } catch (err: any) {
//       // Handle specific error for unregistered mobile number
//       const errorData = err?.response?.data || err?.data || err;
//       const errorCode = errorData?.message?.code || errorData?.code;
//       const errorMsg = errorData?.message?.msg || errorData?.msg || errorData?.message;
      
//       // Log the error for debugging

      
//       if (errorCode === 1001 || errorMsg === "MOBILE_FIELD_USER_IS_DUPLICATED") {
//         showError("این شماره موبایل ثبت نام نشده است. لطفاً ابتدا ثبت نام کنید.");
//       } else {
//         // Show a more specific error message
//         const specificError = errorMsg || errorData?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
//         showError(specificError);
//       }
//     }
//   };

//   const handleVerifyCode = async () => {
//     if (!codeValid) {
//       showError("کد وارد شده نامعتبر است.");
//       return;
//     }
    
//     if (isProcessing) return;
//     setIsProcessing(true);
    
//     try {
//       const mobile = formatMobile(phoneDigits);
//       const res = await acceptLoginByMobile(mobile, code.join(""));
      
//       const token = extractToken(res);
//       if (!token) {
//         throw new Error("توکن احراز هویت دریافت نشد");
//       }

//       // Login with the token
//       login(token);
      
//       const payload: any = decodeJwt(token) || {};
//       const roles = payload?.roles || payload?.role || [];

//       if (Array.isArray(roles) && roles.length === 1) {
//         // Single role - set it automatically
//         const roleToSend = roles[0]?.rowId || roles[0]?.slug || roles[0];
//         setSettingRole(true);
        
//         try {
//           const roleResponse = await setRole(roleToSend);
          
//           // Check if setRole returned a new token and update it
//           const newToken = extractToken(roleResponse);
//           if (newToken) {
//             login(newToken);
//           }
//         } catch (roleErr: any) {
//           // Don't show error for role setting, just continue with login
//         } finally {
//           setSettingRole(false);
//         }
        
//         // Set isProcessing to false so redirect can happen
//         setIsProcessing(false);
//         return;
//       }

//       if (Array.isArray(roles) && roles.length > 1) {
//         // Multiple roles - let user choose
//         setRolesToSelect(roles);
//         setIsProcessing(false);
//         return;
//       }

//       // No roles or single role already handled
//       // Set isProcessing to false so redirect can happen
//       setIsProcessing(false);
      
//     } catch (err: any) {
//       // Handle specific error for unregistered mobile number
//       const errorData = err?.response?.data || err?.data || err;
//       const errorCode = errorData?.message?.code || errorData?.code;
//       const errorMsg = errorData?.message?.msg || errorData?.msg || errorData?.message;
      
      
//       if (errorCode === 1001 || errorMsg === "MOBILE_FIELD_USER_IS_DUPLICATED") {
//         showError("این شماره موبایل ثبت نام نشده است. لطفاً ابتدا ثبت نام کنید.");
//       } else {
//         // Show a more specific error message
//         const specificError = errorMsg || errorData?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
//         showError(specificError);
//       }
//       setIsProcessing(false);
//     }
//   };

//   const chooseRole = async (role: any) => {
//     if (!role || isProcessing) return;
    
//     setIsProcessing(true);
//     try {
//       setSettingRole(true);
//       const roleToSend = role?.rowId || role?.slug || role;
//       const roleResponse = await setRole(roleToSend);
//       setSettingRole(false);
      
//       // Check if setRole returned a new token and update it
//       const newToken = extractToken(roleResponse);
//       if (newToken) {
//         login(newToken);
//       }
      
//       // Set isProcessing to false so redirect can happen
//       setIsProcessing(false);
      
//     } catch (err: any) {
//       setSettingRole(false);
//       setIsProcessing(false);
//       showError(extractAndTranslateError(err));
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] text-[var(--foreground)] p-4">
//         <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 space-y-8 transition">
//           <h1 className="text-3xl font-extrabold text-center text-[var(--main-color)] mb-4">{title}</h1>

//           {step === "phone" && (
//             <div className="space-y-4">
//               <label className="block text-gray-700 font-medium mb-1">شماره موبایل</label>
//               <div dir="ltr" className="flex justify-center gap-1 ">
//                 {phoneDigits.map((digit, idx) => (
//                   <input
//                     key={idx}
//                     type="text"
//                     inputMode="numeric"
//                     pattern="\d*"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handlePhoneChange(e, idx)}
//                     onKeyDown={(e) => handlePhoneKeyDown(e, idx)}
//                     onPaste={(e) => handlePhonePaste(e, idx)}
//                     onFocus={(e) => e.currentTarget.select()}
//                     ref={(el: any) => (phoneInputRefs.current[idx] = el)}
//                     aria-label={`شماره موبایل رقم ${idx + 1}`}
//                     className="w-6 lg:w-7 h-8 text-center outline-none border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
//                   />
//                 ))}
//               </div>
//               <button
//                 onClick={handleSendCode}
//                 disabled={!phoneValid}
//                 className={`w-full py-3 cursor-pointer  rounded-lg text-white font-semibold transition ${
//                   phoneValid ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 دریافت کد تایید
//               </button>
//             </div>
//           )}

//           {step === "code" && (
//             <div className="space-y-4">
//               <label className="block text-gray-700 font-medium mb-1">کد تایید</label>

//               <div dir="ltr" className="flex flex-row items-center justify-center gap-3">
//                 {code.map((digit, idx) => (
//                   <input
//                     key={idx}
//                     type="text"
//                     inputMode="numeric"
//                     pattern="\d*"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleCodeChange(e, idx)}
//                     onKeyDown={(e) => handleCodeKeyDown(e, idx)}
//                     onPaste={(e) => handlePaste(e, idx)}
//                     onFocus={(e) => e.currentTarget.select()}
//                     ref={(el: any) => (codeInputRefs.current[idx] = el)}
//                     aria-label={`کد رقم ${idx + 1}`}
//                     className="w-10 h-10 lg:w-12 lg:h-12 text-center border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
//                   />
//                 ))}
//               </div>

//               <button
//                 onClick={handleVerifyCode}
//                 disabled={!codeValid || isProcessing}
//                 className={`w-full py-3 cursor-pointer rounded-lg text-white font-semibold transition ${
//                   codeValid && !isProcessing ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {isProcessing ? "در حال ورود..." : "ورود به سامانه"}
//               </button>

//               <button
//                 onClick={() => {
//                   setStep("phone");
//                   setCode(Array(codeLength).fill(""));
//                 }}
//                 disabled={isProcessing}
//                 className="mt-2 text-sm text-[var(--main-color)] hover:underline cursor-pointer disabled:opacity-50"
//               >
//                 بازگشت به مرحله قبل
//               </button>
//             </div>
//           )}

//           {rolesToSelect && (
//             <div className="space-y-4">
//               <label className="block text-gray-700 font-medium mb-1">انتخاب نقش</label>
//               <div className="space-y-2">
//                 {rolesToSelect.map((role, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => chooseRole(role)}
//                     disabled={settingRole || isProcessing}
//                     className={`w-full p-3 text-right rounded-lg border transition-all ${
//                       settingRole || isProcessing
//                         ? "bg-gray-100 cursor-not-allowed"
//                         : "bg-white hover:bg-gray-50 border-gray-300 hover:border-[var(--main-color)]"
//                     }`}
//                   >
//                     <div className="font-medium text-gray-900">
//                       {role?.name || role?.label || role?.title || `نقش ${idx + 1}`}
//                     </div>
//                     {role?.description && (
//                       <div className="text-sm text-gray-500 mt-1">{role.description}</div>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {settingRole && (
//             <div className="text-center py-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--main-color)] mx-auto mb-2"></div>
//               <p className="text-gray-600">در حال تنظیم نقش...</p>
//             </div>
//           )}

//           {/* Navigation to signup */}
//           <div className="text-center pt-4 border-t border-gray-200">
//             <p className="text-gray-600 mb-2">حساب کاربری ندارید؟</p>
//             <Link
//               href="/signup"
//               className="inline-block px-6 py-2 text-[var(--main-color)] border border-[var(--main-color)] rounded-lg hover:bg-[var(--main-color)] hover:text-white transition-colors"
//             >
//               ثبت نام کنید
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Snackbar for errors */}
//       <Snackbar
//         message={snackbar.message}
//         type={snackbar.type}
//         duration={snackbar.duration}
//         isOpen={snackbar.isOpen}
//         onClose={hideSnackbar}
//         position="top-center"
//       />
//     </>
//   );
// }
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

  const [step, setStep] = useState<"phone" | "code" | "role">("phone");
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(phoneLength).fill(""));
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const phoneInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [rolesToSelect, setRolesToSelect] = useState<any[] | null>(null);
  const [settingRole, setSettingRole] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  const { showError, showSuccess, snackbar, hideSnackbar } = useSnackbar();

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
    else if (step === "code") setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
  }, [step]);

  // Redirect to dashboard when authentication is successful and no role selection needed
  useEffect(() => {
    if (isLoggedIn && !isProcessing && step !== "role" && !rolesToSelect) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, isProcessing, router, step, rolesToSelect]);

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
      showSuccess("کد تایید ارسال شد.");
    } catch (err: any) {
      // Handle specific error for unregistered mobile number
      const errorData = err?.response?.data || err?.data || err;
      const errorCode = errorData?.message?.code || errorData?.code;
      const errorMsg = errorData?.message?.msg || errorData?.msg || errorData?.message;
      
      
      if (errorCode === 1001 || errorMsg === "MOBILE_FIELD_USER_IS_DUPLICATED") {
        showError("این شماره موبایل ثبت نام نشده است. لطفاً ابتدا ثبت نام کنید.");
      } else {
        // Show a more specific error message
        const specificError = errorMsg || errorData?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
        showError(specificError);
      }
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
      const res = await acceptLoginByMobile(mobile, code.join(""));
      
      const token = extractToken(res);
      if (!token) {
        throw new Error("توکن احراز هویت دریافت نشد");
      }

      // Login with the token
      login(token);
      
      const payload: any = decodeJwt(token) || {};
      const roles = payload?.roles || payload?.role || [];

      if (Array.isArray(roles) && roles.length === 1) {
        // Single role - set it automatically
        const roleToSend = roles[0]?.rowId || roles[0]?.slug || roles[0];
        setSettingRole(true);
        
        try {
          const roleResponse = await setRole(roleToSend);
          
          // Check if setRole returned a new token and update it
          const newToken = extractToken(roleResponse);
          if (newToken) {
            login(newToken);
          }
        } catch (roleErr: any) {
          // Don't show error for role setting, just continue with login
        } finally {
          setSettingRole(false);
        }
        
        // Set isProcessing to false so redirect can happen
        setIsProcessing(false);
        return;
      }

      if (Array.isArray(roles) && roles.length > 1) {
        // Multiple roles - let user choose
        setRolesToSelect(roles);
        setStep("role");
        setIsProcessing(false);
        return;
      }

      // No roles or single role already handled
      // Set isProcessing to false so redirect can happen
      setIsProcessing(false);
      
    } catch (err: any) {
      // Handle specific error for unregistered mobile number
      const errorData = err?.response?.data || err?.data || err;
      const errorCode = errorData?.message?.code || errorData?.code;
      const errorMsg = errorData?.message?.msg || errorData?.msg || errorData?.message;
      

      
      if (errorCode === 1001 || errorMsg === "MOBILE_FIELD_USER_IS_DUPLICATED") {
        showError("این شماره موبایل ثبت نام نشده است. لطفاً ابتدا ثبت نام کنید.");
      } else {
        // Show a more specific error message
        const specificError = errorMsg || errorData?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
        showError(specificError);
      }
      setIsProcessing(false);
    }
  };

  const chooseRole = async (role: any) => {
    if (!role || isProcessing) return;
    
    setIsProcessing(true);
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
      
      // Clear role selection after successful role setting
      setRolesToSelect(null);
      setStep("phone"); // Reset step or you can remove this line if you want to keep it on role step
      
      // Set isProcessing to false so redirect can happen
      setIsProcessing(false);
      
    } catch (err: any) {
      setSettingRole(false);
      setIsProcessing(false);
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
                    className="w-6 lg:w-7 h-8 text-center outline-none border border-gray-300 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-[var(--main-color)] transition bg-transparent"
                  />
                ))}
              </div>
              <button
                onClick={handleSendCode}
                disabled={!phoneValid}
                className={`w-full py-3 cursor-pointer  rounded-lg text-white font-semibold transition ${
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
                disabled={!codeValid || isProcessing}
                className={`w-full py-3 cursor-pointer rounded-lg text-white font-semibold transition ${
                  codeValid && !isProcessing ? "bg-[var(--main-color)] hover:bg-[var(--main-color-dark)]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? "در حال ورود..." : "ورود به سامانه"}
              </button>

              <button
                onClick={() => {
                  setStep("phone");
                  setCode(Array(codeLength).fill(""));
                }}
                disabled={isProcessing}
                className="mt-2 text-sm text-[var(--main-color)] hover:underline cursor-pointer disabled:opacity-50"
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
          disabled={settingRole || isProcessing}
          className={`w-full p-3 text-right rounded-lg border transition-all ${
            settingRole || isProcessing
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:bg-gray-50 border-gray-300 hover:border-[var(--main-color)]"
          }`}
        >
          <div className="font-medium text-gray-900">
            {role?.slug || `نقش ${idx + 1}`}
          </div>
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

          {/* Navigation to signup */}
          {step !== "role" && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600 mb-2">حساب کاربری ندارید؟</p>
              <Link
                href="/signup"
                className="inline-block px-6 py-2 text-[var(--main-color)] border border-[var(--main-color)] rounded-lg hover:bg-[var(--main-color)] hover:text-white transition-colors"
              >
                ثبت نام کنید
              </Link>
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
