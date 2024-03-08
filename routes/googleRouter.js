const passport = require('passport');
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const Router = express.Router();
const MongoStore = require('connect-mongo');
Router.use(session({
    resave:false,
    saveUninitialized:true,
    secret:"mysecret",
    store:MongoStore.create({
        mongoUrl:process.env.DATABASE,
        ttl:12*60*60
    })
}))

Router.use(passport.initialize());
Router.use(passport.session());

// Define routes
Router.get('/api/google/success', async(req,res)=>{
   if(req.user)
   {
      const user=await User.findById(req.user)
      if(user){
        res.status(200).send({
            status:true,
            message:"logged in successfully",
            token:jwt.sign({_id:user._id},process.env.SECRET_KEY),
            role:user.role,
            username:user.firstname +" "+user.lastname,
            userimage:user.userimage,
            from:"google"
        })
      }
      else{
        console.log("aaaaaaaaa")
      }
   }
   else{
    res.send("Something went wrong")
   }
});

Router.get('/api/google/failed', (req,res)=>{
    res.send('failed')
});
Router.get('/api/google', 
   passport.authenticate('google', ['profile', 'email']) 
);
Router.get('/api/google/login',
    passport.authenticate('google', {
        successRedirect:"/api/google/success",
        failureRedirect:"/api/google/failed"
    } )
  );
Router.get('/api/google/logout',(req,res)=>{
    req.logOut;
    res.redirect('/')
})
module.exports = Router;
