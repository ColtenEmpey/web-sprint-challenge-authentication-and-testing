const User = require("../users/users-model")

function restricted(req, res, next) {
  if(req.session.user){
    next()
  }
  else{
    res.status(401).json({message: "You shall not pass!"})
  }
}

async function checkUsernameFree(req, res, next) {  
    try {
        const users = await User.findBy({username: req.body.username })
        if(!users.length) next()
        else{
          next({message : "username taken", status : 400})
        }
    }
    catch(err){
      next(err)
    }
  }
  
async function checkLoginParams(req, res, next) {
  try {
    const {username, password} = req.body
    if(username && password){next()}
    else {next({message: "username and password required", status: 400})}
  }
  
  catch(err){
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const user = await User.findBy({username: req.body.username})
    if(user.length){ 
      req.user = user[0]
      next()
    }
    else{
      next({message : "Invalid credentials", status : 401})
    }
  }
  catch(err){
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
async function checkPasswordLength(req, res, next) {
  if(!req.body.password || req.body.password.length < 3){
    next({message: "Password must be longer than 3 chars", status: 422})
  }
  else{
    next()
  }
}

module.exports = {restricted,
     checkUsernameFree,
     checkUsernameExists,
     checkLoginParams,
     checkPasswordLength}