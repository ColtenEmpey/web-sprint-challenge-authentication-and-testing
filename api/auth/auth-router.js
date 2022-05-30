const router = require('express').Router();
const bycript = require("bcryptjs")
const {checkUsernameFree, checkUsernameExists, checkPasswordLength, checkLoginParams} = require("../middleware/authMiddleware")
const User = require("../users/users-model.js")
const jwt = require('jsonwebtoken');
const secrets = require('./secrets')

router.post('/register', checkLoginParams, checkUsernameFree, (req, res, next) => {
  const {username, password} = req.body
  console.log(req.body)
  const hash = bycript.hashSync(password, 8)
  User.add({username, password: hash})
      .then(saved =>{
        console.log(saved)
        res.status(200).json(saved)
      })
      .catch(err =>{
        next(err)
      })
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
