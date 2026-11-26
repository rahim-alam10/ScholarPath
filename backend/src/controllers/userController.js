const { HttpError } = require('../errors/httpError');
const { readJsonBody } = require('../http/json');
const { toPublicProfile } = require('../services/authService');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const specialCharacterPattern = /[^A-Za-z0-9\s]/;

function validateAcademicProfile(value) {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'Academic profile must be a JSON object.');
  }

  const stringFields = {
    qualification: 100,
    fieldOfStudy: 150,
  };
  const academicProfile = {};
  for (const [field, maxLength] of Object.entries(stringFields)) {
    if (value[field] !== undefined && typeof value[field] !== 'string') {
      throw new HttpError(400, `${field} must be a string.`);
    }
    const fieldValue = typeof value[field] === 'string' ? value[field].trim() : '';
    if (fieldValue.length > maxLength) {
      throw new HttpError(400, `${field} must be ${maxLength} characters or fewer.`);
    }
    academicProfile[field] = fieldValue;
  }

  return {
    ...academicProfile,
  };
}

function validateCredentials(body, { registration = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!emailPattern.test(email)) {
    throw new HttpError(400, 'A valid email address is required.');
  }
  if (!password || password.length > 128) {
    throw new HttpError(400, 'Password is required and must be 128 characters or fewer.');
  }
  if (registration && password.length < 8) {
    throw new HttpError(400, 'Password must be at least 8 characters.');
  }
  if (registration && !specialCharacterPattern.test(password)) {
    throw new HttpError(400, 'Password must include at least one special character.');
  }
  return { email, password };
}

function createUserController(authService) {
  return {
    async register(request) {
      const body = await readJsonBody(request);
      const { email, password } = validateCredentials(body, { registration: true });
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      if (!name || name.length > 100) {
        throw new HttpError(400, 'Name must be between 1 and 100 characters.');
      }
      const academicProfile = validateAcademicProfile(body.academicProfile);

      const account = await authService.register({ email, password, name, academicProfile });
      if (!account) {
        throw new HttpError(409, 'An account with this email already exists.');
      }
      return {
        statusCode: 201,
        body: {
          token: authService.createSession(account.user),
          user: toPublicProfile(account.user, account.academicProfile),
        },
      };
    },

    async login(request) {
      const body = await readJsonBody(request);
      const { email, password } = validateCredentials(body);
      const user = await authService.authenticate(email, password);
      if (!user) {
        throw new HttpError(401, 'Email or password is incorrect.');
      }
      const academicProfile = await authService.getAcademicProfile(user);
      return {
        statusCode: 200,
        body: {
          token: authService.createSession(user),
          user: toPublicProfile(user, academicProfile),
        },
      };
    },

    async profile(request) {
      const authorization = request.headers.authorization ?? '';
      const match = authorization.match(/^Bearer ([a-f0-9]{64})$/);
      const user = match ? await authService.getUserForToken(match[1]) : null;
      if (!user) {
        throw new HttpError(401, 'A valid bearer token is required.');
      }
      const academicProfile = await authService.getAcademicProfile(user);
      return {
        statusCode: 200,
        body: toPublicProfile(user, academicProfile),
      };
    },
  };
}

module.exports = { createUserController };
