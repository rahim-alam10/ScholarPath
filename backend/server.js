const { createServer } = require('./src/app');

if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  createServer()
    .then((server) => {
      server.listen(port, '0.0.0.0', () => {
        console.log(`ScholarPath API listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start ScholarPath API:', error);
      process.exitCode = 1;
    });
}

module.exports = { createServer };
