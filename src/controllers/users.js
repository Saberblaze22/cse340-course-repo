import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(
            email,
            password
        );

        if (user) {
            req.session.user = user;

            req.flash(
                'success',
                'Login successful!'
            );

            console.log('User logged in:', user);

            return res.redirect('/dashboard');
        }

        req.flash(
            'error',
            'Invalid email or password.'
        );

        res.redirect('/login');

    } catch (error) {

        console.error(
            'Error during login:',
            error
        );

        req.flash(
            'error',
            'An error occurred during login.'
        );

        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    req.flash(
        'success',
        'Logout successful!'
    );

    res.redirect('/login');
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(
            name,
            email,
            passwordHash
        );

        req.flash(
            'success',
            'Registration successful! Please log in.'
        );

        res.redirect('/');
    } catch (error) {
        console.error('FULL ERROR:', error);
console.error('ERROR MESSAGE:', error.message);
console.error('STACK:', error.stack);

        req.flash(
            'error',
            'An error occurred during registration. Please try again.'
        );

        res.redirect('/register');
    }
};

const requireRole = (role) => {
    return (req, res, next) => {

        if (!req.session || !req.session.user) {
            req.flash(
                'error',
                'You must be logged in to access this page.'
            );

            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access this page.'
            );

            return res.redirect('/');
        }

        next();
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard
};