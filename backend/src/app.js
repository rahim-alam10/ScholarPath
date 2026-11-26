const { createServer: createHttpServer } = require('node:http');
const { createUserController } = require('./controllers/userController');
const { createOpportunityController } = require('./controllers/opportunityController');
const { sendJson } = require('./http/json');
const { createUserRepository } = require('./repositories/userRepository');
const { createOpportunityRepository } = require('./repositories/opportunityRepository');
const { createRoutes } = require('./routes');
const { createAuthService } = require('./services/authService');
const { HttpError } = require('./errors/httpError');

async function createServer({
  userRepository = createUserRepository(),
  opportunityRepository = createOpportunityRepository(),
} = {}) {
  const authService = createAuthService(userRepository);
  const routes = createRoutes(
    createUserController(authService),
    createOpportunityController(opportunityRepository),
  );

  return createHttpServer(async (request, response) => {
    if (request.method === 'OPTIONS') {
      sendJson(response, 204, {});
      return;
    }

    try {
      const url = new URL(request.url, 'http://localhost');
      const route = routes
        .filter((candidate) => candidate.method === request.method)
        .map((candidate) => ({ ...candidate, match: candidate.pattern.exec(url.pathname) }))
        .find((candidate) => candidate.match);
      if (!route) {
        sendJson(response, 404, { error: 'Route not found.' });
        return;
      }

      const identifier = route.match[1] ? decodeURIComponent(route.match[1]) : undefined;
      const result = await route.handler(request, identifier);
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
