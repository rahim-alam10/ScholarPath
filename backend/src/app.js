const { createServer: createHttpServer } = require('node:http');
const { dataFile: defaultDataFile } = require('./config');
const { createUserController } = require('./controllers/userController');
const { sendJson } = require('./http/json');
const { createUserRepository } = require('./repositories/userRepository');
const { createRoutes } = require('./routes');
const { createAuthService } = require('./services/authService');
const { HttpError } = require('./errors/httpError');

async function createServer({ dataFile = defaultDataFile } = {}) {
  const userRepository = await createUserRepository(dataFile);
  const authService = createAuthService(userRepository);
  const routes = createRoutes(createUserController(authService));

  return createHttpServer(async (request, response) => {
    if (request.method === 'OPTIONS') {
      sendJson(response, 204, {});
      return;
    }

    try {
      const url = new URL(request.url, 'http://localhost');
      const handler = routes.get(`${request.method} ${url.pathname}`);
      if (!handler) {
        sendJson(response, 404, { error: 'Route not found.' });
        return;
      }

      const result = await handler(request);
      sendJson(response, result.statusCode, result.body);
    } catch (error) {
      if (!(error instanceof HttpError)) {
        console.error('Unhandled API request error:', error);
      }
      sendJson(response, error.statusCode ?? 500, {
        error: error.statusCode ? error.message : 'Internal server error.',
      });
    }
  });
}

module.exports = { createServer };
