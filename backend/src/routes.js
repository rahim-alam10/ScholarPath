function createRoutes(userController) {
  return new Map([
    ['GET /health', () => ({ statusCode: 200, body: { status: 'ok' } })],
    ['POST /users/register', userController.register],
    ['POST /users/login', userController.login],
    ['GET /users/me', userController.profile],
  ]);
}

module.exports = { createRoutes };
