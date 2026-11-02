import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const frontend = fileURLToPath(new URL('../frontend/', import.meta.url));
const server = await createServer({ root: frontend, configFile: `${frontend}vite.config.ts`,
  server: { host: '127.0.0.1', port: 0, open: false } });
try {
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Browser test server did not start');
  const base = `http://127.0.0.1:${address.port}`;
  const child = spawn(process.execPath, ['scripts/check-product-browser.mjs'], {
    cwd: root, env: { ...process.env, PRODUCT_TEST_BASE_URL: base }, stdio: 'inherit',
  });
  const code = await new Promise((resolve, reject) => {
    child.once('error', reject); child.once('exit', code => resolve(code ?? 1));
  });
  process.exitCode = code;
} finally { await server.close(); }
