const db = require('../database');

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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;