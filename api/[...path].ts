import { handleApiRequest } from '../src/server/api.ts';

type VercelRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const host = Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host;
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
    res.status(400).json({ error: 'The request could not be processed.' });
  }
}
