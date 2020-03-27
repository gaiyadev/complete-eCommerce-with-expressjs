require('dotenv').config();
const async = require("async");
var csrf = require('csurf')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('config');
const auth = require('../middleware/routesMiddleware');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
var express = require('express');
const csrfProtection = csrf({ cookie: true });
var router = express.Router();


//.. Get forgot password form
router.get('/forgot-password', csrfProtection, (req, res, next) => {
  try {
    res.render('pages/forgot-password', { title: 'Forgot Password', csrfToken: req.csrfToken(), success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
  } catch (err) {
    console.log(err);
  }
});


//.. Submit email for link to reset password
router.post('/forgot', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ Email: req.body.email }, (err, user) => {
        if (!user) {
          req.session.message = {
            type: 'error',
            intro: '',
            message: 'No account with that email address exists.'
          }
          return res.redirect('/users/forgot-password');
        }
        User.update({ Email: req.body.email }, {
          ResetPasswordToken: token,
          ResetPasswordExpires: Date.now() + 3600000 // 1 hour
        }, (err) => {
          if (err) throw err;
          req.session.message = {
            type: 'success',
            intro: '',
            message: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'
          }
          let smtpTrans = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.APP_EMAIL,
              pass: process.env.APP_PASSWORD,
            }
          });
          let mailOptions = {
            to: req.body.email,
            from: process.env.APP_EMAIL,
            subject: 'NodeStore Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/access/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTrans.sendMail(mailOptions, (err) => {
            if (err) throw err;
            console.log("message Sent Successfully!!" + req.body.email);
          });
          return res.redirect('/users/forgot-password');
        });
      });
    },
    //     function(token, user, done) {
    //         smtpTrans.sendMail(mailOptions, (err) =>  {
    //           if(err) throw err;
    // });
    // }
  ], (err) => {
    console.log('this err' + ' ' + err)
    res.redirect('/');
  });
});


//Form to reset password form mail (LINK)
router.get('/reset-password/:token', csrfProtection, async (req, res, next) => {
  await User.findOne({ ResetPasswordToken: req.params.token, ResetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (err) throw err;
    //      console.log(admin);
    if (!user) {
      req.session.message = {
        type: 'error',
        intro: '',
        message: 'Password reset token is invalid or has expired.'
      }
      return res.redirect('/users/login');
    }
    let token = req.params.token;
    res.render('pages/reset-password', { title: 'Forgot password', csrfToken: req.csrfToken(), token: token, user: req.user, success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
  });
});


//logging out but jwt token is still active
router.post('/logout', (req, res) => {
  let token = req.cookies.token;
  delete token;
  res.clearCookie(token, { path: '/users/home' });
  return res.redirect('/users/login');
});


// Logic to reset password for user
router.post('/reset/:token', async (req, res, next) => {
  try {
    let password = req.body.password;
    let Cpassword = req.body.Cpassword;
    let token = req.params.token;
    req.checkBody('password', 'This field is required').notEmpty().isLength({ min: 8, max: 50 }).withMessage('password Must be at least 8 chars long');
    req.checkBody('Cpassword', 'Current password is required').notEmpty().isLength({ min: 8, max: 50 }).withMessage('Confirm password Must be at least 8 chars long');
    req.checkBody('password', 'password is required').notEmpty().equals(Cpassword).withMessage('Password confirmation fails');
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
      return res.redirect(`/users/reset-password/${token}`);
    } else {
      await User.findOne({ ResetPasswordToken: token, ResetPasswordExpires: { $gt: Date.now() } }, (err, user, next) => {
        if (err) throw err;
        if (!user) {
          req.session.message = {
            type: 'error',
            intro: '',
            message: 'Password reset token is invalid or has expired.'
          }
          return res.redirect('/users/login');
        }
        // if admin exist
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) throw err;
          // console.log('this is the has' + hash);
          User.update({ ResetPasswordToken: token }, {
            Password: hash,
            PasswordUpdateAt: Date.now(),
          }, (err) => {
            if (err) throw err;
            let smtpTrans = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
              }
            });
            let mailOptions = {
              to: user.Email,
              from: process.env.APP_EMAIL,
              subject: 'Your password has been changed',
              text: 'Hello,\n\n' +
                ' - This is a confirmation that the password for your account ' + user.Email + ' has just been changed.\n'
            };
            smtpTrans.sendMail(mailOptions, (err) => {
              if (err) throw err;
              req.session.message = {
                type: 'success',
                intro: '',
                message: 'Password reset successfully.'
              }
              return res.redirect('/access/');
            });
          });
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
});


// getting users login form
router.get('/login', csrfProtection, (req, res, next) => {
  res.render('pages/login', { title: 'Login User', csrfToken: req.csrfToken(), success: req.session.success, errors: req.session.errors });
  req.session.errors = null;

});


//.. Updating user info
router.get('/update', csrfProtection, auth, (req, res, next) => {
  const id = req.user._id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) throw err;
    const name = user.Username;
    const username = name.toUpperCase();
    res.render('pages/update', { title: 'Update Profile', layout: 'userLayout', user: user, csrfToken: req.csrfToken(), username: username, success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
  });
});

