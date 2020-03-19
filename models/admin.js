const mongoose = require('mongoose');
const db = require('../database/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const AdminSchema = new mongoose.Schema ({
    FirstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50,        
    },
    LastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50,
        uppercase: true,
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
    Username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Role: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 122,  
      },
    Password: {
        type: bcrypt,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 150,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }   
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;

// Function to create new Admin    
module.exports.createAdmin = (newAdmin, callback) => {
bcrypt.hash(newAdmin.Password, 10, function(err, hash){
    if (err) throw err;
     newAdmin.Password = hash;  //set hash password
     newAdmin.save(callback); //create New Admin
      // Send a mail Register Admin with password and username
    //   let transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: 'gaiyaobed94@gmail.com',
    //         pass: 'mypassword'
    //     }
    // });

    // let mailOptions = {
    //     from: 'gaiyaobed94@gmail.com',
    //     to: newAdmin.email,
    //     subject: 'NodeStore Administrator',
    //     text: "You have been Register as an Administrator with the following details details.."
    //      + "Username:" + newAdmin.Username + " " + "email"  + " " + newAdmin.email
    // };

    // transporter.sendMail(mailOptions, function(err, info) {
    //     if(err) throw err;
    //         console.log("message Sent Successfully!!" + newAdmin.email);
    // });
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
// module.exports.hashNewPassword = async (admin, callback) => {
//     await bcrypt.hash(password, 10, (err, hash) => {
//          if(err) throw err;
//          admin.Password = hash;  //set hash password
//          aAdmin.save(callback);
//         //return callback(null, hash);
//      });
//  }


