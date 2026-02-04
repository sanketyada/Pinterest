var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require("./config/db")
connectDB()
const session = require("express-session")
const passport = require("passport")

//models setup
const userModel = require("./models/user.model")
const postModel = require("./models/post.model")


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set("view engine","ejs")
//express-Session Setup
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:"Sanket!232"
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())







app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
