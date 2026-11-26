const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const mongoose = require('mongoose');
const { after, before, test } = require('node:test');
const { createServer: createApiServer } = require('./src/app');
const { createOpportunityRepository } = require('./src/repositories/opportunityRepository');
const {
  scholarships: seededScholarships,
  researchOpportunities: seededResearch,
  replacedScholarshipSlugs,
  replacedResearchSlugs,
} =
  require('./src/data/opportunities');
const {
  AcademicProfile,
  Application,
  ResearchOpportunity,
  SavedOpportunity,
  Scholarship,
} = require('./src/models');
const { createAuthService, toPublicProfile } = require('./src/services/authService');

let server;
let baseUrl;

function createTestUserRepository() {
  const users = new Map();
  const academicProfiles = new Map();
  return {
    async findByEmail(email) {
      return [...users.values()].find((user) => user.email === email) ?? null;
    },
    async findById(id) {
      return users.get(id) ?? null;
    },
    async create(data, academicProfile) {
      if ([...users.values()].some((user) => user.email === data.email)) {
        return null;
      }
      const user = { id: randomUUID(), ...data };
      users.set(user.id, user);
      const savedAcademicProfile = academicProfile
        ? { user: user.id, ...academicProfile }
        : null;
      if (savedAcademicProfile) academicProfiles.set(user.id, savedAcademicProfile);
      return { user, academicProfile: savedAcademicProfile };
    },
    async findAcademicProfile(userId) {
      return academicProfiles.get(userId) ?? null;
    },
  };
}

function createTestOpportunityRepository() {
  const scholarships = [{
    _id: { toString: () => 'scholarship-id' },
    slug: 'lums-national-outreach-programme-nop',
    title: 'LUMS National Outreach Programme (NOP)',
    provider: 'Lahore University of Management Sciences (LUMS)',
    country: 'Pakistan',
    funding: 'Tuition coverage and monthly stipend',
    degreeLevels: ['Undergraduate'],
    fieldsOfStudy: [],
    eligibilityCriteria: ['Financial need assessed by the university'],
  }];
  const research = [{
    _id: { toString: () => 'research-id' },
    slug: 'demo-urdu-learning-tools-research',
    title: 'Demo: Urdu Learning Tools Research',
    institution: 'ScholarPath Demo Research Lab, Lahore',
    country: 'Pakistan',
    kind: 'University research grant',
    funding: 'Competitive grant awarded to the host university',
    topics: ['Science', 'Technology'],
    description: 'Pakistani university research teams may include graduate students.',
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
      academicProfile: {
        qualification: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        cgpa: 3.75,
        englishTest: 'IELTS',
        englishScore: '7.5',
        targetCountries: ['Germany', 'Canada'],
      },
    }),
  });
  assert.equal(registration.status, 201);
  const registrationResult = await registration.json();
  assert.deepEqual(registrationResult.user, {
    id: registrationResult.user.id,
    email: 'alex@example.com',
    name: 'Alex Morgan',
    academicProfile: {
      qualification: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
    },
  });
  assert.equal(typeof registrationResult.token, 'string');
  assert.deepEqual(registrationResult.user.academicProfile, {
    qualification: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
  });

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
  assert.deepEqual(loginResult.user.academicProfile, registrationResult.user.academicProfile);

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

  const legacyPasswordLogin = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'unknown@example.com', password: 'password' }),
  });
  assert.equal(legacyPasswordLogin.status, 401);
});

test('registration requires a strong password but login does not impose new password rules', async () => {
  const weakRegistration = await fetch(`${baseUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Weak Password',
      email: 'weak@example.com',
      password: 'password',
    }),
  });

  assert.equal(weakRegistration.status, 400);
  assert.deepEqual(await weakRegistration.json(), {
    error: 'Password must include at least one special character.',
  });

  const shortRegistration = await fetch(`${baseUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Short Password',
      email: 'short@example.com',
      password: 'Ab1!',
    }),
  });
  assert.equal(shortRegistration.status, 400);
  assert.deepEqual(await shortRegistration.json(), {
    error: 'Password must be at least 8 characters.',
  });
});

