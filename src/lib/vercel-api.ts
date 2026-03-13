const VERCEL_API = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

function teamQuery() {
  return TEAM_ID ? `?teamId=${TEAM_ID}` : "";
}

async function vercelFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${VERCEL_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Vercel API error");
  return data;
}

export async function addDomain(domain: string) {
  return vercelFetch(`/v10/projects/${PROJECT_ID}/domains${teamQuery()}`, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
  });
}

export async function getDomainStatus(domain: string) {
  return vercelFetch(`/v10/projects/${PROJECT_ID}/domains/${domain}${teamQuery()}`);
}

export async function removeDomain(domain: string) {
  return vercelFetch(
    `/v10/projects/${PROJECT_ID}/domains/${domain}${teamQuery()}`,
    { method: "DELETE" }
  );
}
