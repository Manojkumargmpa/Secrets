const mongoose=require("mongoose");

const userSchema={
    email:String,
    password:String
}

module.export=userSchema;