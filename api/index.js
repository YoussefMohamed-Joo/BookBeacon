const { app, connectDB } = require('../server/index');

let connected = false;

const handler = async (req, res) => {
  if (!connected) {
    connectDB().then(() => { connected = true; }).catch(err => {
      console.error('MongoDB connection error:', err.message);
    });
  }
  return app(req, res);
};

module.exports = handler;