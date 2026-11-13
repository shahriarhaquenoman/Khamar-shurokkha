import { handleApiRequest } from './api.ts';

export interface VercelRequestLike {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
}

export async function vercelApiHandler(req: VercelRequestLike, res: VercelResponseLike) {
  try {
    const hostHeader = req.headers.host;
    const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
    const url = new URL(req.url || '/api', `https://${host || 'localhost'}`);
    const headers = new Headers();

    for (const [name, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') headers.set(name, value);
      else if (Array.isArray(value)) headers.set(name, value.join(','));
    }

    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const result = await handleApiRequest(req.method || 'GET', url, headers, body);
    res.setHeader('Cache-Control', 'no-store');
    res.status(result.status).json(result.body);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(400).json({ error: 'The request could not be processed.' });
  }
}
