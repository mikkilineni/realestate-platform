import { prisma } from "@/lib/prisma";
import { MessageChannel, MessageDirection } from "@prisma/client";
import { triggerChatEvent, tenantChannel } from "./chat";

export async function upsertConversation({
  tenantId,
  leadId,
  externalEmail,
  externalPhone,
}: {
  tenantId: string;
  leadId?: string;
  externalEmail?: string;
  externalPhone?: string;
}) {
  if (leadId) {
    return prisma.conversation.upsert({
      where: { leadId },
      create: { tenantId, leadId, externalEmail, externalPhone },
      update: { externalEmail, externalPhone },
    });
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      tenantId,
      OR: [
        externalEmail ? { externalEmail } : {},
        externalPhone ? { externalPhone } : {},
      ].filter((o) => Object.keys(o).length > 0),
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: { tenantId, externalEmail, externalPhone },
  });
}

export async function saveMessage({
  conversationId,
  tenantId,
  channel,
  direction,
  body,
  subject,
  externalId,
}: {
  conversationId: string;
  tenantId: string;
  channel: MessageChannel;
  direction: MessageDirection;
  body: string;
  subject?: string;
  externalId?: string;
}) {
  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, channel, direction, body, subject, externalId },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  // Notify agent dashboard via Pusher
  try {
    await triggerChatEvent(
      tenantChannel(tenantId),
      "new-message",
      { conversationId, channel, direction, body }
    );
  } catch {
    // Non-fatal
  }

  return message;
}