//..Updating users
router.post('/update/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let surname = req.body.surname;
    let OtherName = req.body.otherName;
    let phone = req.body.phone;
    let code = req.body.code;
    // let email = req.body.email;
    let username = req.body.username;
    let lga = req.body.lga;
    let state = req.body.state;
    let address = req.body.address;
    let billAddress = req.body.billAddress;
    // Validation form inputs
    req.checkBody('surname', 'Surname is required').isLength({ min: 4, max: 40 }).withMessage('Surname Must be at least 4 chars long');
    req.checkBody('otherName', 'Other Name name is required').isLength({ min: 4, max: 40 }).withMessage('Other Name name Must be at least 4 chars long');
    req.checkBody('phone', 'Phone number field is required').notEmpty().isLength({ min: 11 }).withMessage('Phone Must be 11 chars long');
    req.checkBody('lga', 'LGA size is required').isLength({ min: 4, max: 50 }).withMessage('LGA Must be at least 1 chars long');
    req.checkBody('code', 'Zip Code is required').notEmpty();
    // req.checkBody('email').isEmail();
    req.checkBody('username', 'Username is required').isLength({ min: 4, max: 50 }).withMessage('Username Must be at least 4 chars long');
    req.checkBody('state', 'State is required').isLength({ min: 2, max: 50 }).withMessage('State Must be at least 4 chars long');
    req.checkBody('address', 'Address description is required').isLength({ min: 4, max: 500 }).withMessage('Address Must be at least 4 chars long');
    req.checkBody('billAddress', 'Billing address description is required').isLength({ min: 4, max: 500 }).withMessage('Billing address Must be at least 4 chars long');
    // Checking  for error

    // Checking if errors exist
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
      return res.redirect('/users/update');
    } else {
      // return console.log('seeen');
      // Checking if Admin already exist
      await User.update({ _id: id }, {
        Surname: surname,
        OtherName: OtherName,
        Phone: phone,
        Code: code,
        State: state,
        Username: username,
        LGA: lga,
        Address: address,
        BillingAddress: billAddress,
      }, (err) => {
        if (err) throw err;
        req.session.message = {
          type: 'success',
          intro: '',
          message: 'Profile updated successfully'
        }
        return res.redirect('/users/update');
      });
    }
  } catch (error) {
    console.log(error);
  }
});


//.. Users change password
router.get('/change', csrfProtection, auth, (req, res, next) => {
  let id = req.user._id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) throw err;
    const name = user.Username;
    const username = name.toUpperCase();
    res.render('pages/change-password', { title: 'User Change Password', layout: 'userLayout', id: id, csrfToken: req.csrfToken(), username: username, success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
  });

});


// User change password part
router.post('/user/changePassword/:id', (req, res, next) => {
  let current_password = req.body.current_password;
  let new_password = req.body.new_password;
  let confirmed_newPassword = req.body.confirmed_newPassword;
  let id = req.params.id;
  // let id = req.params._id;
  console.log('see it' + id);
  req.checkBody('current_password', 'Current password is required').notEmpty().isLength({ min: 8, max: 50 }).withMessage('password Must be at least 8 chars long');
  req.checkBody('new_password', 'Current password is required').notEmpty().isLength({ min: 8, max: 50 }).withMessage('Confirm password Must be at least 8 chars long');
  req.checkBody('new_password', 'password is required').notEmpty().equals(confirmed_newPassword).withMessage('Password confirmation fails');

  //Checking for Errors
  let errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    return res.redirect('/users/change');
  } else {
    //return console.log('see it' + id);

    User.findOne({ _id: id }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return console.log('unknown Admin');
      }
      User.comparePassword(current_password, user.Password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          User.comparePassword(new_password, user.Password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              req.session.message = {
                type: 'error',
                intro: '',
                message: 'New password can not be the same with current password'
              }
              return res.redirect('/users/change');
            }
            if (!isMatch) {
              bcrypt.hash(new_password, 10, async (err, hash) => {
                if (err) throw err;
                User.update({ _id: id }, {
                  Password: hash
                }, (err) => {
                  if (err) throw err;
                  req.session.message = {
                    type: 'success',
                    intro: '',
                    message: 'Password changed successfully'
                  }
                  return res.redirect('/users/login');
                });
              });

            }
          });
        }
        if (!isMatch) {
          req.session.message = {
            type: 'error',
            intro: '',
            message: 'Current password is not correct'
          }
          return res.redirect('/users/change');
        }
      });
    });
  }
});

