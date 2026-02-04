var express = require("express");
var router = express.Router();

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

const LocalStrategy = require("passport-local");
const passport = require("passport");
passport.use(new LocalStrategy(userModel.authenticate()));


router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});
router.get("/feed",(req,res)=>{
  res.render("feed")
})
router.get("/", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    console.log(username, fullName, email, password);

    const newUser = await userModel({
      username: username,
      email: email,
      fullName: fullName,
    });

    await userModel.register(newUser, password);
    passport.authenticate("local")(req, res, () => {
      res.render("profile");
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/profile");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
