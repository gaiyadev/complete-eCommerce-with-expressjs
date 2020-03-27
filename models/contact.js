require('dotenv').config();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const db = require('../database/db');
const ContactSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Email: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Subject: {
        type: String,
        minlength: 1,
        maxlength: 50,
    },
    Message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;


// Function to create new Admin    
module.exports.createMessage = (newMessage, callback) => {
    newMessage.save(callback); //create New Admin
    // Send a mail Register
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.APP_EMAIL,
        to: process.env.ADMIN_EMAIL, //admin mail
        subject: 'Contact Us',
        text: "Dear NodeStore Administrator.",
        html: `<p>You got a new Eamil submission with the following details...</p>
            <ul>
              <li>Name: ${newMessage.Name}</li>
              <li>Email: ${newMessage.Email}</li>
              <li>Subject: ${newMessage.Subject}</li>
              <li>Message: ${newMessage.Message}</li>
            </ul>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) throw err;
        console.log("message Sent Successfully!!" + newMessage.Email);
    });

}

