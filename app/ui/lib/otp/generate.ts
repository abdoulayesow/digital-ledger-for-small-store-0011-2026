import { randomInt } from "crypto";

export const OTP_EXPIRY_MINUTES = 5;
export const MAX_ATTEMPTS = 3;

/** Generate a cryptographically random 6-digit OTP code. */
export function generateOtp(): string {
  return String(randomInt(100000, 999999));
}
