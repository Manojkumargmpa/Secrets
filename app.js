//jshint esversion:6
const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const ejs=require("ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({
    extended:true
}));

const mongoose=require("mongoose");
//const userSchema=require("./Usermodel.js");

mongoose.connect('mongodb://127.0.0.1:27017/UserDB');

app.set("view engine",'ejs');
const userSchema={
    email:String,
    password:String
}
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

app.post("/register",async(req,res)=>{

    try {
        const newuser = new User({
          email: req.body.username,
          password: req.body.password
        });
      
        await newuser.save();
        res.render("secrets");
      } catch (err) {
        console.log(err);
      }

})
app.post("/login",async(req,res)=>{
    try{
        const emailuser=req.body.username;
        const passworduser=req.body.password;
        const founduser=await User.findOne({email:emailuser});
        if(founduser)
        {
            if(passworduser==founduser.password){
                res.render("secrets");
            }
            else{
            
                res.redirect("/");
            }

        }
    }
    catch(err){
        console.log(err);
    }
})






app.listen(3000,function(){
console.log("Successfully connected to server");
})