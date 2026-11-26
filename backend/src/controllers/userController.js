const { HttpError } = require('../errors/httpError');
const { readJsonBody } = require('../http/json');
const { toPublicProfile } = require('../services/authService');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!emailPattern.test(email)) {
    throw new HttpError(400, 'A valid email address is required.');
  }
  if (password.length < 8 || password.length > 128) {
    throw new HttpError(400, 'Password must be between 8 and 128 characters.');
  }
  return { email, password };
}

function createUserController(authService) {
  return {
    async register(request) {
      const body = await readJsonBody(request);
      const { email, password } = validateCredentials(body);
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      if (!name || name.length > 100) {
        throw new HttpError(400, 'Name must be between 1 and 100 characters.');
      }

      const user = await authService.register({ email, password, name });
      if (!user) {
        throw new HttpError(409, 'An account with this email already exists.');
      }
      return {
        statusCode: 201,
        body: { token: authService.createSession(user), user: toPublicProfile(user) },
      };
    },

    async login(request) {
      const body = await readJsonBody(request);
      const { email, password } = validateCredentials(body);
      const user = await authService.authenticate(email, password);
      if (!user) {
        throw new HttpError(401, 'Email or password is incorrect.');
      }
      return {
        statusCode: 200,
        body: { token: authService.createSession(user), user: toPublicProfile(user) },
      };
    },

    async profile(request) {
      const authorization = request.headers.authorization ?? '';
      const match = authorization.match(/^Bearer ([a-f0-9]{64})$/);
      const user = match ? await authService.getUserForToken(match[1]) : null;
      if (!user) {
        throw new HttpError(401, 'A valid bearer token is required.');
      }
      return { statusCode: 200, body: toPublicProfile(user) };
    },
  };
}

module.exports = { createUserController };
