require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app=express();
const path=require('path')

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const {isLoggedIn}=require("./middleware.js");



const connect=require('./connection/connect.js');
;
const methodOverride = require('method-override');
const engine = require('ejs-mate');


const session=require('express-session');
const flash=require('connect-flash');

const listingRoute=require("./routes/listingRoute.js");
const userRoute=require("./routes/userRoute.js");



var User = require('./models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: 'mongodb://localhost',
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: { maxAge: 3*60*60*1000 }
}));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.status=req.flash("status");
    res.locals.error=req.flash("error");
    res.locals.curUser=req.user;
    next();
})

const corsOptions = {
    origin: process.env.MONGO_URL,
    credentials: true
}
app.use(cors(corsOptions));


app.engine('ejs', engine);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));

connect();

app.set("view-engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use("/listing", listingRoute);
app.use("/",userRoute);

app.get("/",(req,res)=>{
    res.redirect("/listing")
})


app.listen(2000,()=>{
    console.log("Server is listening at port 2000");
})