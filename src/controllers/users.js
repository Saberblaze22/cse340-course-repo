import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

/* ------------------------
   REGISTER PAGE
------------------------ */
const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

/* ------------------------
   LOGIN PAGE
------------------------ */
const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

/* ------------------------
   REGISTER PROCESS
------------------------ */
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/login');

    } catch (error) {
        console.error('Error registering user:', error);

        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );

        return res.redirect('/register');
    }
};

/* ------------------------
   LOGIN PROCESS
------------------------ */
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role_name: user.role_name
        };

        req.flash('success', 'Login successful!');
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Error during login:', error);

        req.flash('error', 'An error occurred during login.');
        return res.redirect('/login');
    }
};

/* ------------------------
   LOGOUT (SAFE FOR RENDER)
------------------------ */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/');
        }

        // IMPORTANT:
        // Do NOT use req.flash here because session is destroyed

        return res.redirect('/');
    });
};

/* ------------------------
   AUTH MIDDLEWARE (LOGIN REQUIRED)
------------------------ */
const requireLogin = (req, res, next) => {
    if (!req.session?.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/* ------------------------
   ROLE MIDDLEWARE
------------------------ */
const requireRole = (role) => {
    return (req, res, next) => {

        if (!req.session?.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        const userRole = req.session.user.role_name || 'user';

        if (userRole !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};

/* ------------------------
   DASHBOARD
------------------------ */
const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

/* ------------------------
   USERS PAGE (ADMIN ONLY)
------------------------ */
const showUsersPage = async (req, res) => {
    const users = await getAllUsers();

    res.render('users', {
        title: 'Registered Users',
        users
    });
};

/* ------------------------
   EXPORTS
------------------------ */
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};