const { HttpError } = require('../errors/httpError');

function serializeOpportunity(opportunity) {
  const { _id, __v, ...fields } = opportunity;
  return {
    ...fields,
    id: _id.toString(),
    ...(Array.isArray(fields.topics) ? {} : { topics: [] }),
    ...(Array.isArray(fields.degreeLevels) ? {} : { degreeLevels: [] }),
    ...(Array.isArray(fields.fieldsOfStudy) ? {} : { fieldsOfStudy: [] }),
    ...(Array.isArray(fields.eligibilityCriteria) ? {} : { eligibilityCriteria: [] }),
  };
}

function createOpportunityController(opportunityRepository) {
  return {
    async listScholarships() {
      const scholarships = await opportunityRepository.listScholarships();
      return {
        statusCode: 200,
        body: scholarships.map(serializeOpportunity),
      };
    },

    async getScholarship(_request, slug) {
      const scholarship = await opportunityRepository.findScholarship(slug);
      if (!scholarship) {
        throw new HttpError(404, 'Scholarship not found.');
      }
      return { statusCode: 200, body: serializeOpportunity(scholarship) };
    },

    async listResearch() {
      const opportunities = await opportunityRepository.listResearch();
      return {
        statusCode: 200,
        body: opportunities.map(serializeOpportunity),
      };
    },

    async getResearch(_request, slug) {
      const opportunity = await opportunityRepository.findResearch(slug);
      if (!opportunity) {
        throw new HttpError(404, 'Research opportunity not found.');
      }
      return { statusCode: 200, body: serializeOpportunity(opportunity) };
    },
  };
}

module.exports = { createOpportunityController };