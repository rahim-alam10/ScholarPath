const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    provider: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 10000 },
    country: { type: String, enum: ['Pakistan'], default: 'Pakistan', required: true },
    degreeLevels: [{ type: String, trim: true, maxlength: 100 }],
    fieldsOfStudy: [{ type: String, trim: true, maxlength: 150 }],
    funding: { type: String, trim: true, maxlength: 500 },
    deadline: { type: Date },
    applicationUrl: { type: String, trim: true, maxlength: 2048 },
    eligibilityCriteria: [{ type: String, trim: true, maxlength: 500 }],
  },
  { timestamps: true },
);

scholarshipSchema.index({ title: 'text', provider: 'text', description: 'text' });

module.exports = mongoose.models.Scholarship
  || mongoose.model('Scholarship', scholarshipSchema);
