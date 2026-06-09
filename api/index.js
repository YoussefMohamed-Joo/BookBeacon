const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Book Beacon API is running', timestamp: new Date() });
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'OK', message: 'Vercel serverless works', path: req.url, method: req.method });
});

app.all('/api/*', (req, res) => {
  res.json({ message: 'Route not found', path: req.url });
});

module.exports = app;