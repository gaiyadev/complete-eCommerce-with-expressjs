const bcrypt = require('bcrypt');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const nodemailer = require('nodemailer');
const User = require('../models/user');
var express = require('express');
var router = express.Router();


// getting users login form
router.get('/login', (req, res, next) => {
  res.render('pages/login', {title: 'Login User', success: req.session.success, errors: req.session.errors} );
  req.session.errors = null;
  
  });

  // getting users home
  router.get('/home', (req, res, next) => {
  res.render('pages/home', {title: 'User Dashboard', layout: 'userLayout', success: req.session.success, errors: req.session.errors} );
  req.session.errors = null;
  });

  //..getting users signup form
  router.get('/signup', (req, res, next) => {
    res.render('pages/signup', {title: 'Create an Account', success: req.session.success, errors: req.session.errors});
    req.session.errors = null;
  
  });


router.post('/login', (req,  res, next) => {
  let email = req.body.email;
  let password = req.body.password; 
  req.checkBody('email', 'email  is required').isEmail();
  req.checkBody('password', 'password is required').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
      req.session.errors = errors;
     req.session.success = false;
        res.redirect('back');
}else {
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
    }else {
      User.comparePassword(password, user.Password, (err, isMatch) => {
        if(err) throw err;
        if (!isMatch) {
          req.session.message = {
            type: 'danger',
            intro: '',
            message: 'Invalid user password'
        }
            res.location('back');
            res.redirect('back'); 
        }else  {
          // success login
          res.redirect('/users/home'); 
        }
  
      }); 


    }
});

}



});





 
//posting users signup
router.post('/signup', (req, res, next)  => {
  try {
    let surname                   = req.body.surname;
    let otherName                  = req.body.otherName;
    let phone                     = req.body.phone;
    let code                      = req.body.code;
    let email                     = req.body.email;
    let username                  = req.body.username;
    let lga                      = req.body.lga;
    let state                   = req.body.state;
    let password                 = req.body.password;
    let Cpassword                 = req.body.Cpassword;
    let address                 = req.body.address;
    let billAddress             = req.body.billAddress;
    // Validation point
    req.checkBody('surname', 'Surname is required').isLength({min:4, max:40}).withMessage('Surname Must be at least 4 chars long');
    req.checkBody('otherName', 'Other Name name is required').isLength({min:4, max:40}).withMessage('Other Name name Must be at least 4 chars long');
    req.checkBody('phone', 'Phone number field is required').isMobilePhone().isLength({min:11}).withMessage('Phone Must be 11 chars long');
    req.checkBody('lga', 'LGA size is required').isLength({min:4, max:50}).withMessage('LGA Must be at least 1 chars long');
    req.checkBody('code', 'Zip Code is required').isNumeric();
    req.checkBody('email').isEmail();
    req.checkBody('username', 'Username is required').isLength({min:4, max:50}).withMessage('Username Must be at least 4 chars long');
    req.checkBody('state', 'State is required').isLength({min:2, max:50}).withMessage('State Must be at least 4 chars long');
    req.checkBody('address', 'Address description is required').isLength({min:4, max:500}).withMessage('Address Must be at least 4 chars long');
    req.checkBody('billAddress', 'Billing address description is required').isLength({min:4, max:500}).withMessage('Billing address Must be at least 4 chars long');
    req.checkBody('password', 'password image is required').equals(Cpassword).withMessage('Password confirmation fail');
    // Checking  for error
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors = errors;
          req.session.success = false;
         return res.redirect('back');
    }else {    
    User.findOne({Email: email}, (err, user) => {
      if(err) throw err;
      if(user) {
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
          if(err) throw err;
          console.log(user);
        });
        req.session.message = {
          type: 'success',
          intro: '',
          message: 'Account created successfully'
        }
        return res.redirect('/users/login');
    });
    }
  } catch (err) {
    console.log(err);
  }});


module.exports = router;
