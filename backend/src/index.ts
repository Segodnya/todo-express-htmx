import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../frontend/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

interface ContentOptions {
  fn: (context: any) => string;
}

app.locals.defineContent = function (name: string, options: ContentOptions) {
  if (!this._contents) this._contents = {};
  this._contents[name] = options.fn(this);
};

app.locals.getContent = function (name: string) {
  if (!this._contents) this._contents = {};
  return this._contents[name];
};

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Auth middleware to protect routes
const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.session.user) {
    return res.redirect('/auth/signin');
  }
  next();
};

// Routes
app.use('/auth', authRoutes);
app.use('/todos', requireAuth, todoRoutes);

// Root route
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/todos');
  } else {
    res.redirect('/auth/signin');
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

export default app;
