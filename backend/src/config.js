const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true });

module.exports = {
  mongoUri: process.env.MONGODB_URI || process.env.MONGODG_URI || '',
  databaseName: process.env.DATABASE_NAME || 'ScholarPath',
  maxBodyBytes: 16 * 1024,
  tokenTtlMs: 7 * 24 * 60 * 60 * 1000,
};
