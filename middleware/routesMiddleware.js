const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    try {
        const token = req.headers('x-auth-token');
        const decoded = jwt.verify(token, process.env.APP_SECRET_KEY);
        req.user = decoded;
        next();

    } catch (err) {
        return res.redirect('/users/login');
    }

}


// module.exports = function(req, res, next) {
//   const header = req.header('x-auth-token');
//     if(!header) {
//       console.log('sssssssssssss');
//       return res.redirect('/users/login');
//     }

// try {
//   jwt.verify(header, process.env.APP_SECRET_KEY, (err, decoded) => {
//     if(err) throw err;
//     const bearer = header.split(' ');
//       const token = bearer[1];
//             req.token = token;
//             req.user = decoded;
//     next();
//   });

// } catch (err) {
//   console.log('invalid token');  
// }    
//  }

// module.exports = function (req, res, next) {
//   try {
//     const header = req.header('x-auth-token');

//     if (typeof header !== 'undefined') {
//       const bearer = header.split(' ');
//       const token = bearer[1];
//       req.token = token;
//       next();
//     } else {
//       return res.redirect('/users/login');
//     }

//   } catch (err) {
//     console.log('invalid token');
//     return res.redirect('/users/login');
//   }
// }