const jwt = require('jsonwebtoken');
const users = require('../models/users.js');
const usersAuthentication = require('../models/user-authentication.js')
require('dotenv').config();

module.exports = (req, res) => {

   const {userId, password} = req.body;

   const user = users.find(user => user.userId === userId && user.password === password)

   if(user){
       const loginUser = usersAuthentication.find(_user => _user.userId === user.userId);
       loginUser.login = true
       if(loginUser){
          const index = usersAuthentication.findIndex(_user => _user.userId === user.userId)
          usersAuthentication.splice(index,1,loginUser);
          const token = jwt.sign({userId:user.userId},process.env.JWT_SECRETE,{expiresIn: '1d'})
          return res.status(200).json({token});

       }else{
           return res.status(404).json("User not found");
       }
   }else{
    return res.status(401).json("Login credential not correct");
   }

}