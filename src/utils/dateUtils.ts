// Date utility functions for Persian date conversion

/**
 * Convert Gregorian date to Persian date
 * @param dateString - Date string in any format
 * @returns Persian date string
 */
export function toPersianDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error converting date to Persian:', error);
    return dateString;
  }
}

/**
 * Convert Gregorian date to Persian date with short format
 * @param dateString - Date string in any format
 * @returns Persian date string in short format
 */
export function toPersianDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error converting date to Persian short:', error);
    return dateString;
  }
}

/**
 * Convert Gregorian date to Persian date with numbers only
 * @param dateString - Date string in any format
 * @returns Persian date string with numbers only
 */
export function toPersianDateNumbers(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid date
    }
    return date.toLocaleDateString('fa-IR-u-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error converting date to Persian numbers:', error);
    return dateString;
  }
}

/**
 * Get current Persian date
 * @returns Current Persian date string
 */
export function getCurrentPersianDate(): string {
  return new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date for display with fallback
 * @param dateString - Date string to format
 * @param format - Format type ('full', 'short', 'numbers')
 * @returns Formatted Persian date string
 */
export function formatPersianDate(dateString: string, format: 'full' | 'short' | 'numbers' = 'full'): string {
  if (!dateString || dateString.trim() === '') {
    return 'نامشخص';
  }

  switch (format) {
    case 'short':
      return toPersianDateShort(dateString);
    case 'numbers':
      return toPersianDateNumbers(dateString);
    case 'full':
    default:
      return toPersianDate(dateString);
  }
}
