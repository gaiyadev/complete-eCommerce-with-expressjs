var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Welcome to NodeStore' });
});


// Women Fashion Page
router.get('/women', (req, res, next) =>  {
  res.render('pages/women', { title: 'Women Section' });
});

// Men Fashion Page
router.get('/men', (req, res, next) => {
  res.render('pages/men', { title: 'Men Section' });
});

// Men Phone and Tablets Page
router.get('/phoneandTablets', (req, res, next) => {
  res.render('pages/phoneandTablets', { title: 'Phone and Tablets Section' });
});

// Men Jewelry Page
router.get('/jewelry', (req, res, next) => {
  res.render('pages/jewelry', { title: 'Jewelry Section' });
});

// Men Shoes Page
router.get('/shoes', (req, res, next) => {
  res.render('pages/shoes', { title: 'Shoes Section' });
});

// Men Contact Page
router.get('/contact', (req, res, next) => {
  res.render('pages/contact', { title: 'Contac Us' });
});


//  Product Page
router.get('/product', (req, res, next) => {
  res.render('pages/product', { title: 'Product page' });
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
