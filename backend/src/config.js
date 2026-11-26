const path = require('node:path');

module.exports = {
  dataFile: path.join(__dirname, '..', 'data', 'users.json'),
  maxBodyBytes: 16 * 1024,
  tokenTtlMs: 7 * 24 * 60 * 60 * 1000,
};
