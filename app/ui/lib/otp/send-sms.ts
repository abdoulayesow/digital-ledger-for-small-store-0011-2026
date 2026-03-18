/**
 * Send OTP via Africa's Talking SMS API (fallback channel).
 */
export async function sendSmsOtp(
  phone: string,
  code: string
): Promise<boolean> {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME;

  if (!apiKey || !username) {
    console.error("Africa's Talking credentials not configured");
    return false;
  }

  try {
    const res = await fetch(
      "https://api.africastalking.com/version1/messaging",
      {
        method: "POST",
        headers: {
          apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          username,
          to: phone,
          message: `Déftar: ${code}`,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Africa's Talking API error:", res.status, err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("SMS send failed:", err);
    return false;
  }
}
