const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const request = require('request');
const upload = require('express-fileupload');
let moment = require('moment');
var path = require('path');

let config = require('./util/config');
let middleware = require('./util/middleware.js');
let PORT = process.env.PORT || 5000;

// INIT
const app = express();
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(upload());

// CODE STARTS HERE

mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
moment.suppressDeprecationWarnings = true;

dbConfig = {
  url: config.dbURL
}
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Imports
const users = require('./controllers/user.controller.js');
const customers = require('./controllers/customer.controller.js');
const hsns = require('./controllers/hsn.controller.js');
const products = require('./controllers/product.controller.js');
const quotations = require('./controllers/quotation.controller.js');



// Require contest routes
// require('./routes/user.route.js')(app);
// Require user routes
require('./routes/customer.route.js')(app);
// Require question routes
require('./routes/product.route.js')(app);
// Require submission routes
require('./routes/quotation.route.js')(app);
// Require participation routes
require('./routes/hsn.route.js')(app);



// Examples
app.get('/testGet', async (req, res) => {
    console.log("Tested Get");
    res.json({status: "working"});
  
});

app.post('/testPost', async (req, res) => {
    console.log('request body');
    console.log(req.body);
    res.json(req.body);
});

// app.post('/addProduct', async (req, res) => {
//   let productId = req.body.productId;
//   let quantity = req.body.quantity;
//   let discount = req.body.discount;
//   let price, amount, tax, net;

//   products.getDetails(req, (err, product) => {

//     if (err){
//       res.json({
//         success: false,
//         message: "Product not Found"
//       })
//     }

//     price = product.productSV;
//     req.body.hsnId = product.productHSN;

//     hsns.getDetails(req, (err, hsn) => {

//       if (err){
//         res.json({
//           success: false,
//           message: "Product not Found"
//         })
//       }

//       tax = hsn.tax;

//       let itemToAdd = {

//       }

//     });
    

    
//   });



// });


// app.post('/uploadpdf', middleware.checkTokenAdmin, async (req, res) => {
//   if (req.files){
//     // console.log(req.files);
//     let file = req.files.upfile,
//         filename = file.name;
//     file.mv("../Public/pdf/"+filename, function(err){
//       if(err){
//         console.log(err);
//         res.send("error occured");
//       }
//       else{
//         res.json({
//           success: true,
//           message: "uploaded",
//           filename: filename
//         });
//       }
//     });
//   } else{
//     res.send("Failed");
//   }
// });

app.listen(PORT,()=>console.log('Server @ port 5000'));
