const express= require('express');
const { notfound, handleError } = require('./middlewares/errorhandler');
const {requireSignin,isAdmin}=require('./middlewares/authmiddleware')
const session=require('express-session')
require('dotenv').config();
const app=express();

// app.use(notfound);
app.use(handleError)
app.use(express.json())
const userRouter=require('./routes/userRouter')
app.use("/api/user",userRouter)
const googleRouter=require('./routes/googleRouter')
app.use("/",googleRouter)
const PORT=process.env.PORT||port;

require('./db')
const passport = require('passport');
const MongoStore = require('connect-mongo');
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:"mysecret",
    store:MongoStore.create({
        mongoUrl:process.env.DATABASE,
        ttl:12*60*60
    })
}))

app.use(passport.initialize());
app.use(passport.session());

require('./utils/passport')
app.get('/',(req,res)=>{
    console.log("fgyhjuk")
    res.send(`<a href="http://localhost:5000/api/google">login with google</a>`);
   
})
app.get('/about',requireSignin,(req,res)=>{
    res.send("Protected Rout");
})

app.listen(PORT,()=>{
    console.log(`\nListening on port http://localhost:${PORT}`)
})
