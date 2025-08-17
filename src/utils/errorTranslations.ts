// Error translation system for Persian/Farsi
export interface ErrorTranslation {
  [key: string]: string;
}

// Common error messages in Persian
export const errorTranslations: ErrorTranslation = {
  // Authentication errors
  "Invalid credentials": "نام کاربری یا رمز عبور اشتباه است",
  "User not found": "کاربر یافت نشد",
  "Invalid token": "توکن نامعتبر است",
  "Token expired": "توکن منقضی شده است",
  "Unauthorized": "دسترسی غیرمجاز",
  "Forbidden": "دسترسی ممنوع",
  "Authentication required": "احراز هویت الزامی است",
  
  // Mobile/OTP errors
  "Invalid mobile number": "شماره موبایل نامعتبر است",
  "Mobile number already exists": "شماره موبایل قبلاً ثبت شده است",
  "Invalid OTP code": "کد تایید نامعتبر است",
  "OTP expired": "کد تایید منقضی شده است",
  "OTP already used": "کد تایید قبلاً استفاده شده است",
  "Too many OTP attempts": "تعداد تلاش‌های ارسال کد بیش از حد مجاز است",
  "Please wait before requesting new OTP": "لطفاً قبل از درخواست کد جدید صبر کنید",
  
  // Validation errors
  "Phone number is required": "شماره موبایل الزامی است",
  "Phone number must be 11 digits": "شماره موبایل باید ۱۱ رقم باشد",
  "Phone number must start with 09": "شماره موبایل باید با ۰۹ شروع شود",
  "Verification code is required": "کد تایید الزامی است",
  "Verification code must be 6 digits": "کد تایید باید ۶ رقم باشد",
  "Invalid verification code": "کد تایید نامعتبر است",
  
  // Server errors
  "Internal server error": "خطای داخلی سرور",
  "Service unavailable": "سرویس در دسترس نیست",
  "Network error": "خطای شبکه",
  "Request timeout": "زمان درخواست به پایان رسید",
  "Bad request": "درخواست نامعتبر",
  "Conflict": "تضاد در داده‌ها",
  "Not found": "مورد یافت نشد",
  
  // Role/User errors
  "Role not found": "نقش یافت نشد",
  "User role already set": "نقش کاربر قبلاً تنظیم شده است",
  "Invalid role": "نقش نامعتبر است",
  "Role selection required": "انتخاب نقش الزامی است",
  "User already has role": "کاربر قبلاً دارای نقش است",
  
  // Registration errors
  "User already exists": "کاربر قبلاً وجود دارد",
  "Registration failed": "ثبت نام ناموفق بود",
  "Account creation failed": "ایجاد حساب کاربری ناموفق بود",
  
  // Generic errors
  "Something went wrong": "مشکلی پیش آمد",
  "An error occurred": "خطایی رخ داد",
  "Failed to process request": "پردازش درخواست ناموفق بود",
  "Please try again": "لطفاً دوباره تلاش کنید",
  "Please check your input": "لطفاً ورودی خود را بررسی کنید",
  
  // Custom error messages for the app
  "خطا در ارسال کد": "خطا در ارسال کد",
  "کد وارد شده اشتباه است": "کد وارد شده اشتباه است",
  "خطا در انتخاب نقش": "خطا در انتخاب نقش",
  "لطفا شماره موبایل معتبر وارد کنید.": "لطفا شماره موبایل معتبر وارد کنید.",
  "کد وارد شده نامعتبر است.": "کد وارد شده نامعتبر است",
};

// Function to translate error messages
export function translateError(error: string | null | undefined): string {
  if (!error) return "خطایی رخ داد";
  
  // Check if error is already in Persian
  if (/[\u0600-\u06FF]/.test(error)) {
    return error;
  }
  
  // Try to find translation
  const translation = errorTranslations[error];
  if (translation) {
    return translation;
  }
  
  // If no translation found, return a generic message
  return "خطایی رخ داد. لطفاً دوباره تلاش کنید";
}

// Function to extract and translate API errors
export function extractAndTranslateError(error: any): string {
  if (!error) return "خطایی رخ داد";
  
  // Handle different error formats
  let errorMessage = "";
  
  if (typeof error === "string") {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.response?.data?.error) {
    errorMessage = error.response.data.error;
  } else if (error?.response?.statusText) {
    errorMessage = error.response.statusText;
  } else {
    errorMessage = "خطایی رخ داد";
  }
  
  return translateError(errorMessage);
}

// Common error patterns for better matching
export const errorPatterns = {
  mobile: /mobile|phone|شماره|موبایل/i,
  otp: /otp|code|verification|کد|تایید/i,
  role: /role|نقش/i,
  auth: /auth|login|signin|signup|ورود|ثبت/i,
  server: /server|internal|network|timeout/i,
};

// Function to categorize errors for better UX
export function categorizeError(error: string): "mobile" | "otp" | "role" | "auth" | "server" | "general" {
  const lowerError = error.toLowerCase();
  
  if (errorPatterns.mobile.test(lowerError)) return "mobile";
  if (errorPatterns.otp.test(lowerError)) return "otp";
  if (errorPatterns.role.test(lowerError)) return "role";
  if (errorPatterns.auth.test(lowerError)) return "auth";
  if (errorPatterns.server.test(lowerError)) return "server";
  
  return "general";
} 