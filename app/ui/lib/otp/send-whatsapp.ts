/**
 * Send OTP via WhatsApp Business Cloud API using a pre-approved
 * authentication_otp message template.
 */
export async function sendWhatsAppOtp(
  phone: string,
  code: string
): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error("WhatsApp credentials not configured");
    return false;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: "authentication_otp",
            language: { code: "fr" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text: code }],
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [{ type: "text", text: code }],
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("WhatsApp API error:", res.status, err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("WhatsApp send failed:", err);
    return false;
  }
}
