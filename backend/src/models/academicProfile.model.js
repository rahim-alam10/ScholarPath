const mongoose = require('mongoose');

const academicProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    qualification: { type: String, trim: true, maxlength: 100 },
    fieldOfStudy: { type: String, trim: true, maxlength: 150 },
  },
  { timestamps: true },
);

module.exports = mongoose.models.AcademicProfile
  || mongoose.model('AcademicProfile', academicProfileSchema);
