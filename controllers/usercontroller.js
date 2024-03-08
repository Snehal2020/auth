
const crypto =require('crypto')
const nodemailer = require('nodemailer')
const User=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require("bcrypt")
const registerController=async(req,res)=>{
    const {firstname,lastname,email,mobile,password,profession}=req.body;
    const emailexist=await User.findOne({'email':email});
    const mobileexist=await User.findOne({'mobile':mobile});
    
    if(!emailexist && !mobileexist)
    {
        const user=await new User({firstname,lastname,email,mobile,password,profession})
        await user.save()
        res.status(201).send({
            success:true,
            message:"User registration Successful"
        })
    }
    else{
        res.status(500).send({
            success:false,
            message:'User already exist'
        })
    }
}

const loginController=async(req,res)=>{
    const {email,password}=req.body;
    const emailexist=await User.findOne({'email': email})
    
    if(!emailexist )
    {    res.send("invalid credentials")
    }
    else{
        const isMatched=await bcrypt.compare(req.body.password,emailexist.password)
        if(isMatched)
        {   const token1=jwt.sign({_id:emailexist._id},process.env.SECRET_KEY)
        res.cookie("Mytoken",token1,{httpOnly:true})
            res.status(201).send({
                success:true,
                token:token1,
                role:emailexist.role,
                username:emailexist.firstname +" "+emailexist.lastname,
                userimage:emailexist.userimage,
                message:"login successful!!"
            })
        }
        else{
            res.send("invalid credentials")
        }
    }
}

const updateuserController=async(req,res)=>{
       const id=req.user._id;
      const abc=await User.findByIdAndUpdate(id,req.body,{new:true})
      console.log(abc)
      res.send(abc)
}
const updatePassword=async(req,res)=>{
  
       const password1=req.user.password;
       const id=req.user._id;
       let {oldpassword,password}=req.body;
       const isMatched=await bcrypt.compare(oldpassword,password1)
       console.log(password1+" "+oldpassword)
      if(isMatched)
      {
        req.body.password=await bcrypt.hash(password,12)
        
        const abc=await User.findByIdAndUpdate(id,req.body,{new:true})
      console.log(abc)
      res.send(abc)
      }
      else{
        res.send("incorrect ---")
      }
     
}
//********************************* Email ****************************************/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'snehallande99@gmail.com',
        pass: 'gfptiydtplekeggo'
    },
  });

const forgotPassword= async (req, res) => 
{
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Step 2: Generate a Token
    const token = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 7200000; //2 hours
    await user.save();


    // Step 3: Send Reset Email
    const resetLink = `http://localhost:3000/reset-password/${token}`; 
    const mailOptions = {
        from: 'snehallande99@gmail.com',
        to: email,
        subject: `password reset `,
        text: resetLink,
      
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            res.status(201).send({
              success:true,
              data:'Password reset link has been sent to your email'
            })
        }
      });
}

const resetpassword= async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send('Invalid or expired token..');
    }

    // Update the user's password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send('Password reset successfully');


}
module.exports={resetpassword,registerController,loginController,updateuserController,updatePassword,forgotPassword};