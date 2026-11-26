const mongoose = require('mongoose');
const { databaseName, mongoUri } = require('../config');

async function connectDatabase() {
  if (!mongoUri) {
    throw new Error('MongoDB URI is not configured. Set MONGODB_URI in backend/.env.');
  }

  await mongoose.connect(mongoUri, {
    dbName: databaseName,
    serverSelectionTimeoutMS: 10000,
  });
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
