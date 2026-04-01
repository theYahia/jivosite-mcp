const BASE_URL = process.env.JIVOSITE_BASE_URL || "https://api.jivosite.com/v1";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

function getToken(): string {
  const token = process.env.JIVOSITE_TOKEN;
  if (!token) throw new Error("JIVOSITE_TOKEN не задан");
  return token;
}

export async function jivoGet(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const token = getToken();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    const query = new URLSearchParams(params);
    const url = `${BASE_URL}/${path}${query.toString() ? `?${query.toString()}` : ""}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        return await response.json();
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[jivosite-mcp] ${response.status}, retry in ${delay}ms (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw new Error(`JivoSite HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[jivosite-mcp] Timeout, retry (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("JivoSite API: all retries exhausted");
}

export async function jivoPost(path: string, body: Record<string, unknown> = {}): Promise<unknown> {
  const token = getToken();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    const url = `${BASE_URL}/${path}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        return await response.json();
      }

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw new Error(`JivoSite HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("JivoSite API POST: all retries exhausted");
}

export async function jivoDelete(path: string): Promise<unknown> {
  const token = getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  const url = `${BASE_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (response.ok) {
      const text = await response.text();
      return text ? JSON.parse(text) : { success: true };
    }
    throw new Error(`JivoSite DELETE HTTP ${response.status}: ${response.statusText}`);
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}
