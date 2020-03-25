const db = require('../database/db');
const mongoose = require('mongoose');
require('../models/admin');
const ProductSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    ProductCategory: {
        type: String,
        required: true,
        minlength: 4,
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
        minlength: 3,
        maxlength: 50,
    },
    SKUNumber: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10,
    },
    ProductBrand: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    ProductDescription: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 500,
    },
    ProductImage: {
        type: String,
    },
    AuthorCreated: {
        type: String,
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;

// Function to create new Admin    
module.exports.createProduct = (newProduct, callback) => {
    newProduct.save(callback); //create New Product
}
