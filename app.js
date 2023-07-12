//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://127.0.0.1:27017/UserDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB:", err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        console.log("User is not authenticated");
        res.redirect("/login");
    }
});

app.post("/register", async (req, res) => {
    try {
        const user = new User({ email: req.body.username });
        await User.register(user, req.body.password);
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
        });
    } catch (err) {
        console.log(err);
        res.redirect("/register");
    }
});

app.post("/login", (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Successfully connected to server");
});
