const { createServer } = require('./src/app');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  connectDatabase()
    .then(() => createServer())
    .then((server) => {
      server.listen(port, '0.0.0.0', () => {
        console.log(`ScholarPath API listening on port ${port}`);
      });
    })
    .catch(() => {
      console.error('Failed to start ScholarPath API. Check the MongoDB settings and network access.');
      process.exitCode = 1;
    });
}

module.exports = { createServer, connectDatabase, disconnectDatabase };
