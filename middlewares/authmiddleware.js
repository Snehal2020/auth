const jwt=require('jsonwebtoken')
const User= require('../models/userModel')

const requireSignin=async(req,res,next)=>{
    const decode=jwt.verify(req.headers.authorization,process.env.SECRET_KEY)
    const user1=await User.findById(decode?._id)
    req.user=user1;
    next();
}
const isAdmin=async(req,res,next)=>{
      if(req.user.role=='admin')
      {  
         next();
      }
      else{
         res.status(400).send({
            success:false,
            message:"Unauthorised user"
         })
      }
}
module.exports={requireSignin,isAdmin}