test('registration rejects academic profiles with invalid qualification types', async () => {
  const response = await fetch(`${baseUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Invalid Qualification',
      email: 'invalid-qualification@example.com',
      password: 'good-pass!',
      academicProfile: { qualification: 123 },
    }),
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: 'qualification must be a string.',
  });
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
  assert.equal(AcademicProfile.schema.path('cgpa'), undefined);
  assert.equal(AcademicProfile.schema.path('englishTest'), undefined);
  assert.equal(AcademicProfile.schema.path('englishScore'), undefined);
  assert.equal(AcademicProfile.schema.path('targetCountries'), undefined);

  const scholarship = new Scholarship({ title: 'Scholarship' });
  assert.ok(scholarship.validateSync().errors.provider);

  const research = new ResearchOpportunity({ title: 'Research project' });
  assert.ok(research.validateSync().errors.institution);
  assert.equal(ResearchOpportunity.schema.path('supervisorName'), undefined);

  const internationalScholarship = new Scholarship({
    title: 'Outside Pakistan',
    provider: 'Test provider',
    country: 'Germany',
  });
  assert.equal(internationalScholarship.validateSync().errors.country.kind, 'enum');

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

test('login sessions use MongoDB identifiers from lean user records', async () => {
  const id = new mongoose.Types.ObjectId();
  const user = { _id: id, email: 'alex@example.com', name: 'Alex' };
  const authService = createAuthService({
    async findById(userId) {
      assert.equal(userId, id.toString());
      return user;
    },
    async findAcademicProfile() {
      return null;
    },
  });

  const token = authService.createSession(user);
  assert.equal(await authService.getUserForToken(token), user);
});

test('opportunity APIs return database-backed items by slug', async () => {
  const scholarshipList = await fetch(`${baseUrl}/scholarships`);
  assert.equal(scholarshipList.status, 200);
  const scholarships = await scholarshipList.json();
  assert.equal(scholarships.length, 1);
  assert.equal(scholarships[0].id, 'scholarship-id');
  assert.equal(scholarships[0].slug, 'lums-national-outreach-programme-nop');
  assert.equal(scholarships[0].country, 'Pakistan');
  assert.equal('_id' in scholarships[0], false);

  const scholarshipDetail = await fetch(`${baseUrl}/scholarships/lums-national-outreach-programme-nop`);
  assert.equal(scholarshipDetail.status, 200);
  assert.equal((await scholarshipDetail.json()).provider, 'Lahore University of Management Sciences (LUMS)');

  const researchList = await fetch(`${baseUrl}/research`);
  assert.equal(researchList.status, 200);
  const opportunities = await researchList.json();
  assert.equal(opportunities[0].title, 'Demo: Urdu Learning Tools Research');
  assert.equal(opportunities[0].country, 'Pakistan');

  const researchDetail = await fetch(`${baseUrl}/research/demo-urdu-learning-tools-research`);
  assert.equal(researchDetail.status, 200);
  assert.equal((await researchDetail.json()).country, 'Pakistan');

  const missing = await fetch(`${baseUrl}/research/not-in-database`);
  assert.equal(missing.status, 404);
});

test('opportunity repository restricts lists and details to Pakistan', async () => {
  const filters = [];
  const model = {
    find(filter) {
      filters.push(filter);
      return {
        sort() { return this; },
        lean() { return this; },
        exec: async () => [],
      };
    },
    findOne(filter) {
      filters.push(filter);
      return {
        lean() { return this; },
        exec: async () => null,
      };
    },
  };
  const repository = createOpportunityRepository({
    ScholarshipModel: model,
    ResearchOpportunityModel: model,
  });

  await repository.listScholarships();
  await repository.findScholarship('outside-pakistan');
  await repository.listResearch();
  await repository.findResearch('outside-pakistan');

  assert.equal(filters.length, 4);
  for (const filter of filters) {
    assert.equal(filter.country.test('Pakistan'), true);
    assert.equal(filter.country.test('Germany'), false);
  }
});

test('seeded scholarship and research records are Pakistan-based', () => {
  assert.ok(seededScholarships.length > 0);
  assert.ok(seededResearch.length > 0);
  assert.ok([...seededScholarships, ...seededResearch].every(
    (opportunity) => opportunity.country === 'Pakistan',
  ));
  assert.deepEqual(seededScholarships.map(({ title }) => title), [
    'LUMS National Outreach Programme (NOP)',
    'IBA National Talent Hunt Program (NTHP)',
  ]);
  assert.equal(seededResearch.length, 2);
  assert.ok(seededResearch.every(({ title, description }) => (
    title.startsWith('Demo:') && description.includes('fictional sample listing')
  )));
  assert.ok(replacedScholarshipSlugs.includes('hec-need-based-scholarship'));
  assert.ok(replacedResearchSlugs.includes('hec-national-research-program-universities'));
});
