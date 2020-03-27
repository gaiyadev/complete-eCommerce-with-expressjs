const Product = require('../models/product');
const Review = require('../models/review');
var express = require('express');
var csrf = require('csurf')

const csrfProtection = csrf({ cookie: true });

var router = express.Router();


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    await Product.find({}, (err, product) => {
      if (err) throw err;
      Product.find({ ProductCategory: 'Women Fashion' }, (err, products) => {
        if (err) throw err;
        res.render('pages/index', { title: 'Welcome to NodeStore', product: product, products: products });
      }).sort({ AuthorCreated: -1 }).limit(20);
    }).limit(8);
  } catch (err) {
    console.log(err);
  }
});


// Women Fashion Page
router.get('/women', (req, res, next) => {
  try {
    Product.find({ ProductCategory: 'Women Fashion' }, (err, product) => {
      if (err) throw err;
      res.render('pages/women', { title: 'Women Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Fashion Page
router.get('/men', (req, res, next) => {
  try {
    Product.find({ ProductCategory: 'Men Fashion' }, (err, product) => {
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
    Product.find({ ProductCategory: 'Phones and  Tablets' }, (err, product) => {
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
    Product.find({ ProductCategory: 'Jewlyries' }, (err, product) => {
      if (err) throw err;
      res.render('pages/jewelry', { title: 'Jewelry Section', product: product });
    });
  } catch (err) {
    console.log(err);
  }
});

// Men Shoes Page
router.get('/shoes', (req, res, next) => {
  try {
    Product.find({ ProductCategory: 'Shoes' }, (err, product) => {
      if (err) throw err;
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
router.get('/product/:id', async (req, res, next) => {
  try {
    let Id = req.params.id;
    await Product.find({ _id: Id }, async (err, product) => {
      if (err) throw err;
      await Product.find({}, async (err, products) => {
        if (err) throw err;
        Review.find({ ProductReview: Id }, (err, review) => {
          if (err) throw err;
          Review.find({ ProductReview: Id }, (err, count) => {
            if (err) throw err;
            res.render('pages/product', { title: 'Product page', count: count, product: product, products: products, review: review });
          }).sort({ CreatedAt: 1 }).count();
        });
      });
    });
  } catch (err) {
    console.log(err);

  }
});




router.post('/reviews/:id', (req, res, next) => {
  try {
    let name = req.body.name;
    let review = req.body.review;
    let id = req.params.id;
    //Creating new Review
    let newReview = new Review({
      Name: name,
      Review: review,
      ProductReview: id
    });
    Review.createReview(newReview, function (err, review) {
      if (err) throw err;
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Review added successfully'
      }
      return res.redirect('back');
    });
  } catch (err) {
    console.log(err);
  }
});



//  Checkout Page
router.get('/checkout', csrfProtection, (req, res, next) => {
  try {
    let cart = req.session.cart;
    let displayCart = {
      item: [], total: 0
    }
    let total = 0;
    for (let item in cart) {
      displayCart.item.push(cart[item]);
      total += (cart[item].quantity * cart[item].price);
    }
    displayCart.total = total;
    global.items = displayCart.item;
    res.render('pages/checkout', { title: 'Checkout page', cart: displayCart, csrfToken: req.csrfToken(), success: req.session.success, errors: req.session.errors });
    req.session.errors = null;
  } catch (err) {
    console.log(err);
  }

});

//  Viewing product already added to cart  cart Page
router.get('/cart', (req, res, next) => {
  try {
    let cart = req.session.cart;
    let displayCart = {
      item: [], total: 0
    }
    let total = 0;
    for (let item in cart) {
      displayCart.item.push(cart[item]);
      total += (cart[item].quantity * cart[item].price);
    }
    displayCart.total = total;
    global.items = displayCart.item;
    res.render('pages/cart', { title: 'Cart page', cart: displayCart });
  } catch (err) {
    console.log(err);
  }
});


//  Adding product to cart
router.post('/cart/add/:id', (req, res, next) => {
  try {
    let id = req.params.id;
    req.session.cart = req.session.cart || {};
    let cart = req.session.cart;
    Product.findOne({ _id: id }, (err, product) => {
      if (err) throw err;
      if (cart[id]) {
        cart[id].quantity++;
      } else {
        cart[id] = {
          id: product._id,
          product: product.ProductName,
          brand: product.ProductBrand,
          price: parseInt(product.ProductPrice),
          image: product.ProductImage,
          size: product.ProductSize,
          quantity: 1,
        }
      }
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Product added successfully'
      }
      return res.redirect('back');
    });
  } catch (err) {
    console.log(err);
  }
});

//logic to remove from cart
router.get('/cart/remove/:id', (req, res, next) => {
  req.session.cart = req.session.cart || {};

  res.redirect('back');


});

module.exports = router;
