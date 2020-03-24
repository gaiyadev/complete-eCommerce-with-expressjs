const mongoose = require('mongoose');
const config = require('config');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const UserSchema = new mongoose.Schema ({
    Surname: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50, 
        uppercase: true,       
    },
    OtherName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 4,
        maxlength: 50,
        lowercase: true
    },
    Phone: {
        type: String,
        required: true,
        maxlengt: 11,
    },
    Code: {
        type: String,
        required: true,
    },
    State: {
        required: true,
        type: String,
    },
    Username: {
        type: String, bcrypt,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Password: {
        type: bcrypt,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 150,
    },
    LGA: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    BillingAddress: {
        type: String,
        required: true
    },
    ResetPasswordToken: {
        type: String,
    },
    ResetPasswordExpires: {
        type: Date,
    },
    PasswordUpdateAt: {
        type: Date,
    },
    CreatedAt: {
        type: Date,
    }   
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

// Function to create new Admin    
module.exports.createUser = (newUser, callback) => {
bcrypt.hash(newUser.Password, 10, function(err, hash){
    if (err) throw err;
    newUser.Password = hash;  //set hash password
    newUser.save(callback); //create New Admin
      // Send a mail Register Admin with password and username
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gaiyaobed94@gmail.com',
            pass: 'gaiya1994'
        }
    });

    let mailOptions = {
        from:'gaiyaobed94@gmail.com',
        to: newUser.Email,
        subject: 'NodeStore Administrator',
        text: "You have been Register as an Administrator with the following details details.."
         + "Username:" + " " + newUser.Username + " " + " " + "Email"  + " " + newUser.Email + "<br/>" +
         "Please click on the following link, or paste this into your browser to login" + " " +
           "<a href='http://localhost:3000/users/login/'>Login</a>"
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) throw err;
            console.log("message Sent Successfully!!" + newUser.Email);
    });
 });
}


// Get Admin by Id
module.exports.getAdminById = async (id, callback) => {
  try {
    await  Admin.findById(id, callback);
  } catch (error) {
      console.log(error);      
  }
}

// Compare Admin password
module.exports.verifyPassword = async (password, hash, callback) => {
   await bcrypt.compare(password, hash, (err, isMatch) => {
        if(err) throw err;
       return callback(null, isMatch);
    });
}


// Compare Curent password and new password of admin
module.exports.comparePassword = async (password, hash, callback) => {
    await bcrypt.compare(password, hash, (err, isMatch) => {
         if(err) throw err;
        return callback(null, isMatch);
     });
 }


 // hashing new password of admin
module.exports.hashNewPassword = async (admin, callback) => {
    await bcrypt.hash(password, 10, (err, hash) => {
         if(err) throw err;
         admin.Password = hash;  //set hash password
         aAdmin.save(callback);
        return callback(null, hash);
     });
 }


