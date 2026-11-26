const { randomBytes, scrypt, timingSafeEqual, randomUUID } = require('node:crypto');
const { createServer: createHttpServer } = require('node:http');
const { mkdir, readFile, rename, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { promisify } = require('node:util');

const scryptAsync = promisify(scrypt);
const MAX_BODY_BYTES = 16 * 1024;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function createServer({
  dataFile = path.join(__dirname, 'data', 'users.json'),
} = {}) {
  let users = [];
  const sessions = new Map();
  let mutationQueue = Promise.resolve();

  try {
    users = JSON.parse(await readFile(dataFile, 'utf8'));
    if (!Array.isArray(users)) {
      throw new Error('User data must be a JSON array.');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  function saveUsers() {
    return mkdir(path.dirname(dataFile), { recursive: true })
      .then(() => {
        const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
        return writeFile(temporaryFile, JSON.stringify(users, null, 2), { mode: 0o600 })
          .then(() => rename(temporaryFile, dataFile));
      });
  }

  function serializeMutation(operation) {
    const result = mutationQueue.then(operation);
    mutationQueue = result.then(() => undefined, () => undefined);
    return result;
  }

  async function readJsonBody(request) {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        const error = new Error('Request body is too large.');
        error.statusCode = 413;
        throw error;
      }
    }

    try {
      return JSON.parse(body);
    } catch {
      const error = new Error('Request body must be valid JSON.');
      error.statusCode = 400;
      throw error;
    }
  }

  function send(response, statusCode, payload) {
    response.writeHead(statusCode, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(JSON.stringify(payload));
  }

  async function createAccount(email, password, name) {
    return serializeMutation(async () => {
      if (users.some((user) => user.email === email)) {
        const error = new Error('An account with this email already exists.');
        error.statusCode = 409;
        throw error;
      }

      const salt = randomBytes(16).toString('hex');
      const passwordHash = (await scryptAsync(password, salt, 64)).toString('hex');
      const user = {
        id: randomUUID(),
        email,
        name: name.trim(),
        salt,
        passwordHash,
      };
      users.push(user);
      await saveUsers();
      return user;
    });
  }

  async function authenticate(email, password) {
    const user = users.find((candidate) => candidate.email === email);
    if (!user) {
      return null;
    }

    const passwordHash = await scryptAsync(password, user.salt, 64);
    const storedHash = Buffer.from(user.passwordHash, 'hex');
    return storedHash.length === passwordHash.length
      && timingSafeEqual(storedHash, passwordHash)
      ? user
      : null;
  }

  function issueSession(user) {
    const token = randomBytes(32).toString('hex');
    sessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + TOKEN_TTL_MS,
    });
    return token;
  }

  function publicProfile(user) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const server = createHttpServer(async (request, response) => {
    if (request.method === 'OPTIONS') {
      send(response, 204, {});
      return;
    }

    const url = new URL(request.url, 'http://localhost');
    try {
      if (request.method === 'GET' && url.pathname === '/health') {
        send(response, 200, { status: 'ok' });
        return;
      }

      if (
        request.method === 'POST'
        && (url.pathname === '/users/register' || url.pathname === '/users/login')
      ) {
        const body = await readJsonBody(request);
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body.password === 'string' ? body.password : '';

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          send(response, 400, { error: 'A valid email address is required.' });
          return;
        }
        if (password.length < 8 || password.length > 128) {
          send(response, 400, { error: 'Password must be between 8 and 128 characters.' });
          return;
        }

        let user;
        let statusCode = 200;
        if (url.pathname === '/users/register') {
          const name = typeof body.name === 'string' ? body.name.trim() : '';
          if (!name || name.length > 100) {
            send(response, 400, { error: 'Name must be between 1 and 100 characters.' });
            return;
          }
          user = await createAccount(email, password, name);
          statusCode = 201;
        } else {
          user = await authenticate(email, password);
          if (!user) {
            send(response, 401, { error: 'Email or password is incorrect.' });
            return;
          }
        }

        send(response, statusCode, { token: issueSession(user), user: publicProfile(user) });
        return;
      }

      if (request.method === 'GET' && url.pathname === '/users/me') {
        const authorization = request.headers.authorization ?? '';
        const match = authorization.match(/^Bearer ([a-f0-9]{64})$/);
        const session = match ? sessions.get(match[1]) : null;
        if (!session || session.expiresAt <= Date.now()) {
          if (match) sessions.delete(match[1]);
          send(response, 401, { error: 'A valid bearer token is required.' });
          return;
        }

        const user = users.find((candidate) => candidate.id === session.userId);
        if (!user) {
          send(response, 401, { error: 'A valid bearer token is required.' });
          return;
        }
        send(response, 200, publicProfile(user));
        return;
      }

      send(response, 404, { error: 'Route not found.' });
    } catch (error) {
      send(response, error.statusCode ?? 500, {
        error: error.statusCode ? error.message : 'Internal server error.',
      });
    }
  });

  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  createServer()
    .then((server) => {
      server.listen(port, '0.0.0.0', () => {
        console.log(`ScholarPath API listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start ScholarPath API:', error);
      process.exitCode = 1;
    });
}

module.exports = { createServer };
