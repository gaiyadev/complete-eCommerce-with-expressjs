const db = require('../database/db');
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    Review: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 500,
    },
    ProductReview: {
        type: String,
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;

// Function to create new Admin    
module.exports.createReview = (newReview, callback) => {
    newReview.save(callback); //create New Product
}
