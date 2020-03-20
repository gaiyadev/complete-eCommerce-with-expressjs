const multer = require('multer');
const bcrypt = require('bcrypt');
const config = require('config');
const nodemailer = require('nodemailer');
const async = require("async");
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const fs = require('fs');
const Admin = require('../models/admin');
const Product = require('../models/product');
var express = require('express');
var router = express.Router();

/* Admin login page. */
router.get('/', (req, res, next) => {
  res.render('admin/login', { title: 'Admin Login', layout:'loginLayout.hbs', success: req.session.success, errors: req.session.errors});
  req.session.errors = null;
});

/* GET Dashboard page. */
router.get('/dashboard', ensureAuthenicated, (req, res, next) => {
  try {
    let id = req.user._id;
    Admin.findOne({ Role: 'Administrator', _id: id}, (err, role) => {
      if(err) throw err;
      const name = req.user.Username;
      const username = name.toUpperCase();
      res.render('admin/index', { title: 'NodeStore Dashboard',  role: role,  username: username, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
      req.session.errors = null;
     // console.log(role);
    }).select({ Role: 1});
  } catch (error) {
    console.log(error);
  }
 
});

/* GET Categories page. */
router.get('/product', ensureAuthenicated, (req, res, next) => {
 try {
  const id = req.user._id;
  const name = req.user.Username;
  const username = name.toUpperCase();
  Admin.findOne({Role: 'Administrator', _id: id}, (err, role) => {
    if(err) throw err;
    res.render('admin/product', { title: 'NodeStore Dashboard Categories', role: role, username: username, id: id, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
  req.session.errors = null;
  }).select({ Role: 1});
 } catch (error) {
   console.log(error);
 }
});

/* GET Men page. And Fetch from the database */
router.get('/men', ensureAuthenicated, async (req, res, next) => {
  try {
    const name = req.user.Username;
    const username = name.toUpperCase();
    const id = req.user._id;
    await Product.find({ ProductCategory: 'Men Fashion', AuthorCreated: id  }, (err, products) => {
      if(err){
        console.log(err);
      }else {
        Admin.findOne({Role: 'Administrator', _id: id}, (err, role) => {
          if (err) throw err;
          res.render('admin/men', { title: 'NodeStore Dashboard Categories', role: role, username: username, products:products, layout:'adminlayouts.hbs'});
        }).select({ Role: 1});
      } 
    });   
  } catch (error) {
    console.log(error);    
  }
});


/* GET Women page And Fetch from the database . */
router.get('/women', ensureAuthenicated, async (req, res, next) => {
  try {
    const name = req.user.Username;
    const username = name.toUpperCase();
    const id = req.user._id;
    await Product.find({ ProductCategory: 'Women Fashion',  AuthorCreated: id }, (err, products) => {
      if(err){
        console.log(err);
      }else {
        Admin.findOne({Role: 'Administrator', _id: id}, (err, role) => {
          if (err) throw err;
          res.render('admin/women', { title: 'NodeStore Dashboard Categories', role: role, username: username, products:products, layout:'adminlayouts.hbs'});
        }).select({ Role: 1});
      } 
    });   
  } catch (error) {
    console.log(error);    
  }
});


/* GET shoes page. And Fetch from the database .*/
router.get('/shoes', ensureAuthenicated, async (req, res, next) => {
  try {
    const name = req.user.Username;
    const id = req.user._id;
    const username = name.toUpperCase();
    await Product.find({ ProductCategory: 'Shoes',  AuthorCreated: id }, (err, products) => {
      if(err){
        console.log(err);
      }else {
        Admin.findOne({Role: 'Administrator', _id: id}, (err, role) => {
          if(err) throw err;
          res.render('admin/shoes', { title: 'NodeStore Dashboard Categories', role: role, username: username, products:products, layout:'adminlayouts.hbs'});
        }).select({ Role: 1});
      } 
    });   
  } catch (error) {
    console.log(error);    
  }
});


/* GET Phones and tabs page. */
router.get('/phones', ensureAuthenicated, async (req, res, next) => {
  try {
    const name = req.user.Username;
    const id = req.user._id;
    const username = name.toUpperCase();
    await Product.find({ ProductCategory: 'Phones and  Tablets', AuthorCreated: id }, (err, products) => {
      if(err){
        console.log(err);
      }else {
        Admin.findOne({}, (err, role) => {
          if(err) throw err;
          res.render('admin/phonesandTabs', { title: 'NodeStore Dashboard Categories', role: role, username: username, products:products, layout:'adminlayouts.hbs'});
        }).select({ Role: 1});
      } 
    });   
  } catch (error) {
    console.log(error);    
  }
});


/* GET Jewlyries page. And Fetch from the database . */
router.get('/jewlyry', ensureAuthenicated, async (req, res, next) => {
  try {
    const name = req.user.Username;
    const id = req.user._id;
    const username = name.toUpperCase();
    await Product.find({ ProductCategory: 'Jewlyries', AuthorCreated: id }, (err, products) => {
      if(err){
        console.log(err);
      }else {
        Admin.findOne({Role: 'Administrator', _id: id}, (err, role) => {
          if(err) throw err;
          res.render('admin/jewlyry', { title: 'NodeStore Dashboard Categories', role: role, username: username, products:products, layout:'adminlayouts.hbs'});
        }).select({ Role: 1});
      } 
    });   
  } catch (error) {
    console.log(error);    
  }
});

/* GET Order page. */
router.get('/order', ensureAuthenicated, (req, res, next) => {
 try {
  const name = req.user.Username;
  const username = name.toUpperCase();
  const id = req.user._id;
  Admin.findOne({Role: 'Administrator', _id: id }, (err, role) => {
    if(err) throw err;
    res.render('admin/order', { title: 'NodeStore Dashboard Categories', role: role, username: username, layout:'adminlayouts.hbs'});
  }).select({ Role: 1});
 } catch (error) {
   console.log(error);
 }
});
 

/* GET User(ADMINS) page. AND FETCH FROM FROM THE DATABASE */ 
router.get('/users', ensureAuthenicated, async (req, res, next) => {
 try {
  const name = req.user.Username;
  const username = name.toUpperCase();
  await Admin.find({}, (err, admins) => {
    if(err){
      console.log(err);
    }else {
     res.render('admin/user', { title: 'NodeStore Dashboard Categories', username: username, admins:admins, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
    } 
  });   
 } catch (error) {
   console.log(error);
 }
});
 /**
  * END OF GETTING USERS  FROM DB
  */


// Deleting  admins
router.post('/admin/delete/', async (req, res) => {
 try {
     let Id = req.body.id;
   await Admin.deleteOne({_id: Id}, (err) => {
      if(err) throw err;
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'User deleted successfully'
    }
        res.location('/access/users');
        res.redirect('/access/users');
      console.log('Deleteted');
    });
 } catch (error) {
   console.log(error);
 }
});
 /**
  * END OF DELETING ADMIN 
  *   */


// Deleting  Men category product
router.post('/product/men/delete/', async (req, res) => {
  try {
      let Id        = req.body.id;
      let pic_image = req.body.pic_image;
   await  Product.deleteOne({_id: Id}, (err) => {
       if(err) throw err;
       req.session.message = {
         type: 'success',
         intro: '',
         message: 'Product deleted successfully'
     }
        res.location('/access/men');
        res.redirect('/access/men');
        console.log('Deleteted');
     });
     // Deleting picture in the folder
     fs.unlink(`./public/uploads/${pic_image}`, (err) => {
      if(err) throw err;
      console.log('deleted successfully');
     });
  } catch (error) {
    console.log(error);
  }
 });
 /**
  * END OF DELETING MENS CATEGORY PRODUCT
  */

  
// Deleting  Women category product
router.post('/product/women/delete/', async (req, res) => {
  try {
      let Id        = req.body.id;
      let pic_image = req.body.pic_image;
   await  Product.deleteOne({_id: Id}, (err) => {
       if(err) throw err;
       req.session.message = {
         type: 'success',
         intro: '',
         message: 'Product deleted successfully'
     }
        res.location('/access/women');
        res.redirect('/access/women');
        console.log('Deleteted');
     });
     // Deleting picture in the folder
     fs.unlink(`./public/uploads/${pic_image}`, (err) => {
      if(err) throw err;
      console.log('deleted successfully');
     });
  } catch (error) {
    console.log(error);
  }
 });
 /**
  * END OF DELETING WOMENS CATEGORY PRODUCT
  */
// Deleting  SHOES category product
router.post('/product/shoes/delete/', async (req, res) => {
  try {
      let Id        = req.body.id;
      let pic_image = req.body.pic_image;
   await  Product.deleteOne({_id: Id}, (err) => {
       if(err) throw err;
       req.session.message = {
         type: 'success',
         intro: '',
         message: 'Product deleted successfully'
     }
        res.location('/access/shoes');
        res.redirect('/access/shoes');
        console.log('Deleteted');
     });
     // Deleting picture in the folder
     fs.unlink(`./public/uploads/${pic_image}`, (err) => {
      if(err) throw err;
      console.log('deleted successfully');
     });
  } catch (error) {
    console.log(error);
  }
 });
 /**
  * END OF DELETING SHOES CATEGORY PRODUCT
  */

  // Deleting  Jewlyries category product
router.post('/product/jewlyry/delete/', async (req, res) => {
  try {
      let Id        = req.body.id;
      let pic_image = req.body.pic_image;
   await  Product.deleteOne({_id: Id}, (err) => {
       if(err) throw err;
       req.session.message = {
         type: 'success',
         intro: '',
         message: 'Product deleted successfully'
     }
        res.location('/access/jewlyry');
        res.redirect('/access/jewlyry');
        console.log('Deleteted');
     });
     // Deleting picture in the folder
     fs.unlink(`./public/uploads/${pic_image}`, (err) => {
      if(err) throw err;
      console.log('deleted successfully');
     });
  } catch (error) {
    console.log(error);
  }
 });
 /**
  * END OF DELETING Jewlyries CATEGORY PRODUCT
  */


  
  // Deleting  Phones And Tabs category product
router.post('/product/phones/delete/', async (req, res) => {
  try {
      let Id        = req.body.id;
      let pic_image = req.body.pic_image;
   await  Product.deleteOne({_id: Id}, (err) => {
       if(err) throw err;
       req.session.message = {
         type: 'success',
         intro: '',
         message: 'Product deleted successfully'
     }
        res.location('/access/phones');
        res.redirect('/access/phones');
        console.log('Deleteted');
     });
     // Deleting picture in the folder
     fs.unlink(`./public/uploads/${pic_image}`, (err) => {
      if(err) throw err;
      console.log('deleted successfully');
     });
  } catch (error) {
    console.log(error);
  }
 });
 /**
  * END OF DELETING Phones and Tabs CATEGORY PRODUCT
  */




/* GET User profile page. */
router.get('/user-profile', ensureAuthenicated, (req, res, next) => {
  let id = req.user._id;
  const name = req.user.Username;
  const username = name.toUpperCase();
  Admin.findOne({_id: id }, (err, admin) => {
    if(err) throw err;
    res.render('admin/userprofile', { title: 'NodeStore Dashboard Categories', username: username, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors, admin:admin});
  console.log('see it');
    console.log(admin);
  });
});

/* GET User Chnage paswordx page. */
router.get('/user-change-password', ensureAuthenicated, (req, res, next) => {
  let id = req.user._id;
  const name = req.user.Username;
  const username = name.toUpperCase();
  Admin.findOne({Role: 'Administrator', _id: id}, (err, role) => {
    if(err) throw err;
    res.render('admin/user-change-password', { title: 'NodeStore Dashboard Categories', role: role, username: username, id: id, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
  }).select({Role: 1});
});

/**
 * POSTING DATA AND GETTING TO THE DB SECTION 
 */
// To handle file uploads
const storage =   multer.diskStorage({
  destination: './public/uploads', 
  filename:  (req,  file, callback) => {
    callback(null, file.originalname);   
  },
});
const upload = multer({
  storage : storage,
  limits: {
    fileSize: 5000000
  },
  fileFilter: (req, file, cb) => {
  // allow images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      console.log('Only image are allowed.');
  }
  cb(null, true);
}, 
});
/**END OF FUNCTION TO HANDLE FILE UPLOAD */

/**
 * ADDING NEW PRODUCT TO THE DATABASE
 */
 router.post('/product/add', upload.single('product_image'), (req, res, next) => {
  try {
    let product_name             = req.body.productName;
    let category                 = req.body.category;
    let price                    = req.body.Price;
    let size                     = req.body.size;
    let sku                      = req.body.sku;
    let brand                    = req.body.brand;
    let description              = req.body.Description;
    let product_image_file       = req.file.originalname;
    let product_image            = product_image_file;
    let id                       = req.user.id;
    // Validation point
    req.checkBody('productName', 'Product name is required').isLength({min:4, max:40}).withMessage('Product name Must be at least 4 chars long');
    req.checkBody('category', 'Category name is required').notEmpty();
    req.checkBody('Price', 'Price field is required').notEmpty();;
    req.checkBody('size', 'Product size is required').isLength({min:1, max:50}).withMessage('Size Must be at least 1 chars long');
    req.checkBody('sku', 'SKU number is required').notEmpty();;
    req.checkBody('brand', 'Product brand is required').isLength({min:4, max:50}).withMessage('Product brand Must be at least 4 chars long');
    req.checkBody('Description', 'Product description is required').isLength({min:4, max:500}).withMessage('Description Must be at least 4 chars long');
    req.checkBody('product_image', 'Product image is required');
    // Checking  for error
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors = errors;
          req.session.success = false;
          res.redirect('/access/product');
    }else {    
    //Creating new Product
    let newProduct = new Product({
      ProductName: product_name,
      ProductCategory: category,
      ProductPrice: price,
      ProductSize: size,
      SKUNumber: sku,
      ProductBrand: brand,
      ProductDescription: description,
      ProductImage: product_image,
      AuthorCreated: id
  });
    //Add New Product
    Product.createProduct(newProduct, function(err, product){
      if(err) throw err;
      //console.log(product);
    });
    req.session.message = {
      type: 'success',
      intro: '',
      message: 'New Prodct added successfully'
  }
      res.location('/access/product');
      res.redirect('/access/product');
    }
  } catch (error) {
    console.log(error);
  }
 });


// ADDING NEW ADMIN TO THE DB
 router.post('/user/add', (req, res, next) => {
try {
  let first_name                    = req.body.first_name;
  let last_name                     = req.body.last_name;
  let user_email                    = req.body.user_email;
  let username                      = req.body.username;
  let user_role                     = req.body.user_role;
  let password                      = req.body.password;
  let confirmed_password            = req.body.confirmed_password;
  // Validation form inputs
  req.checkBody('first_name', 'First name field is required').isLength({min:4, max:50}).withMessage('Must be at least 4 chars long');
  req.checkBody('last_name', 'Last name field is required').isLength({min:4, max:50}).withMessage('Must be at least 4 chars long');
  req.checkBody('user_email', 'Email field is required').isEmail().withMessage('Please provide a valid mail');
  req.checkBody('password', 'Password field is required').isLength({min:4, max:50}).equals(confirmed_password).withMessage('Confirm password does not match');
  
// Checking if errors exist
  let errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/access/users');
  }else {
    // Checking if Admin already exist
    Admin.findOne({Email: user_email }, (err, admin) => {
      if (admin) {
        req.session.message = {
            type: 'danger',
            intro: '',
            message: 'Admin already exist'
        }
            res.location('/access/users');
            res.redirect('/access/users');
      }else {
        //Creating new Admin
        let newAdmin = new Admin({
          FirstName: first_name,
          LastName: last_name,
          Email: user_email,
          Username: username,
          Role: user_role,
          Password: password
      });
      Admin.createAdmin (newAdmin, function (err, admin) {
        if (err) throw err;
        //console.log(admin);
      });
     //success message
     req.session.message = {
      type: 'success',
      intro: '',
      message: 'New Admin Registered successfully'
      }
            res.location('/access/users');
            res.redirect('/access/users');
      }
    });
  }  
  } catch (error) {
    console.log(error);
 }
});
 // Ending of code to add new admins

 // UPDATING  ADMIN TO THE DB
 router.post('/user/update/:id', (req, res, next) => {
  try {
    let id = req.params.id;
    let first_name                    = req.body.first_name;
    let last_name                     = req.body.last_name;
    let user_email                    = req.body.user_email;
    let username                      = req.body.username;
    let user_role                     = req.body.user_role;
    // Validation form inputs
    req.checkBody('first_name', 'First name field is required').isLength({min:4, max:50}).withMessage('Must be at least 4 chars long');
    req.checkBody('last_name', 'Last name field is required').isLength({min:4, max:50}).withMessage('Must be at least 4 chars long');
    req.checkBody('user_email', 'Email field is required').isEmail().withMessage('Please provide a valid mail');
    req.checkBody('user_role', 'User role field is required').notEmpty();
    
  // Checking if errors exist
    let errors = req.validationErrors();
      if (errors) {
          req.session.errors = errors;
          req.session.success = false;
          res.redirect('/access/users');
    }else {
      console.log(id.ObjectId);
     // Checking if Admin already exist
      Admin.findOne({Email: user_email }, (err, admin) => {
        if (admin) {
          req.session.message = {
              type: 'danger',
              intro: '',
              message: 'Admin already exist'
          }
              res.location('/access/users');
              res.redirect('/access/users');
        }else {
            Admin.update({_id: id }, { 
            FirstName: first_name,
            LastName: last_name,
            Email: user_email,
            Username: username,
            Role: user_role,  
    },  (err) => {
    if(err) throw err; 
        req.session.message = {
          type: 'success',
          intro: '',
          message: 'User updated successfully'
      }
          res.location('/access/users');
          res.redirect('/access/users'); 
  });           
     }
      });
    }  
    } catch (error) {
      console.log(error);
   }
  });



/* GET Single product page. AND FETCH FROM FROM THE DATABASE */ 
router.get('/show_product/:id', ensureAuthenicated, async (req, res, next) => {
  try {
    let Id = req.params.id;
   await Product.find({_id: Id }, (err, product) => {
     if(err){
       console.log(err);
     }else {
      res.render('admin/viewProduct', { title: 'NodeStore Dashboard Categories', product: product, layout: 'adminlayouts.hbs'});
     } 
   });   
  } catch (error) {
    console.log(error);
  }
 });
/**
 * END OF GETTING A SINGLE PRODUCT
 */


 /* GET Single product page. AND EDIT AND SAVE TO THE DATABASE...MEN */ 
router.get('/edit_product/:id', ensureAuthenicated, async (req, res, next) => {
  try {
    let Id = req.params.id;
   await Product.find({_id: Id }, (err, product) => {
     if(err){
       console.log(err);
     }else {
      res.render('admin/editProduct', { title: 'NodeStore Dashboard Categories', product: product, layout: 'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
     } 
   });   
  } catch (error) {
    console.log(error);
  }
 });
/**
 * END OF GETTING A SINGLE PRODUCT TO EDIT
 */

  /* GET Single product page. AND EDIT AND SAVE TO THE DATABASE...WOMEN */ 
router.get('/edit_women_product/:id', ensureAuthenicated, async (req, res, next) => {
  try {
    let Id = req.params.id;
   await Product.find({_id: Id }, (err, product) => {
     if(err){
       console.log(err);
     }else {
      res.render('admin/womenEditPage', { title: 'NodeStore Dashboard Categories', product: product, layout: 'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
     } 
   });   
  } catch (error) {
    console.log(error);
  }
 });
/**
 * END OF GETTING A SINGLE PRODUCT TO EDIT
 */

   /* GET Single product page. AND EDIT AND SAVE TO THE DATABASE...WOMEN */ 
router.get('/edit_shoes_product/:id', ensureAuthenicated, async (req, res, next) => {
  try {
    let Id = req.params.id;
   await Product.find({_id: Id }, (err, product) => {
     if(err){
       console.log(err);
     }else {
      res.render('admin/shoesEditPage', { title: 'NodeStore Dashboard Categories', product: product, layout: 'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
     } 
   });   
  } catch (error) {
    console.log(error);
  }
 });
/**
 * END OF GETTING A SINGLE PRODUCT TO EDIT
 */


   /* GET Single product page. AND EDIT AND SAVE TO THE DATABASE...Jewlyry */ 
router.get('/edit_jewlyry_product/:id', ensureAuthenicated,  async (req, res, next) => {
  try {
    let Id = req.params.id;
   await Product.find({_id: Id }, (err, product) => {
     if(err){
       console.log(err);
     }else {
      res.render('admin/JewlyryEditPage', { title: 'NodeStore Dashboard Categories', product: product, layout: 'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
     } 
   });   
  } catch (error) {
    console.log(error);
  }
 });
/**
 * END OF GETTING A SINGLE PRODUCT TO EDIT
 */
 
   /* GET Single product page. AND EDIT AND SAVE TO THE DATABASE...Jewlyry */ 
router.get('/edit_phones_product/:id', ensureAuthenicated, async (req, res, next) => {
  try {
    let Id = req.params.id;
   await Product.find({_id: Id }, (err, product) => {
     if(err){
       console.log(err);
     }else {
      res.render('admin/phonesEditPage', { title: 'NodeStore Dashboard Categories', product: product, layout: 'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
     } 
   });   
  } catch (error) {
    console.log(error);
  }
 });
/**
 * END OF GETTING A SINGLE PRODUCT TO EDIT
 */



/**
 * UPDATING SINGLE PRODUCT FOR MEN CATEGORY
 */
router.post('/product/update/:id', upload.single('product_image'), async (req, res, next) => {
  try {
    let Id                       = req.params.id;
    let product_name             = req.body.productName;
    let category                 = req.body.category;
    let price                    = req.body.Price;
    let size                     = req.body.size;
    let sku                      = req.body.sku;
    let brand                    = req.body.brand;
    let description              = req.body.Description;
    let product_image_file       = req.file.originalname;
    let product_image            = product_image_file;
    let pic_image                = req.body.pic_image;
    // Validfation point
    req.checkBody('productName', 'Product name is required').isLength({min:4, max:40}).withMessage('Product name Must be at least 4 chars long');
    req.checkBody('category', 'Category name is required').notEmpty();
    req.checkBody('Price', 'Price field is required').notEmpty();;
    req.checkBody('size', 'Product size is required').isLength({min:1, max:50}).withMessage('Size Must be at least 1 chars long');
    req.checkBody('sku', 'SKU number is required').notEmpty();;
    req.checkBody('brand', 'Product brand is required').isLength({min:4, max:50}).withMessage('Product brand Must be at least 4 chars long');
    req.checkBody('Description', 'Product description is required').isLength({min:4, max:500}).withMessage('Description Must be at least 4 chars long');
    req.checkBody('product_image', 'Product image is required');
    // Checking if error exist
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors  = errors;
          req.session.success = false;
          res.redirect(`/access/edit_product/${Id}`);
    }else {
          await  Product.update({_id: Id }, { 
          ProductName: product_name,
          ProductCategory: category,
          ProductPrice: price,
          ProductSize: size,
          SKUNumber: sku,
          ProductBrand: brand,
          ProductDescription: description,
          ProductImage: product_image     
  },  (err) => {
  if(err) throw err; 
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Product updated successfully'
    }
        res.location('/access/men');
        res.redirect('/access/men'); 
        fs.unlink(`./public/uploads/${pic_image}`, (err) => {
          if(err) throw err;
          console.log('deleted successfully');
         });
});   
}
  } catch (error) {
    console.log(error);
  }
 });

 /**
 * UPDATING SINGLE PRODUCT FOR WOMEN CATEGORY
 */
router.post('/product/women/:id', upload.single('product_image'), async (req, res, next) => {
  try {
    let Id                       = req.params.id;
    let product_name             = req.body.productName;
    let category                 = req.body.category;
    let price                    = req.body.Price;
    let size                     = req.body.size;
    let sku                      = req.body.sku;
    let brand                    = req.body.brand;
    let description              = req.body.Description;
    let product_image_file       = req.file.originalname;
    let product_image            = product_image_file;
    let pic_image                = req.body.pic_image;
    // Validfation point
    req.checkBody('productName', 'Product name is required').isLength({min:4, max:40}).withMessage('Product name Must be at least 4 chars long');
    req.checkBody('category', 'Category name is required').notEmpty();
    req.checkBody('Price', 'Price field is required').notEmpty();;
    req.checkBody('size', 'Product size is required').isLength({min:1, max:50}).withMessage('Size Must be at least 1 chars long');
    req.checkBody('sku', 'SKU number is required').notEmpty();;
    req.checkBody('brand', 'Product brand is required').isLength({min:4, max:50}).withMessage('Product brand Must be at least 4 chars long');
    req.checkBody('Description', 'Product description is required').isLength({min:4, max:500}).withMessage('Description Must be at least 4 chars long');
    req.checkBody('product_image', 'Product image is required');
    // Checking if error exist
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors  = errors;
          req.session.success = false;
          res.redirect(`/access/edit_women_product/${Id}`);
    }else {
          await  Product.update({_id: Id }, { 
          ProductName: product_name,
          ProductCategory: category,
          ProductPrice: price,
          ProductSize: size,
          SKUNumber: sku,
          ProductBrand: brand,
          ProductDescription: description,
          ProductImage: product_image     
  },  (err) => {
  if(err) throw err; 
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Product updated successfully'
    }
        res.location('/access/women');
        res.redirect('/access/women'); 
        fs.unlink(`./public/uploads/${pic_image}`, (err) => {
          if(err) throw err;
          console.log('deleted successfully');
         });
});   
}
  } catch (error) {
    console.log(error);
  }
 });



  /**
 * UPDATING SINGLE PRODUCT FOR SHOES CATEGORY
 */
router.post('/product/shoes/:id', upload.single('product_image'), async (req, res, next) => {
  try {
    let Id                       = req.params.id;
    let product_name             = req.body.productName;
    let category                 = req.body.category;
    let price                    = req.body.Price;
    let size                     = req.body.size;
    let sku                      = req.body.sku;
    let brand                    = req.body.brand;
    let description              = req.body.Description;
    let product_image_file       = req.file.originalname;
    let product_image            = product_image_file;
    let pic_image                = req.body.pic_image;
    // Validfation point
    req.checkBody('productName', 'Product name is required').isLength({min:4, max:40}).withMessage('Product name Must be at least 4 chars long');
    req.checkBody('category', 'Category name is required').notEmpty();
    req.checkBody('Price', 'Price field is required').notEmpty();;
    req.checkBody('size', 'Product size is required').isLength({min:1, max:50}).withMessage('Size Must be at least 1 chars long');
    req.checkBody('sku', 'SKU number is required').notEmpty();;
    req.checkBody('brand', 'Product brand is required').isLength({min:4, max:50}).withMessage('Product brand Must be at least 4 chars long');
    req.checkBody('Description', 'Product description is required').isLength({min:4, max:500}).withMessage('Description Must be at least 4 chars long');
    req.checkBody('product_image', 'Product image is required');
    // Checking if error exist
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors  = errors;
          req.session.success = false;
          res.redirect(`/access/edit_shoes_product/${Id}`);
    }else {
          await  Product.update({_id: Id }, { 
          ProductName: product_name,
          ProductCategory: category,
          ProductPrice: price,
          ProductSize: size,
          SKUNumber: sku,
          ProductBrand: brand,
          ProductDescription: description,
          ProductImage: product_image     
  },  (err) => {
  if(err) throw err; 
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Product updated successfully'
    }
        res.location('/access/shoes');
        res.redirect('/access/shoes'); 
        fs.unlink(`./public/uploads/${pic_image}`, (err) => {
          if(err) throw err;
          console.log('deleted successfully');
         });
});   
}
  } catch (error) {
    console.log(error);
  }
 });


   /**
 * UPDATING SINGLE PRODUCT FOR JEWLYRY CATEGORY
 */
router.post('/product/jewlyry/:id', upload.single('product_image'), async (req, res, next) => {
  try {
    let Id                       = req.params.id;
    let product_name             = req.body.productName;
    let category                 = req.body.category;
    let price                    = req.body.Price;
    let size                     = req.body.size;
    let sku                      = req.body.sku;
    let brand                    = req.body.brand;
    let description              = req.body.Description;
    let product_image_file       = req.file.originalname;
    let product_image            = product_image_file;
    let pic_image                = req.body.pic_image;
    // Validfation point
    req.checkBody('productName', 'Product name is required').isLength({min:4, max:40}).withMessage('Product name Must be at least 4 chars long');
    req.checkBody('category', 'Category name is required').notEmpty();
    req.checkBody('Price', 'Price field is required').notEmpty();;
    req.checkBody('size', 'Product size is required').isLength({min:1, max:50}).withMessage('Size Must be at least 1 chars long');
    req.checkBody('sku', 'SKU number is required').notEmpty();;
    req.checkBody('brand', 'Product brand is required').isLength({min:4, max:50}).withMessage('Product brand Must be at least 4 chars long');
    req.checkBody('Description', 'Product description is required').isLength({min:4, max:500}).withMessage('Description Must be at least 4 chars long');
    req.checkBody('product_image', 'Product image is required');
    // Checking if error exist
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors  = errors;
          req.session.success = false;
          res.redirect(`/access/edit_jewlyry_product/${Id}`);
    }else {
          await  Product.update({_id: Id }, { 
          ProductName: product_name,
          ProductCategory: category,
          ProductPrice: price,
          ProductSize: size,
          SKUNumber: sku,
          ProductBrand: brand,
          ProductDescription: description,
          ProductImage: product_image     
  },  (err) => {
  if(err) throw err; 
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Product updated successfully'
    }
        res.location('/access/jewlyry');
        res.redirect('/access/jewlyry'); 
        fs.unlink(`./public/uploads/${pic_image}`, (err) => {
          if(err) throw err;
          console.log('deleted successfully');
         });
});   
}
  } catch (error) {
    console.log(error);
  }
 });



    /**
 * UPDATING SINGLE PRODUCT FOR PHONES AND TABLETS CATEGORY
 */
router.post('/product/phones/:id', upload.single('product_image'), async (req, res, next) => {
  try {
    let Id                       = req.params.id;
    let product_name             = req.body.productName;
    let category                 = req.body.category;
    let price                    = req.body.Price;
    let size                     = req.body.size;
    let sku                      = req.body.sku;
    let brand                    = req.body.brand;
    let description              = req.body.Description;
    let product_image_file       = req.file.originalname;
    let product_image            = product_image_file;
    let pic_image                = req.body.pic_image;
    // Validfation point
    req.checkBody('productName', 'Product name is required').isLength({min:4, max:40}).withMessage('Product name Must be at least 4 chars long');
    req.checkBody('category', 'Category name is required').notEmpty();
    req.checkBody('Price', 'Price field is required').notEmpty();;
    req.checkBody('size', 'Product size is required').isLength({min:1, max:50}).withMessage('Size Must be at least 1 chars long');
    req.checkBody('sku', 'SKU number is required').notEmpty();;
    req.checkBody('brand', 'Product brand is required').isLength({min:4, max:50}).withMessage('Product brand Must be at least 4 chars long');
    req.checkBody('Description', 'Product description is required').isLength({min:4, max:500}).withMessage('Description Must be at least 4 chars long');
    req.checkBody('product_image', 'Product image is required');
    // Checking if error exist
    const errors = req.validationErrors();
      if (errors) {
          req.session.errors  = errors;
          req.session.success = false;
          res.redirect(`/access/edit_phones_product/${Id}`);
    }else {
          await  Product.update({_id: Id }, { 
          ProductName: product_name,
          ProductCategory: category,
          ProductPrice: price,
          ProductSize: size,
          SKUNumber: sku,
          ProductBrand: brand,
          ProductDescription: description,
          ProductImage: product_image     
  },  (err) => {
  if(err) throw err; 
      req.session.message = {
        type: 'success',
        intro: '',
        message: 'Product updated successfully'
    }
        res.location('/access/jewlyry');
        res.redirect('/access/phones'); 
        fs.unlink(`./public/uploads/${pic_image}`, (err) => {
          if(err) throw err;
          console.log('deleted successfully');
         });
});   
}
  } catch (error) {
    console.log(error);
  }
 });
 /**
  *  SECTION FOR ADMINS LOGIN AND LOGOUT LOGIC USING PASSPORT AND JWT
  */
 passport.use(new LocalStrategy(  {
      usernameField: 'email',
      passwordField: 'password'
 },
  function(email, password, done) {
   try {
    Admin.findOne({ Email: email }, function (err, admin) {
      if (err) { return done(err); 
      }
      if (!admin) { 
     return done (null, false);
      }
       Admin.verifyPassword(password, admin.Password, (err, isMatch) => {
         if(err) return done(err);
         if(!isMatch) {
           return done(null, false);
         }
         return done(null, admin); 
       } ); 
    });
   } catch (err) {
     console.log(err);     
   }
  }
));


 router.post('/login', passport.authenticate('local', { failureRedirect: '/access/', successRedirect: '/access/dashboard',
   //failureFlash: true,
      }), function(req,  res) {

});

// Route Middleware
function ensureAuthenicated(req, res, next) {  
  if (req.isAuthenticated()) {
      return next(); 
    }
      res.redirect('/access/');
}

//logout function
router.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/access/');
});

passport.serializeUser(function(admin, done) {
  done(null, admin.id);
});

passport.deserializeUser(function(id, done) {
  Admin.getAdminById(id, function(err, admin) {
    done(err, admin); 
  });
});



// Updating Admisn Profile
router.post('/admin/update/:id', async(req, res, next) => {
  try {
    let first_name                    = req.body.first_name;
    let last_name                     = req.body.last_name;
    let username                      = req.body.username;
     let id                           = req.params.id;
    // Validation form inputs
    req.checkBody('first_name', 'First name field is required').notEmpty().isLength({min:4, max:50}).withMessage('First Name Must be at least 4 chars long');
    req.checkBody('last_name', 'Last name field is required').notEmpty().isLength({min:4, max:50}).withMessage('Last Name Must be at least 4 chars long');
 //   req.checkBody('user_email', 'Email field is required').isEmail().withMessage('Please provide a valid mail');
    req.checkBody('username', 'Username field is required').notEmpty().isLength({min:4, max:50}).withMessage('Username Must be at least 4 chars long');
    
  // Checking if errors exist
    let errors = req.validationErrors();
      if (errors) {
          req.session.errors = errors;
          req.session.success = false;
          res.redirect('/access/user-profile');
    }else {
            // Checking if Admin already exist
            await  Admin.update({_id: id }, { 
              FirstName: first_name,
              LastName: last_name,
              Username: username,  
      },  (err) => {
      if(err) throw err; 
          req.session.message = {
            type: 'success',
            intro: '',
            message: 'Profile updated successfully'
        }
            res.location('/access/user-profile');
            res.redirect('/access/user-profile'); 
      }); 
    }  
    } catch (error) {
      console.log(error);
   }
  });
   // Ending of code to update new admins
  

   // ADmin change password part
   router.post('/admin/changePassword/', (req, res, next)=> {
    let current_password = req.body.current_password;
    let new_password = req.body.new_password;
    let confirmed_newPassword = req.body.confirmed_newPassword;
    let id = req.user._id;
    req.checkBody('current_password', 'Current password is required').notEmpty().isLength({min:8, max:50}).withMessage('password Must be at least 8 chars long');
    req.checkBody('new_password', 'Current password is required').notEmpty().isLength({min:8, max:50}).withMessage('Confirm password Must be at least 8 chars long');
    req.checkBody('new_password', 'password is required').notEmpty().equals(confirmed_newPassword).withMessage('Password confirmation fails');

    //Checking for Errors
    let errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;     
          res.location('/access/user-change-password');
          res.redirect('/access/user-change-password');
    }else {
      Admin.findOne({_id: id}, (err, admin) =>{
        if(err) throw err;
        if(!admin) {
          return console.log('unkwn');
        }
        Admin.comparePassword(current_password, admin.Password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            Admin.comparePassword(new_password, admin.Password, (err, isMatch) => {
              if(err) throw err;
              if (isMatch) {
                req.session.message = {
                  type: 'error',
                  intro: '',
                  message: 'New password can not be the same with current password'
              }
                  res.location('/access/user-change-password');
                  res.redirect('/access/user-change-password'); 
              }
              if (!isMatch) {
                bcrypt.hash(new_password, 10, async(err, hash) => {
                  if(err) throw err;
                    Admin.update({_id: id}, {
                    Password: hash
                },(err) => {
                  if(err) throw err;
                  req.session.message = {
                    type: 'success',
                    intro: '',
                    message: 'Password changed successfully'
                }
                    res.location('/access/');
                    res.redirect('/access/');              
                });
              });
                
              }
            });          
          }           
          if (!isMatch) {
            req.session.message = {
              type: 'error',
              intro: '',
              message: 'Current password is not correct'
          }
              res.location('/access/user-change-password');
              res.redirect('/access/user-change-password'); 
          }
        });
      });
    }
  });

// FORGOT PASSWORD FOR ADMIN

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(256, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      Admin.findOne({ Email: req.body.email }, (err, admin) => {
        if (!admin) {
          req.session.message = {
            type: 'error',
            intro: '',
            message: 'No account with that email address exists.'
        }
          return res.redirect('/access/');
        }
            Admin.update({Email: req.body.email}, {
                ResetPasswordToken: token,
                ResetPasswordExpires: Date.now() + 3600000 // 1 hour
            },(err) => {
              if(err) throw err;
              req.session.message = {
                type: 'success',
                intro: '',
                message: 'An e-mail has been sent to ' + req.body.email + ' with further instructions.'
            }
            var smtpTrans = nodemailer.createTransport({
              service: 'Gmail', 
              auth: {
               user: 'gaiyadev.ng@gmail.com',
               pass: '($$gaiya.dev.ng)'
             }
           });
           var mailOptions = {
            to: req.body.email,
            from: 'gaiyadev.ng@gmail.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTrans.sendMail(mailOptions, (err) => {
            if(err) throw err;
          });
            return res.redirect('/access/');
          });
      });
    },
    function(token, admin, done) {
        smtpTrans.sendMail(mailOptions, (err) =>  {
          if(err) throw err;
});
}
  ], (err) => {
    console.log('this err' + ' ' + err)
    res.redirect('/');
  });
});


