const { log } = require('console');
const userRepo =  require('../repository/user-repository');
const jwt = require('jsonwebtoken');
const env  = require('dotenv').config();
const {promisify} = require('util');
const mysql2 = require('mysql2');
const dbConfig = require('../dbconfig');
const db = mysql2.createConnection(dbConfig);

async function register(req,res){
    const data  = {name,email,password,confirm_password} = req.body;
    await userRepo.validateUser(data).then((result)=>{
            if (result) {
                res.render('register',{msg:result.msg?result.msg:'Email is already taken',msg_type:'error'});              
            } else {
                res.render('register',{msg:'User Registered Successfully',msg_type:'good'});                             

            }
 });  
}
async function loginUser(req,res){
    const data  = {email,password} = req.body;
    if (!data.email || !data.password) {
        res.status(400).render('index',{msg:'Please Enter Your Email and Password',msg_type:'error'})
    } else {
        await userRepo.loginUser(data).then((result)=>{
            if (result) {
                const id = result;
                const token = jwt.sign({id:id},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES_IN,
                });    
                const cookieOptions = {
                    Expires: new Date(Date.now() +  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly:true
                }
                const idStr = result.toString()
                res.cookie(`${idStr}`,token,cookieOptions);                
                res.status(200).redirect('/home')
            } else {                            
                res.status(400).render('index',{msg:'Please Enter Your Email and Password Correctly',msg_type:'error'})
            }
 });    
    }
}

async function isLoggedIn(req,res,next){
    try {      
      if (Object.keys(req.cookies).length != 0) {
        const decode = await promisify(jwt?.verify)(
        req.cookies[Object.keys(req.cookies)],process.env.JWT_SECRET)
       let result = await db.promise().query("SELECT * from users where id =?",[decode.id])
        if (!result) {
          return next();
        } else {
           req.user = result[0][0];
           return next()
        }
         
    } else {
        next();
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function logoutUser(req,res,next){
    try {
      res.cookie("2","logout",{
        expires:new Date(Date.now() + 1*10000),
        httpOnly:true
      });
      res.status(200).redirect("/")
      
    } catch (error) {
      console.log(error);
    }
  }
module.exports = {
    register:register,
    loginUser:loginUser,
    isLoggedIn:isLoggedIn,
    logoutUser:logoutUser,
}