const mongoose = require('mongoose');

const academicProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    cgpa: { type: Number, min: 0, max: 4 },
    degreeLevel: { type: String, trim: true, maxlength: 100 },
    fieldOfStudy: { type: String, trim: true, maxlength: 150 },
    englishTest: { type: String, trim: true, maxlength: 50 },
    englishScore: { type: String, trim: true, maxlength: 50 },
    targetCountries: [{ type: String, trim: true, maxlength: 100 }],
  },
  { timestamps: true },
);

module.exports = mongoose.models.AcademicProfile
  || mongoose.model('AcademicProfile', academicProfileSchema);
