const mongoose = require('mongoose');
const ResearchOpportunity = require('../models/researchOpportunity.model');
const Scholarship = require('../models/scholarship.model');

function findByIdOrSlug(Model, identifier) {
  const identifierFilter = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier.toLowerCase() };
  return Model.findOne({ ...identifierFilter, country: /^Pakistan$/i }).lean().exec();
}

function createOpportunityRepository({
  ScholarshipModel = Scholarship,
  ResearchOpportunityModel = ResearchOpportunity,
} = {}) {
  return {
    listScholarships() {
      return ScholarshipModel.find({ country: /^Pakistan$/i })
        .sort({ deadline: 1, title: 1 })
        .lean()
        .exec();
    },

    findScholarship(slug) {
      return findByIdOrSlug(ScholarshipModel, slug);
    },

    listResearch() {
      return ResearchOpportunityModel.find({ country: /^Pakistan$/i })
        .sort({ deadline: 1, title: 1 })
        .lean()
        .exec();
    },

    findResearch(slug) {
      return findByIdOrSlug(ResearchOpportunityModel, slug);
    },
  };
}

module.exports = { createOpportunityRepository };