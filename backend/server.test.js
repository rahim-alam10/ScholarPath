const assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { after, before, test } = require('node:test');
const { createServer } = require('./server');

let server;
let baseUrl;
let temporaryDirectory;

before(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'scholarpath-backend-'));
  server = await createServer({ dataFile: path.join(temporaryDirectory, 'users.json') });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await rm(temporaryDirectory, { recursive: true, force: true });
});

test('health endpoint responds successfully', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('registration, login, and authenticated profile work', async () => {
  const registration = await fetch(`${baseUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: 'secure-password',
    }),
  });
  assert.equal(registration.status, 201);
  const registrationResult = await registration.json();
  assert.deepEqual(registrationResult.user, {
    id: registrationResult.user.id,
    email: 'alex@example.com',
    name: 'Alex Morgan',
  });
  assert.equal(typeof registrationResult.token, 'string');

  const duplicate = await fetch(`${baseUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Alex Morgan',
      email: 'ALEX@example.com',
      password: 'secure-password',
    }),
  });
  assert.equal(duplicate.status, 409);

  const login = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex@example.com', password: 'secure-password' }),
  });
  assert.equal(login.status, 200);
  const loginResult = await login.json();

  const profile = await fetch(`${baseUrl}/users/me`, {
    headers: { Authorization: `Bearer ${loginResult.token}` },
  });
  assert.equal(profile.status, 200);
  assert.deepEqual(await profile.json(), registrationResult.user);
});

test('rejects invalid credentials and unauthenticated profile access', async () => {
  const login = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alex@example.com', password: 'wrong-password' }),
  });
  assert.equal(login.status, 401);

  const profile = await fetch(`${baseUrl}/users/me`);
  assert.equal(profile.status, 401);
});

test('rejects invalid request bodies with a client error', async () => {
  const response = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'null',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'Request body must be a JSON object.',
  });
});
