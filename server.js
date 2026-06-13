import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import flash from './src/middleware/flash.js';

import express from 'express';
import router from './src/routes.js';
import { testConnection } from './src/models/db.js';

// ENV
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not defined in environment variables');
}

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* -----------------------
   MIDDLEWARE
------------------------ */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(flash);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/* -----------------------
   LOGGING (dev only)
------------------------ */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/* -----------------------
   GLOBAL TEMPLATE DATA
------------------------ */
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.isLoggedIn = !!req.session?.user;
    res.locals.messages = req.flash();   // ✅ FIXED (IMPORTANT)
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/* -----------------------
   ROUTES
------------------------ */
app.use(router);

/* -----------------------
   404 HANDLER
------------------------ */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/* -----------------------
   ERROR HANDLER
------------------------ */
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error(err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });
});

/* -----------------------
   START SERVER
------------------------ */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('DB connection error:', error);
    }
});