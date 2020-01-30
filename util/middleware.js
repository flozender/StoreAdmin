let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
  if (true){
    next();
  } else{

  let token = req.cookies.token || req.headers['x-access-token'] || req.headers['authorization']; 
  // Express headers are auto converted to lowercase
  // 
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        if(decoded.username){
          req.decoded = decoded;
          next();
        } else {
          return res.json({
            success: false, 
            message: 'Invalid Request'
          });
        }
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Invalid Request!'
    });
  }
}

};

let checkTokenAdmin = (req, res, next) => {
  let token = req.cookies.token || req.headers['x-access-token'] || req.headers['authorization']; 
  // Express headers are auto converted to lowercase
  // req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        if (decoded.admin){
          req.decoded = decoded;
          next();
        } else {
          return res.json({
            success: false,
            message: "Unauthorized Access"
          });
        }
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};
module.exports = {
  checkToken,
  checkTokenAdmin
}

