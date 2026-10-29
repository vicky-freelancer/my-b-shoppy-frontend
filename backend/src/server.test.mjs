import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

test('payment validation and production routing', async () => {
  const port = 15000 + Math.floor(Math.random() * 10000);
  const secret = 'local-test-secret';
  const server = spawn(process.execPath, [fileURLToPath(new URL('./server.mjs', import.meta.url))], {
    env: { ...process.env, PORT: String(port), RAZORPAY_KEY_ID: 'rzp_test_local', RAZORPAY_KEY_SECRET: secret },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    await Promise.race([
      new Promise((resolve) => server.stdout.on('data', (data) => {
        if (data.toString().includes('server running')) resolve();
      })),
      once(server, 'exit').then(() => { throw new Error('Server exited before startup'); }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Startup timed out')), 10000).unref()),
    ]);
    const base = `http://127.0.0.1:${port}`;
    const post = (route, body) => fetch(`${base}/api/${route}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    assert.equal((await (await fetch(`${base}/api/health`)).json()).mode, 'TEST');
    for (const amount of [0, -100, 99, 100.5, '100', null]) {
      assert.equal((await post('create-order', { amount })).status, 400);
    }
    assert.equal((await post('create-order', { amount: 100, currency: 'USD' })).status, 400);
    const payment = { razorpay_order_id: 'order_local', razorpay_payment_id: 'pay_local' };
    const signature = crypto.createHmac('sha256', secret).update('order_local|pay_local').digest('hex');
    assert.equal((await post('verify-payment', { ...payment, razorpay_signature: signature })).status, 200);
    assert.equal((await post('verify-payment', { ...payment, razorpay_signature: 'invalid' })).status, 400);
    assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
  } finally {
    server.kill();
    await once(server, 'exit');
  }
});
