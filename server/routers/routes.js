const express = require('express');
const router  =  express.Router();
const userController = require('../controller/userscontroller')

router.get(["/","/login"],(req,res,next)=>{
    res.render("index")
});
router.get("/register-form",(req,res,next)=>{
    res.render("register")
});
router.get("/profile",userController.isLoggedIn,(req,res,next)=>{
    if (req.user) {
        res.render("profile",{user:req.user})
    } else {
        res.redirect("/login")
    }
});
router.get("/home",userController.isLoggedIn,(req,res,next)=>{  
    if (req.user) {
        res.render("home")
    } else {
        res.redirect("/login")
    }
});

module.exports = router;