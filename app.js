//jshint esversion:6
const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const ejs=require("ejs");
// const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;
const encrypt=require("mongoose-encryption");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({
    extended:true
}));

const mongoose=require("mongoose");
require("dotenv").config();
//const userSchema=require("./Usermodel.js");

mongoose.connect('mongodb://127.0.0.1:27017/UserDB');

app.set("view engine",'ejs');
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/register",async (req,res)=>{

   try{
const hashedone=await bcrypt.hash(req.body.password,saltRounds);
const user=new User({
email:req.body.username,
password:hashedone
})
await user.save();
res.render("secrets")
   }
   catch(err){
    if(err)console.log(err);
   }

})
app.post("/login",async(req,res)=>{
    try{
        const emailuser=req.body.username;
       // const passworduser=await bcrypt.hash(req.body.password,saltRounds);
        const founduser=await User.findOne({email:emailuser});
        //console.log(passworduser);
        //console.log(founduser.password);
        const oldpassword=founduser.password;
        bcrypt.compare(req.body.password, oldpassword, function(err, result) {
            // result == true
            if(err)console.log(error);
            else if(result){
                res.render("secrets");
            }
        });
    }
    catch(err){
        console.log(err);
    }
})






app.listen(3000,function(){
console.log("Successfully connected to server");
})