// getting users home
router.get('/home', csrfProtection, auth, (req, res, next) => {
  try {
    const id = req.user._id;
    User.findOne({ _id: id }, (err, user) => {
      if (err) throw err;
      const name = user.Username;
      const username = name.toUpperCase();
      res.render('pages/home', { title: 'User Dashboard', layout: 'userLayout', username: username, csrfToken: req.csrfToken(), success: req.session.success, errors: req.session.errors });
      req.session.errors = null;
      // console.log(name);
    });
  } catch (err) {
    console.log(err);
  }

});

//..getting users signup form
router.get('/signup', csrfProtection, (req, res, next) => {
  res.render('pages/signup', { title: 'Create an Account', csrfToken: req.csrfToken(), success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});


//User Login route
router.post('/login', (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  req.checkBody('email', 'email  is required').isEmail();
  req.checkBody('password', 'password is required').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('back');
  } else {
    req.session.success = true;
    User.findOne({ Email: email }, (err, user) => {
      if (!user) {
        req.session.message = {
          type: 'danger',
          intro: '',
          message: 'This email is not associated to any account'
        },
          res.location('back');
        res.redirect('back');
      } else {
        User.comparePassword(password, user.Password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            req.session.message = {
              type: 'danger',
              intro: '',
              message: 'Invalid user password'
            }
            res.location('back');
            res.redirect('back');
          } else {
            // success login ... Generating jwt for auth
            jwt.sign({ _id: user._id, Email: user.Email }, process.env.APP_SECRET_KEY, {
              expiresIn: '1d'
            }, (err, token) => {
              if (err) throw err;
              //console.log(token);
              res.cookie('token', token, { maxAge: 60 * 60 * 60 });
              //  res.header('x-auth-token', token);
              return res.redirect('/users/home');
            });
          }
        });
      }
    });

  }
});


//posting users signup
router.post('/signup', (req, res, next) => {
  try {
    let surname = req.body.surname;
    let otherName = req.body.otherName;
    let phone = req.body.phone;
    let code = req.body.code;
    let email = req.body.email;
    let username = req.body.username;
    let lga = req.body.lga;
    let state = req.body.state;
    let password = req.body.password;
    let Cpassword = req.body.Cpassword;
    let address = req.body.address;
    let billAddress = req.body.billAddress;
    // Validation point
    req.checkBody('surname', 'Surname is required').isLength({ min: 4, max: 40 }).withMessage('Surname Must be at least 4 chars long');
    req.checkBody('otherName', 'Other Name name is required').isLength({ min: 4, max: 40 }).withMessage('Other Name name Must be at least 4 chars long');
    req.checkBody('phone', 'Phone number field is required').isMobilePhone().isLength({ min: 11 }).withMessage('Phone Must be 11 chars long');
    req.checkBody('lga', 'LGA size is required').isLength({ min: 4, max: 50 }).withMessage('LGA Must be at least 1 chars long');
    req.checkBody('code', 'Zip Code is required').isNumeric();
    req.checkBody('email').isEmail();
    req.checkBody('username', 'Username is required').isLength({ min: 4, max: 50 }).withMessage('Username Must be at least 4 chars long');
    req.checkBody('state', 'State is required').isLength({ min: 2, max: 50 }).withMessage('State Must be at least 4 chars long');
    req.checkBody('address', 'Address description is required').isLength({ min: 4, max: 500 }).withMessage('Address Must be at least 4 chars long');
    req.checkBody('billAddress', 'Billing address description is required').isLength({ min: 4, max: 500 }).withMessage('Billing address Must be at least 4 chars long');
    req.checkBody('password', 'password image is required').equals(Cpassword).withMessage('Password confirmation fail');
    // Checking  for error
    const errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      req.session.success = false;
      return res.redirect('back');
    } else {
      User.findOne({ Email: email }, (err, user) => {
        if (err) throw err;
        if (user) {
          req.session.message = {
            type: 'danger',
            intro: '',
            message: 'User Email already taken'
          }
          return res.redirect('/users/signup');
        }
        //.....
        //Creating new User
        let newUser = new User({
          Surname: surname,
          OtherName: otherName,
          Email: email,
          Phone: phone,
          Code: code,
          State: state,
          Username: username,
          Password: password,
          LGA: lga,
          Address: address,
          BillingAddress: billAddress,
          CreatedAt: Date.now()
        });
        //Add New Product
        User.createUser(newUser, (err, user) => {
          if (err) throw err;
          //console.log(user);
        });
        req.session.message = {
          type: 'success',
          intro: '',
          message: 'Account created successfully'
        }
        const token = User.generateAuthToken();
        res.header('x-auth-token', token);
        console.log('signup' + token);
        return res.redirect('/users/login');
      });
    }
  } catch (err) {
    console.log(err);
  }
});


/**
 * CHECKOUT, CARD SECTION
 */




module.exports = router;







