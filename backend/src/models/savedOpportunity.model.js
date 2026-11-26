const mongoose = require('mongoose');

const savedOpportunitySchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

savedOpportunitySchema.index(
  { user: 1, opportunityType: 1, opportunity: 1 },
  { unique: true },
);

module.exports = mongoose.models.SavedOpportunity
  || mongoose.model('SavedOpportunity', savedOpportunitySchema);
