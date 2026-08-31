import "server-only";

import { Resend } from "resend";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

function getResendClient(): Resend {
  const apiKey =
    process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured.",
    );
  }

  return new Resend(apiKey);
}

function getFromEmail(): string {
  const from =
    process.env.RESEND_FROM_EMAIL?.trim();

  if (!from) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured.",
    );
  }

  return from;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailInput) {
  const resend =
    getResendClient();

  const result =
    await resend.emails.send({
      from:
        getFromEmail(),

      to:
        Array.isArray(to)
          ? to
          : [to],

      subject,

      html,

      ...(text
        ? {
            text,
          }
        : {}),

      ...(replyTo
        ? {
            replyTo,
          }
        : {}),
    });

  if (result.error) {
    throw new Error(
      result.error.message ||
        "Email could not be sent.",
    );
  }

  return result.data;
}