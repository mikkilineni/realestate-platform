import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

function getPusher() {
  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_APP_KEY!,
      secret: process.env.PUSHER_APP_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherInstance;
}

export async function triggerChatEvent(
  channel: string,
  event: string,
  data: unknown
) {
  return getPusher().trigger(channel, event, data);
}

export function tenantChannel(tenantId: string) {
  return `private-tenant-${tenantId}`;
}
