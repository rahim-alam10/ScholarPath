function createRoutes(userController, opportunityController) {
  return [
    { method: 'GET', pattern: /^\/health$/, handler: () => ({ statusCode: 200, body: { status: 'ok' } }) },
    { method: 'POST', pattern: /^\/users\/register$/, handler: userController.register },
    { method: 'POST', pattern: /^\/users\/login$/, handler: userController.login },
    { method: 'GET', pattern: /^\/users\/me$/, handler: userController.profile },
    { method: 'GET', pattern: /^\/scholarships$/, handler: opportunityController.listScholarships },
    { method: 'GET', pattern: /^\/scholarships\/([^/]+)$/, handler: opportunityController.getScholarship },
    { method: 'GET', pattern: /^\/research$/, handler: opportunityController.listResearch },
    { method: 'GET', pattern: /^\/research\/([^/]+)$/, handler: opportunityController.getResearch },
  ];
}

module.exports = { createRoutes };
