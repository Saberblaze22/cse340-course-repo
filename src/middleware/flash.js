export default function flash(req, res, next) {

    // SAFETY: session might not exist during destroy/logout edge cases
    if (!req.session) {
        req.session = {};
    }

    if (!req.session.flash) {
        req.session.flash = {};
    }

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

    res.locals.flash = () => {
        if (!req.session || !req.session.flash) {
            return {};
        }

        const messages = req.session.flash;
        req.session.flash = {};
        return messages;
    };

    next();
}