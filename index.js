const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const urlExists = require('url-exists');
const cookieParser = require('cookie-parser');
var path = require('path');
var glob = require('glob');
const mongoose = require('mongoose');
let moment = require('moment');
const upload = require('express-fileupload');
const fs = require('fs');
let config = require('./util/config');
let middleware = require('./util/middleware.js');

let PORT = process.env.PORT || 80;
let serverRoute, clientRoute;
serverRoute = config.serverAddress + PORT;
clientRoute = config.clientAddress + PORT;

// Production
serverRoute = "https://itwarestoremanage.herokuapp.com";
clientRoute = "https://itwarestoremanage.herokuapp.com";

const app = express();
app.options('*', cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(upload());

app.use('/', express.static(__dirname + '/'));
// app.use('/ide', express.static(path.resolve('../IDE')));


app.use('/customers', express.static(__dirname + '/'));
app.use('/products', express.static(__dirname + '/'));
app.use('/products/view', express.static(__dirname + '/'));

app.use('/billing', express.static(__dirname + '/'));
app.use('/billing/quotation', express.static(__dirname + '/'));

app.use( express.static(__dirname + '/'));



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



// Require contest 
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
  res.json({status: "working"});

});

app.post('/testPost', async (req, res) => {
  console.log('request body');
  console.log(req.body);
  res.json(req.body);
});

// app.use('/contests/questions', express.static(__dirname + '/'));
// app.use('/admin', express.static(__dirname + '/'));



app.get('/', async (req, res) => {
  res.render('home');
});
app.get('/index', async (req, res) => {
  res.render('home');
});
app.get('/home', async (req, res) => {
  res.render('home');
});
app.get('/about', async (req, res) => {
  res.render('about');
});

app.get('/login', async (req, res) => {
  let url = {
    url: clientRoute
  }
  res.render('login', {data: url});
});

// Custome Calls Code

app.get('/customers/get', async(req, res) => {
  let options = {
    url : serverRoute + '/customers',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    if (!body){
      let body = {
        message: "No Products found"
      };
    }
    // console.log(body);
    res.render('customers/get-customers', {data: body});
  });  
});



app.get('/customers/delete', async(req, res) => {
  res.render('message');
});

app.get('/customers/update', async(req, res) => {
  res.render('message');
});

app.get('/products/get', async(req, res) => {
  let options = {
    url : serverRoute + '/products',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    if (!body){
      let body = {
        message: "No Products found"
      };
    }
    // console.log(body);
    res.render('products/get-products', {data: body});
  });
});


app.get('/products/add', async(req, res) => {

    products.getAll((err, prods) => {
      let body = {
        message: "No Products found",
        serverRoute: serverRoute,
        clientRoute: clientRoute
    };
    body.products = prods;
    res.render('products/add-products', {data: body});
    });

});

app.get('/products/view/:productId', async(req, res) => {
  let productId = req.params.productId;
  glob("dist/img/products/"+ productId +"/*.*", null, function (er, files) {
    body = {
      files: files,
      productId: productId
    };
    res.render('products/view-product', {data: body});
  });
});

app.get('/products/gallery', async(req, res) => {
  glob("dist/img/products/**/*.*", null, function (er, files) {
    body = {
      files: files
    };
    res.render('products/get-gallery', {data: body});
  });
 
});

app.get('/products/hsn', async(req, res) => {
  let options = {
    url : serverRoute + '/hsn',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    if (!body){
      let body = {
        message: "No Products found"
      };
    }
    // console.log(body);
    res.render('products/get-hsn', {data: body});
  });
});

app.get('/billing/quotation', async(req, res) => {
  let options = {
    url : serverRoute + '/customers',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    // console.log(body);
    body.serverRoute = serverRoute;
    body.clientRoute = clientRoute;
    res.render('billing/create-quotation', {data: body});
  });
});

app.get('/billing/quotation/get', async(req, res) => {
  let options = {
    url : serverRoute + '/quotations',
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }
  request(options, function(err, response, body){
    if (!body){
      let body = {
        message: "No Quotations found"
      };
    }
    // console.log(body);
    res.render('billing/get-quotations', {data: body});
  });
});

