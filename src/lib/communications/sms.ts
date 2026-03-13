import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS({
  to,
  from,
  body,
}: {
  to: string;
  from: string;
  body: string;
}) {
  return client.messages.create({ to, from, body });
}
