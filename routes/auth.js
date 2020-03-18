const multer = require('multer');
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
  let role = Admin.find({ Role: 'Administrator'}, (err, role) => {
    if(err) throw err;
    const name = req.user.Username;
    const username = name.toUpperCase();
    res.render('admin/index', { title: 'NodeStore Dashboard',  role: role,  username: username, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
    req.session.errors = null;
  });
 
});

/* GET Categories page. */
router.get('/product', ensureAuthenicated, (req, res, next) => {
  const id = req.user._id;
  const name = req.user.Username;
  const username = name.toUpperCase();
  res.render('admin/product', { title: 'NodeStore Dashboard Categories', username: username, id: id, layout:'adminlayouts.hbs', success: req.session.success, errors: req.session.errors});
  req.session.errors = null;
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
        res.render('admin/men', { title: 'NodeStore Dashboard Categories', username: username, products:products, layout:'adminlayouts.hbs'});
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
    await Product.find({ ProductCategory: 'Women Fashion'}, (err, products) => {
      if(err){
        console.log(err);
      }else {
        res.render('admin/women', { title: 'NodeStore Dashboard Categories', username: username, products:products, layout:'adminlayouts.hbs'});
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
    const username = name.toUpperCase();
    await Product.find({ ProductCategory: 'Shoes'}, (err, products) => {
      if(err){
        console.log(err);
      }else {
        res.render('admin/shoes', { title: 'NodeStore Dashboard Categories', username: username, products:products, layout:'adminlayouts.hbs'});
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
    const username = name.toUpperCase();
    await Product.find({ ProductCategory: 'Phones and  Tablets'}, (err, products) => {
      if(err){
        console.log(err);
      }else {
        res.render('admin/phonesandTabs', { title: 'NodeStore Dashboard Categories', username: username, products:products, layout:'adminlayouts.hbs'});
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
    const username = name.toUpperCase();
    await Product.find({ ProductCategory: 'Jewlyries'}, (err, products) => {
      if(err){
        console.log(err);
      }else {
        res.render('admin/jewlyry', { title: 'NodeStore Dashboard Categories', username: username, products:products, layout:'adminlayouts.hbs'});
      } 
    });   
  } catch (error) {
    console.log(error);    
  }
});

/* GET Order page. */
router.get('/order', ensureAuthenicated, (req, res, next) => {
  const name = req.user.Username;
  const username = name.toUpperCase();
  res.render('admin/order', { title: 'NodeStore Dashboard Categories', username: username, layout:'adminlayouts.hbs'});
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
     //console.log(admins); 
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
  res.render('admin/userprofile', { title: 'NodeStore Dashboard Categories', layout:'adminlayouts.hbs'});
});

/* GET User Chnage paswordx page. */
router.get('/user-change-password', ensureAuthenicated, (req, res, next) => {
  res.render('admin/user-change-password', { title: 'NodeStore Dashboard Categories', layout:'adminlayouts.hbs'});
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
     return done (null, false, {message: 'Invalid username or password'} );
      }
       Admin.verifyPassword(password, admin.Password, (err, isMatch) => {
         if(err) return done(err);
         if(!isMatch) {
           return done(null, false, {message: 'Invalid username or password'});
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
   failureFlash: true,
   successFlash: 'Welcome!',
   failureFlash: 'Invalid username or password.'
      }), function(req,  res) {
        req.flash('info', 'yewad')
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



module.exports = router;
