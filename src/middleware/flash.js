export default function flash(req, res, next) {
    // GUARANTEE session exists first
    if (!req.session) {
        req.session = {};
    }

    // GUARANTEE flash object exists
    if (!req.session.flash) {
        req.session.flash = {};
    }

    // req.flash function
    req.flash = (type, message) => {
        if (!req.session) {
            req.session = {};
        }

        if (!req.session.flash) {
            req.session.flash = {};
        }

        if (!req.session.flash[type]) {
            req.session.flash[type] = [];
        }

        req.session.flash[type].push(message);
    };

    // expose flash to views
    res.locals.flash = () => {
        const messages = req.session?.flash || {};
        if (req.session) {
            req.session.flash = {};
        }
        return messages;
    };

    next();
}