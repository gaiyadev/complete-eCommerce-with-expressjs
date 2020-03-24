const jwt = require('jsonwebtoken');


require('dotenv').config();
 
module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) {
      console.log('sssssssssssss');
      return res.redirect('/users/login');
    }
try {
  const decoded =  jwt.verify(token, process.env.APP_SECRET_KEY);
  req.user = decoded;
  next();
} catch (err) {
  console.log('invalid token');  
}    
 }

