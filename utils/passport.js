const passport = require('passport');
const User=require('../models/userModel')
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/google/login",
    scope:['profile','email']
  },
  async(accessToken, refreshToken, profile, cb) => {
    let data=profile?._json
    console.log(profile)
    const user=await User.findOne({email:data.email})
    if(user){
        return await cb(null, user);
    }
    else{
        const newUser=await User.create({
            firstname:data.given_name,
            lastname:data.family_name,
            userimage:data.picture,
            email:data.email,
            role:'user'
        });
       return await cb(null,newUser);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id); // Assuming user.id uniquely identifies the user
});

passport.deserializeUser((req,user,done) => {
    done(null, user);
});