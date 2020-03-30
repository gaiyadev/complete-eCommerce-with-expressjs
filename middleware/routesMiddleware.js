const jwt = require('jsonwebtoken');
require('dotenv').config();
// Route Middleware

module.exports = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/users/login');
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.APP_SECRET_KEY);
        req.user = decoded;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.redirect('/users/login');
        }
        return res.redirect('/users/login');
    }
    next();
}

