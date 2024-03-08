const express=require('express')

const {resetpassword,registerController,loginController,updateuserController,updatePassword,forgotPassword}=require('../controllers/usercontroller');
const { requireSignin, isAdmin } = require('../middlewares/authmiddleware');
const Router=express.Router();

Router.post('/register',registerController);
Router.post('/login',loginController);
Router.put('/update-user',requireSignin,isAdmin,updateuserController)
Router.put('/update-pass',requireSignin,updatePassword)
Router.post('/forgot-password',forgotPassword);
Router.post('/reset-password/:token',resetpassword);

module.exports=Router;