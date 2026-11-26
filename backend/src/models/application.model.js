const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunityType: {
      type: String,
      enum: ['scholarship', 'research'],
      required: true,
    },
    opportunity: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ['saved', 'in_progress', 'submitted', 'accepted', 'rejected'],
      default: 'saved',
    },
    deadline: { type: Date },
    notes: { type: String, trim: true, maxlength: 5000 },
    submittedAt: { type: Date },
  },
  { timestamps: true },
);

applicationSchema.index(
  { user: 1, opportunityType: 1, opportunity: 1 },
  { unique: true },
);

module.exports = mongoose.models.Application
  || mongoose.model('Application', applicationSchema);
