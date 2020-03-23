const Product = require('../models/product');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async(req, res, next) => {
  try {
    await Product.find({}, (err, product) => {
      if(err) throw err;
      Product.find({ProductCategory: 'Women Fashion'}, (err, products) => {
        if(err) throw err;
        res.render('pages/index', { title: 'Welcome to NodeStore', product: product, products: products });
      }).sort({AuthorCreated: -1}).limit(20);
    });
  } catch (err) {
    console.log(err);
  }
});


// Women Fashion Page
router.get('/women', (req, res, next) =>  {
  try {
    Product.find({ProductCategory: 'Women Fashion'}, (err, product) => {
      if(err) throw err;
      res.render('pages/women', { title: 'Women Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Fashion Page
router.get('/men', (req, res, next) => {
  try {
    Product.find({ProductCategory: 'Men Fashion'}, (err, product) => {
      if (err) throw err;
      res.render('pages/men', { title: 'Men Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Phone and Tablets Page
router.get('/phoneandTablets', (req, res, next) => {
  try {
    Product.find({ProductCategory: 'Phones and  Tablets'}, (err, product) => {
      if (err) throw err;
      res.render('pages/phoneandTablets', { title: 'Phone and Tablets Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Jewelry Page
router.get('/jewelry', (req, res, next) => {
  try {
    Product.find({ProductCategory: 'Jewlyries'}, (err, product) => {
      if(err) throw err;
      res.render('pages/jewelry', { title: 'Jewelry Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Shoes Page
router.get('/shoes', (req, res, next) => {
  try {
    Product.find({ProductCategory: 'Shoes'}, (err, product) => {
      if(err) throw err;
      res.render('pages/shoes', { title: 'Shoes Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Contact Page
router.get('/contact', (req, res, next) => {
  try {
    res.render('pages/contact', { title: 'Contac Us' });
  } catch (err) {
    console.log(err); 
  }
});


//  Product Page
router.get('/product', (req, res, next) => {
  try {
    Product.find({}, (err, product) => {
      if(err) throw err;
      res.render('pages/product', { title: 'Product page', product: product });
    });
  } catch (err) {
    console.log(err);
    
  }
});


//  Checkout Page
router.get('/checkout', (req, res, next) => {
  res.render('pages/checkout', { title: 'Checkout page' });
});

//  cart Page
router.get('/cart', (req, res, next) => {
  res.render('pages/cart', { title: 'Cart page' });
});

module.exports = router;
