module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: 'OK', message: 'Vercel serverless works', path: req.url, method: req.method, env: process.env.NODE_ENV || 'not-set' });
};