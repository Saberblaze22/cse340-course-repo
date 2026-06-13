export default function flash(req, res, next) {
    // Ensure session exists (prevents Render crash)
    if (!req.session) {
        req.session = {};
    }

    // Ensure flash storage exists
    if (!req.session.flash) {
        req.session.flash = {};
    }

    // Add flash message
    req.flash = (type, message) => {
        if (!req.session.flash) {
            req.session.flash = {};
        }

        if (!req.session.flash[type]) {
            req.session.flash[type] = [];
        }

        req.session.flash[type].push(message);
    };

    // Make flash available in views
    res.locals.flash = () => {
        const messages = req.session.flash || {};
        req.session.flash = {}; // clear after reading
        return messages;
    };

    next();
}