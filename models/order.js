require('dotenv').config();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const db = require('../database/db');

const OrderSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    LastName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Product: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
    },
    ProductSize: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
    },
    ProductPrice: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    SKUNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 10,
    },
    ProductBrand: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Email: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 500,
    },
    State: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    UserOrder: {
        type: String,
    },
    OrderID: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;

// Function to create new Order    
module.exports.createOrder = (newOrder, callback) => {
    newOrder.save(callback); //create New Order
    // Send a mail on order
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        }
    });

    let mailOptions = {
        from: process.env.APP_EMAIL,
        to: newOrder.Email, //customer email
        subject: 'Your Order',
        text: "Dear Esteem Customerr.",
        html: `<p>You got a new order submission with the following details...</p>
            <ul>
              <li>Name: ${newOrder.FirstName}</li>
              <li>Subject: ${newOrder.LastName}</li>
              <li>Email: ${newOrder.Email}</li>
              <li>Message: ${newOrder.ProductPrice}</li>
            </ul>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) throw err;
        console.log("message Sent Successfully!!" + newMessage.Email);
    });

}