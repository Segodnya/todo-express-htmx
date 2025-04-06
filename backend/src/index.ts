import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';

// Load environment variables
dotenv.config();

// Import dependencies
import { createContainer } from './di';
import {
  createTodoRouter,
  createAuthRouter,
  createLanguageRouter,
} from './routes';
import {
  initI18n,
  i18nMiddleware,
  setupI18nHelpers,
  changeLanguageMiddleware,
} from './utils/i18n';
import { currentUrlMiddleware } from './middleware/currentUrl';

// Initialize i18n
initI18n();

// Initialize the dependency injection container
const container = createContainer();

// Initialize app
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

// i18n middleware
app.use(i18nMiddleware);
app.use(changeLanguageMiddleware);
app.use(currentUrlMiddleware);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../frontend/views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

// Setup i18n helpers for templates
setupI18nHelpers(app);

interface ContentOptions {
  fn: (context: Record<string, unknown>) => string;
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

// Initialize routers
const todoRouter = createTodoRouter(container.todoController);
const authRouter = createAuthRouter(container.authController);
const languageRouter = createLanguageRouter(container.languageController);

// Auth middleware to protect routes
const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.session?.user) {
    return res.redirect('/auth/signin');
  }
  next();
};

// Language change route
app.use('/change-language', languageRouter);

// Routes
app.use('/auth', authRouter);
app.use('/todos', requireAuth, todoRouter);

// Root route
app.get('/', (req, res) => {
  if (req.session?.user) {
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
