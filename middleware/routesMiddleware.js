const jwt = require('jsonwebtoken');
require('dotenv').config();


 
module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
    if(!token) {
      console.log('sssssssssssss');
      return res.redirect('/users/login');
    }
try {
  jwt.verify(token, process.env.APP_SECRET_KEY, (err, decoded) => {
    if(err) throw err;
    req.user = decoded;
    next();
  });
 
} catch (err) {
  console.log('invalid token');  
}    
 }

