var express = require("express");
var router = express.Router();

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

const LocalStrategy = require("passport-local")
const passport = require("passport")
passport.use(new LocalStrategy(userModel.authenticate()))

router.get("/register",(req,res)=>{
  res.render("register")
})
router.get("/register",(req,res)=>{
  res.send("register")
})


module.exports = router;
