import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  from,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}) {
  const fromAddress = from ?? process.env.RESEND_FROM_EMAIL ?? "noreply@realestate.app";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return resend.emails.send({
    from: fromAddress,
    to,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
  } as any);
}