//Form to reset password
router.get('/reset/:token', ensureAuthenicated, (req, res) => {
  Admin.findOne({ ResetPasswordToken: req.params.token, ResetPasswordExpires: { $gt: Date.now() } }, (err, admin) => {
      console.log(admin);
    if (!admin) {
      req.session.message = {
        type: 'error',
        intro: '',
        message: 'Password reset token is invalid or has expired.'
    }
      return res.redirect('/access/');
    }
    res.render('reset', {Admin: req.admin, title: 'Forgot password', layout:'loginLayout.hbs', success: req.session.success, errors: req.session.errors
  });
  req.session.errors = null; 

  });
});




router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, admin, next) {
        if (!admin) {
          req.session.message = {
            type: 'error',
            intro: '',
            message: 'Password reset token is invalid or has expired.'
        }
          return res.redirect('/access/');
        }
        bcrypt.hash(req.body.password, 10,(err, hash) => {
          if(err) throw err;
           resetPassword = hash
           console.log(hash);
        });
        Admin.update({resetPasswordToken: req.params.token}, {
          Password: resetPassword,
          ResetPasswordToken: "token",
          ResetPasswordExpires: Date.now() // present date
      },(err) => {
        if(err) throw err;
        var smtpTrans = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'gaiyadev.ng@gmail.com',
            pass: '($$gaiya.dev.ng)'
          }
        });
        var mailOptions = {
          to: admin.email,
          from: 'gaiyadev.ng@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            ' - This is a confirmation that the password for your account ' + admin.email + ' has just been changed.\n'
        };
         
      smtpTrans.sendMail(mailOptions, function(err) {
        if(err) throw errr;
        req.session.message = {
          type: 'error',
          intro: '',
          message: 'Password reset token is invalid or has expired.'
      }
        return res.redirect('/access/');
      });
    });
   });
    },
  ], function(err) {
    res.redirect('/acccess');
  });
});


module.exports = router;
