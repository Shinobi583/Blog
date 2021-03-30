const AppError = require('./AppError');

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\\/g, "&bsol;")
        .replace(/\?/g, "&quest;");
}
// Middleware
function validateUser(req, res, next) {
    let loggedIn = req.session.loggedIn;
    if (loggedIn) {
        return next();
    }
    else {
        return next(new AppError());
    }
}

module.exports = { escapeHtml, validateUser };