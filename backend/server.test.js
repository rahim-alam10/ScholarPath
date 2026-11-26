const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const mongoose = require('mongoose');
const { after, before, test } = require('node:test');
const { createServer: createApiServer } = require('./src/app');
const {
  AcademicProfile,
  Application,
  ResearchOpportunity,
  SavedOpportunity,
  Scholarship,
} = require('./src/models');
const { toPublicProfile } = require('./src/services/authService');

let server;
let baseUrl;

function createTestUserRepository() {
  const users = new Map();
  return {
    async findByEmail(email) {
      return [...users.values()].find((user) => user.email === email) ?? null;
    },
    async findById(id) {
      return users.get(id) ?? null;
    },
    async create(data) {
      if ([...users.values()].some((user) => user.email === data.email)) {
        return null;
      }
      const user = { id: randomUUID(), ...data };
      users.set(user.id, user);
      return user;
    },
  };
}

function createTestOpportunityRepository() {
  const scholarships = [{
    _id: { toString: () => 'scholarship-id' },
    slug: 'daad-master-studies-cs',
    title: 'DAAD Master Studies in Computer Science',
    provider: 'DAAD Germany',
    country: 'Germany',
    funding: 'Fully funded',
    deadline: '2026-11-15T00:00:00.000Z',
    degreeLevels: ['Master’s'],
    fieldsOfStudy: ['Computer Science'],
    eligibilityCriteria: ['Minimum CGPA 3.50'],
  }];
  const research = [{
    _id: { toString: () => 'research-id' },
    slug: 'ai-accessible-healthcare',
    title: 'AI for accessible healthcare',
    institution: 'Northbridge University',
    country: 'Germany',
    kind: 'Research assistantship',
    funding: 'Paid · €1,200 per month',
    topics: ['Machine learning', 'Health informatics'],
    deadline: '2026-12-15T00:00:00.000Z',
    description: 'Build accessible research tools.',
    supervisorName: 'Dr. Maya Chen',
  }];
  return {
    async listScholarships() {
      return scholarships;
    },
    async findScholarship(slug) {
      return scholarships.find((item) => item.slug === slug) ?? null;
    },
    async listResearch() {
      return research;
    },
    async findResearch(slug) {
      return research.find((item) => item.slug === slug) ?? null;
    },
  };
}

before(async () => {
  server = await createApiServer({
    userRepository: createTestUserRepository(),
    opportunityRepository: createTestOpportunityRepository(),
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
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

test('Mongoose models enforce core app data constraints', () => {
  const profile = new AcademicProfile({ user: new mongoose.Types.ObjectId(), cgpa: 4.5 });
  assert.equal(profile.validateSync().errors.cgpa.kind, 'max');

  const scholarship = new Scholarship({ title: 'Scholarship' });
  assert.ok(scholarship.validateSync().errors.provider);

  const research = new ResearchOpportunity({ title: 'Research project' });
  assert.ok(research.validateSync().errors.institution);

  const application = new Application({
    user: new mongoose.Types.ObjectId(),
    opportunityType: 'scholarship',
    opportunity: new mongoose.Types.ObjectId(),
    status: 'unknown',
  });
  assert.equal(application.validateSync().errors.status.kind, 'enum');

  const saved = new SavedOpportunity({
    user: new mongoose.Types.ObjectId(),
    opportunityType: 'research',
    opportunity: new mongoose.Types.ObjectId(),
  });
  assert.equal(saved.validateSync(), undefined);
});

test('public profile serializes MongoDB document identifiers', () => {
  const id = randomUUID();
  assert.deepEqual(
    toPublicProfile({ _id: { toString: () => id }, email: 'alex@example.com', name: 'Alex' }),
    { id, email: 'alex@example.com', name: 'Alex' },
  );
});

test('opportunity APIs return database-backed items by slug', async () => {
  const scholarshipList = await fetch(`${baseUrl}/scholarships`);
  assert.equal(scholarshipList.status, 200);
  const scholarships = await scholarshipList.json();
  assert.equal(scholarships.length, 1);
  assert.equal(scholarships[0].id, 'scholarship-id');
  assert.equal(scholarships[0].slug, 'daad-master-studies-cs');
  assert.equal('_id' in scholarships[0], false);

  const scholarshipDetail = await fetch(`${baseUrl}/scholarships/daad-master-studies-cs`);
  assert.equal(scholarshipDetail.status, 200);
  assert.equal((await scholarshipDetail.json()).provider, 'DAAD Germany');

  const researchList = await fetch(`${baseUrl}/research`);
  assert.equal(researchList.status, 200);
  const opportunities = await researchList.json();
  assert.equal(opportunities[0].title, 'AI for accessible healthcare');

  const researchDetail = await fetch(`${baseUrl}/research/ai-accessible-healthcare`);
  assert.equal(researchDetail.status, 200);
  assert.equal((await researchDetail.json()).supervisorName, 'Dr. Maya Chen');

  const missing = await fetch(`${baseUrl}/research/not-in-database`);
  assert.equal(missing.status, 404);
});
