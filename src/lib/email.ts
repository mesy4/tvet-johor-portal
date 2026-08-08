"use server";

import nodemailer from "nodemailer";
import type { TransportOptions } from "nodemailer";

// ── SMTP Transporter (configured via env vars) ──────────────────
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    // Fall back to a JSON-based transport that logs to console (dev mode)
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[email] SMTP not configured — emails will be logged to console instead."
      );
      return nodemailer.createTransport({
        jsonTransport: true,
      } as TransportOptions);
    }
    throw new Error("SMTP configuration is missing. Check .env variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ── Send Verification Email ─────────────────────────────────────
export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const baseUrl =
    process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`;

  const transport = getTransporter();
  const from =
    process.env.EMAIL_FROM ?? "noreply@tvet-johor.gov.my";

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#1a2a4a;">
      <div style="background:#0a1f3f;padding:24px;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="color:#d4a843;margin:0;font-size:22px;">Sekretariat TVET Negeri Johor</h1>
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <h2 style="color:#0a1f3f;margin-top:0;">Sahkan Emel Anda</h2>
        <p style="line-height:1.6;">Salam sejahtera <strong>${name}</strong>,</p>
        <p style="line-height:1.6;">
          Terima kasih kerana mendaftar di Portal Sekretariat TVET Negeri Johor.
          Sila klik butang di bawah untuk mengesahkan alamat emel anda:
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${verifyUrl}"
             style="background:#c41e2c;color:#fff;padding:14px 36px;border-radius:8px;
                    text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
            Sahkan Emel
          </a>
        </div>
        <p style="line-height:1.6;color:#6b7280;font-size:14px;">
          Atau salin pautan ini ke pelayar anda:<br/>
          <a href="${verifyUrl}" style="color:#0a1f3f;word-break:break-all;">${verifyUrl}</a>
        </p>
        <p style="line-height:1.6;color:#6b7280;font-size:14px;">
          Pautan ini akan tamat dalam tempoh <strong>24 jam</strong>.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          Jika anda tidak mendaftar akaun ini, sila abaikan emel ini.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transport.sendMail({ from, to, subject: "Sahkan Emel — Portal Sekretariat TVET Negeri Johor", html });
    // jsonTransport logs the email content to console in dev
    if (typeof info === "object" && info !== null && "message" in info) {
      console.log("[email] Verification email content:", (info as unknown as { message: string }).message);
    }
    console.log(`[email] Verification email sent to ${to}`);
  } catch (err) {
    console.error("[email] Failed to send verification email:", err);
    // Don't throw — registration should still succeed even if email fails
  }
}