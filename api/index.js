const { app, startServer } = require('../server/index');

// Initialize connection on cold start
const handler = async (req, res) => {
  try {
    await startServer();
  } catch (err) {
    console.error('Serverless init error:', err.message);
  }
  return app(req, res);
};

module.exports = handler;
