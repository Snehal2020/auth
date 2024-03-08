const mongoose = require('mongoose');
const bcrypt=require('bcrypt')

const userSchema=mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true,
    },
    userimage:{
        type:String,
        default:"https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    mobile:{
        type:String,
        // unique:true,
        // index:true
    },
  
    password:{
        type:String,
    },
    role:{
        type:String,
        default:'user'
    },
    profession:{
        type:String,
      
    },
    isblocked:{
       type:Boolean,
       default:false
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
},{
    timestamps:true,
}
)

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
         this.password=await bcrypt.hash(this.password,12)
    }
    next()
})

module.exports=mongoose.model('User',userSchema)