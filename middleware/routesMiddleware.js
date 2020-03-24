const jwt = require('jsonwebtoken');


 module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) {
      console.log('sssssssssssss');
      return res.redirect('/users/login');
    }
try {
  const decoded =  jwt.verify(token, 'jwtPrivateKey');
  req.user = decoded;
  next();
} catch (err) {
  console.log('invalid token');  
}    
 }