app.get('/customers/add', async(req, res) => {
    // console.log(body);
    let body = {};
    body.serverRoute = serverRoute;
    body.clientRoute = clientRoute;
    res.render('customers/add-customers', {data: body});
});


app.get('/billing/quotation/add/:customerId/:quotationId', async(req, res) => {

 let customerId = req.params.customerId;
 let quotationId = req.params.quotationId;
 let options = {
  url : serverRoute + '/quotations',
  method: 'post',
  headers: {
    'authorization': req.cookies.token
  },
  body: {
    quotationId: quotationId,
    customerId: customerId
  },
  json: true
}

request(options, function(err, response, body1){
  let options = {
    url : serverRoute + '/customers/id/' + customerId,
    method: 'get',
    headers: {
      'authorization': req.cookies.token
    },
    json: true
  }

request(options, function(err, response, body){
 
    // console.log(body);
    
    var datetime = new Date();

    body = body[0];
    body.serverRoute = serverRoute;
    body.today = datetime.toDateString();
    body.clientRoute = clientRoute;

    let options = {
      url : serverRoute + '/products',
      method: 'get',
      headers: {
        'authorization': req.cookies.token
      },
      json: true
    }

    request(options, function(err, response, productBody){
      body.products = productBody;

      let options = {
        url : serverRoute + '/quotations/' + quotationId,
        method: 'get',
        headers: {
          'authorization': req.cookies.token
        },
        json: true
      }
      request(options, function(err, response, productQuot){
      
        body.quotations = productQuot;
        body.quotationId = quotationId;

        // console.log(JSON.stringify(body, null, 2));      
        res.render('billing/add-quotation', {data: body});
      });
    });
  });
});
});

app.get('/billing/quotation/print/:customerId/:quotationId', async(req, res) => {
  let customerId = req.params.customerId;
  let quotationId = req.params.quotationId;

   let options = {
     url : serverRoute + '/customers/id/' + customerId,
     method: 'get',
     headers: {
       'authorization': req.cookies.token
     },
     json: true
   }
 
 request(options, function(err, response, body){
  
     // console.log(body);
     
     var datetime = new Date();
 
     body = body[0];
     body.serverRoute = serverRoute;
     body.today = datetime.toDateString();
     body.clientRoute = clientRoute;
 
     let options = {
       url : serverRoute + '/products',
       method: 'get',
       headers: {
         'authorization': req.cookies.token
       },
       json: true
     }
 
     request(options, function(err, response, productBody){
       body.products = productBody;
 
       let options = {
         url : serverRoute + '/quotations/' + quotationId,
         method: 'get',
         headers: {
           'authorization': req.cookies.token
         },
         json: true
       }
       request(options, function(err, response, productQuot){
       
         body.quotations = productQuot;
         body.quotationId = quotationId;
        //  console.log(JSON.stringify(body, null, 2));      
         res.render('billing/print-quotation', {data: body});
       });
     });
   });
 });

app.get('/message', async(req, res) => {
  let body = {
    message:"Available in Full Version"
  };
  res.render('message', {data:body});
});

app.get('/billing/invoice', async(req, res) => {
  let body = {
    message:"Available in Full Version"
  };
  res.render('message', {data:body});
});

app.post('/uploadImage/:productId', async (req, res) => {
  console.log(req.files);
  if (req.files){
    // console.log(req.files);
    fs.readdir('./dist/img/products/' + req.params.productId, (err, lenOfFiles) => {
      let fLen = lenOfFiles.length;
      let file = req.files.iProdImg,
      filename = file.name;
      console.log("LENGTH",fLen);
      file.mv("./dist/img/products/" + req.params.productId +"/" + fLen + '.jpg', function(err){
        if(err){
        console.log(err);
        res.send("error occured");
      }
      else{
        res.redirect(clientRoute + "/products/add" );
      }
      });  
    });
  } else{
    res.render("message");
  }
});

app.listen(PORT);
console.log('Running @ port 80');
