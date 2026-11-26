const { connectDatabase, disconnectDatabase } = require('../src/config/database');
const { mongoUri } = require('../src/config');
const ResearchOpportunity = require('../src/models/researchOpportunity.model');
const Scholarship = require('../src/models/scholarship.model');
const {
  researchOpportunities,
  scholarships,
  replacedScholarshipSlugs,
  replacedResearchSlugs,
} = require('../src/data/opportunities');

async function seedCollection(Model, records) {
  await Model.init();
  const operations = records.map((record) => ({
    updateOne: {
      filter: { slug: record.slug },
      update: { $set: record },
      upsert: true,
    },
  }));
  const result = await Model.bulkWrite(operations);
  return { inserted: result.upsertedCount, updated: result.modifiedCount };
}

async function main() {
  try {
    await connectDatabase();
    const removedScholarships = await Scholarship.deleteMany({
      slug: { $in: replacedScholarshipSlugs },
    });
    const removedResearch = await ResearchOpportunity.deleteMany({
      slug: { $in: replacedResearchSlugs },
    });
    const scholarshipResult = await seedCollection(Scholarship, scholarships);
    const researchResult = await seedCollection(ResearchOpportunity, researchOpportunities);
    console.log(
      `Seed complete: ${scholarshipResult.inserted} scholarships and ${researchResult.inserted} research opportunities inserted; ${removedScholarships.deletedCount} replaced scholarships and ${removedResearch.deletedCount} replaced research opportunities removed; current seeded records updated.`,
    );
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : 'Unknown error.';
    const safeMessage = message
      .replaceAll(mongoUri, '[MongoDB URI]')
      .replace(/mongodb(?:\+srv)?:\/\/\S+/gi, '[MongoDB URI]');
    console.error(`Failed to seed opportunity data: ${safeMessage}`);
    process.exitCode = 1;
  });
}

module.exports = { seedCollection };