const router = require('express').Router();
const bycript = require("bcryptjs")
const {checkUsernameFree, checkUsernameExists, checkPasswordLength, checkLoginParams} = require("../middleware/authMiddleware")
const User = require("../users/users-model.js")
const jwt = require('jsonwebtoken');
const secrets = require('./secrets')

router.post('/register', checkLoginParams, checkUsernameFree, (req, res, next) => {
  const {username, password} = req.body
  const hash = bycript.hashSync(password, 8)
  User.add({username, password: hash})
      .then(saved =>{
        console.log(saved)
        res.status(200).json(saved)
      })
      .catch(err =>{
        next(err)
      })
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    DONE 1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

     3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

     4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login',checkLoginParams, checkUsernameExists, (req, res, next) => {
  const {password} = req.body
    if(bycript.compareSync(password, req.user.password)){
      // req.session.user = req.user
      const token = generateToken(req.user)
      res.json({ message: `Welcome ${req.user.username}`, token})
    }
    else{
      next({status: 401, message: 'Invalid credentials'})
    }
  
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

  function generateToken(user) {
    const payload = {
      subject: user.id, 
      username: user.username
    };
  
    const options = {
      expiresIn: '1h', 
    };
    return jwt.sign(payload, secrets.jwtSecret, options); 
  }
});

module.exports = router;
