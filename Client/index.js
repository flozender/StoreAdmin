const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const urlExists = require('url-exists');
const cookieParser = require('cookie-parser');
var path = require('path');

let config = require('../Server/util/config');

let PORT = process.env.PORT || 80;
let serverRoute = config.serverAddress;
let clientRoute = config.clientAddress;

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

app.use('/', express.static(__dirname + '/'));
// app.use('/ide', express.static(path.resolve('../IDE')));


app.use('/customers', express.static(__dirname + '/'));
app.use('/products', express.static(__dirname + '/'));
app.use('/products/view', express.static(__dirname + '/'));

app.use('/billing', express.static(__dirname + '/'));
app.use('/billing/quotation', express.static(__dirname + '/'));


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

app.post('/signup_', async (req, res) => {
  // res.render('/home');
  let options = {
    url : serverRoute + '/signup',
    method: 'post',
    body: {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
      branch: req.body.branch
    },
    json: true
  }
  request(options, function(err, response, body){
        if (body.username && body.password){
          body.message = "Sign up successful, Account verification has been sent to your email";
        } 
        body.url = clientRoute;
        res.render('error', {data: body})

  });
});
app.post('/login_', async (req, res) => {
  let options = {
    url : serverRoute + '/login',
    method: 'post',
    body: {
      username: req.body.username,
      password: req.body.password
    },
    json: true
  }
  request(options, function(err, response, body){      
    if (body.success){
      res.cookie("token", body.token);
      res.cookie("username", body.username);
        if (body.admin){
          res.redirect('admin');
        }
        else{
          let url = {
            url: clientRoute
          };
          res.render('temp', {data: url});
        }
    } else {
      res.render('error', {data: body})
      }
        

  });
});
app.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('username');
  res.clearCookie('contestId');
  res.redirect('/home');
});

app.get('/error', async (req, res) => {
  res.render('error');
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

app.get('/customers/add', async(req, res) => {
  res.render('message');
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

app.get('/products/view/:productId', async(req, res) => {

  res.render('products/view-product', {
    data: {
      productId: req.params.productId
    }
  });
});

app.get('/products/gallery', async(req, res) => {
  res.render('products/get-gallery');
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



app.get('/billing/quotation/add', async(req, res) => {

 let customerId = req.cookies.customerId;
 let quotationId = req.cookies.quotationId;
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
    url : serverRoute + '/customers/' + customerId,
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

app.get('/billing/quotation/print', async(req, res) => {
  let customerId = req.cookies.customerId;
  let quotationId = req.cookies.quotationId;

   let options = {
     url : serverRoute + '/customers/' + customerId,
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


app.listen(PORT);
console.log('Server @ port 80');
