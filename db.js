const mongoose = require('mongoose');
require('dotenv').config();
try {
    mongoose.connect(process.env.DATABASE,{useNewUrlParser:true})
    console.log("\n...Database connnected Successfully...\n")
} catch (error) {
    console.log(error)
}