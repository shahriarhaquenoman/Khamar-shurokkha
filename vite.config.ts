import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { handleApiRequest } from './src/server/api.ts';

const apiPlugin: Plugin = {
  name: 'khamar-server-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url || '/', 'http://localhost');
      if (!url.pathname.startsWith('/api/')) return next();

      try {
        const chunks: Buffer[] = [];
        let size = 0;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          for await (const chunk of req) {
            const buffer = Buffer.from(chunk);
            size += buffer.length;
            if (size > 4_200_000) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'Request is too large.' }));
              return;
            }
            chunks.push(buffer);
          }
        }

        const rawBody = Buffer.concat(chunks).toString('utf8');
        const body = rawBody ? JSON.parse(rawBody) : undefined;
        const headers = new Headers();
        for (const [name, value] of Object.entries(req.headers)) {
          if (typeof value === 'string') headers.set(name, value);
          else if (Array.isArray(value)) headers.set(name, value.join(','));
        }

        const result = await handleApiRequest(req.method || 'GET', url, headers, body);
        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify(result.body));
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'The request could not be processed.' }));
      }
    });
  },
};

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, environment);

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [react(), tailwindcss(), apiPlugin],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
