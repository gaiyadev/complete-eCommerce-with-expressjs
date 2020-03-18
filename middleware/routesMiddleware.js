// Route Middleware
module.exports.ensureAuthenicated = function (req, res, next) {  
    if (req.isAuthenticated()) {
        return next(); 
      }
        res.redirect('/access/');
  }
  