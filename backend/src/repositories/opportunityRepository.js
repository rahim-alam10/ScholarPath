const mongoose = require('mongoose');
const ResearchOpportunity = require('../models/researchOpportunity.model');
const Scholarship = require('../models/scholarship.model');

function findByIdOrSlug(Model, identifier) {
  const filter = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: identifier.toLowerCase() };
  return Model.findOne(filter).lean().exec();
}

function createOpportunityRepository() {
  return {
    listScholarships() {
      return Scholarship.find().sort({ deadline: 1, title: 1 }).lean().exec();
    },

    findScholarship(slug) {
      return findByIdOrSlug(Scholarship, slug);
    },

    listResearch() {
      return ResearchOpportunity.find().sort({ deadline: 1, title: 1 }).lean().exec();
    },

    findResearch(slug) {
      return findByIdOrSlug(ResearchOpportunity, slug);
    },
  };
}

module.exports = { createOpportunityRepository };