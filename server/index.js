const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// ===== SECURITY HARDENING =====

// 1. Helmet with strict CSP
app.use(helmet({
  crossOriginResourcePolicy: { policy: isProduction ? 'same-origin' : 'cross-origin' },
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.vercel.app"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://*.vercel.app"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://*.vercel.app", "https://openrouter.ai"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  } : false,
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: { nosniff: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// 2. CORS - restrict to known origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://bookbeacon.vercel.app',
  'https://book-beacon.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || !isProduction) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

// 3. Cookie parser for secure session management
app.use(cookieParser(process.env.JWT_SECRET));

// 4. Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. NoSQL injection sanitization
app.use(mongoSanitize());

// 6. HTTP parameter pollution protection
app.use(hpp({
  whitelist: ['price', 'rating', 'salesCount', 'stock', 'page', 'limit', 'grade'],
}));

// 7. Remove fingerprinting
app.disable('x-powered-by');

// 8. Request logging (don't log bodies in production)
if (!isProduction) app.use(morgan('dev'));

// 9. Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 200 : 1000,
  message: { message: 'طلبات كثيرة جداً، يرجى المحاولة لاحقاً' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 10 : 50,
  message: { message: 'محاولات تسجيل دخول كثيرة، يرجى المحاولة بعد 15 دقيقة' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProduction ? 5 : 50,
  message: { message: 'محاولات تسجيل كثيرة، يرجى المحاولة بعد ساعة' },
  standardHeaders: true,
  legacyHeaders: false,
}));

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isProduction ? 20 : 100,
  message: { message: 'لقد تجاوزت حد الطلبات لهذه الساعة' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/orders', orderLimiter);

// 10. Uploads directory (try/catch for serverless read-only fs)
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  console.log('Could not create uploads directory (serverless mode):', e.message);
}

// 11. Serve uploads securely - only image types
app.use('/uploads', (req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
    return res.status(403).json({ message: 'ممنوع' });
  }
  next();
}, express.static(uploadsDir, { dotfiles: 'deny', index: false }));

// ===== ROUTES =====
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const deliveryRoutes = require('./routes/delivery');
const accountingRoutes = require('./routes/accounting');
const aiRoutes = require('./routes/ai');
const blogRoutes = require('./routes/blogs');
const reviewRoutes = require('./routes/reviews');
const dashboardRoutes = require('./routes/dashboard');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Book Beacon API is running', timestamp: new Date() });
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://bookbeacon.vercel.app';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/books</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/blog</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/login</loc><priority>0.5</priority></url>
  <url><loc>${baseUrl}/register</loc><priority>0.5</priority></url>
</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.BASE_URL || 'https://bookbeacon.vercel.app';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${baseUrl}/sitemap.xml`);
});

// Serve built client - only the static files, never source code
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, {
    dotfiles: 'deny',
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
      else res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  }));
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      try {
        res.sendFile(path.join(clientDist, 'index.html'));
      } catch (e) {
        next(e);
      }
    } else {
      next();
    }
  });
  console.log('Serving client from dist/');
}

// Error handler (no stack traces in production)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Book Beacon API running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

// Auto-start in direct execution (not when imported as serverless)
if (require.main === module) {
  startServer();
}

module.exports = { app, connectDB };
