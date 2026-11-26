const mongoose = require('mongoose');

const researchOpportunitySchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    institution: { type: String, required: true, trim: true, maxlength: 200 },
    country: { type: String, enum: ['Pakistan'], default: 'Pakistan', required: true },
    kind: { type: String, trim: true, maxlength: 100 },
    funding: { type: String, trim: true, maxlength: 500 },
    topics: [{ type: String, trim: true, maxlength: 150 }],
    deadline: { type: Date },
    description: { type: String, trim: true, maxlength: 10000 },
    supervisorName: { type: String, trim: true, maxlength: 200 },
    applicationUrl: { type: String, trim: true, maxlength: 2048 },
  },
  { timestamps: true },
);

researchOpportunitySchema.index({
  title: 'text',
  institution: 'text',
  description: 'text',
  topics: 'text',
});

module.exports = mongoose.models.ResearchOpportunity
  || mongoose.model('ResearchOpportunity', researchOpportunitySchema);
