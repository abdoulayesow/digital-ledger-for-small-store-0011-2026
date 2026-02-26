const GUINEA_CODE = "+224";
const PHONE_LENGTH = 9; // 9-digit local number after country code

/**
 * Normalize a phone number input to +224XXXXXXXXX format.
 * Accepts: "622123456", "+224622123456", "00224622123456", "622 12 34 56"
 * Returns null if invalid.
 */
export function parsePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  let local: string;
  if (digits.startsWith("224") && digits.length === 12) {
    local = digits.slice(3);
  } else if (digits.startsWith("00224") && digits.length === 14) {
    local = digits.slice(5);
  } else if (digits.length === PHONE_LENGTH) {
    local = digits;
  } else {
    return null;
  }

  if (!validateLocalNumber(local)) return null;
  return `${GUINEA_CODE}${local}`;
}

/**
 * Validate a full +224 phone number.
 */
export function validatePhone(phone: string): boolean {
  return parsePhone(phone) !== null;
}

/**
 * Format a +224 number for display: +224 6XX XX XX XX
 */
export function formatPhone(phone: string): string {
  const parsed = parsePhone(phone);
  if (!parsed) return phone;
  const local = parsed.slice(4);
  return `${GUINEA_CODE} ${local.slice(0, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
}

/**
 * Validate a 9-digit local Guinea number.
 * Guinea mobile numbers start with 6.
 */
function validateLocalNumber(local: string): boolean {
  return local.length === PHONE_LENGTH && /^[6]\d{8}$/.test(local);
}
