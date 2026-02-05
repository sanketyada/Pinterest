var express = require("express");
var router = express.Router();

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const upload = require("../config/multer");

const LocalStrategy = require("passport-local");
const passport = require("passport");
passport.use(new LocalStrategy(userModel.authenticate()));

router.post("/uploads", upload.single("pic"), isLoggedIn, async (req, res) => {
  if (!req.file) {
    res.status(401).send("File not seclected");
  }
  // console.log(req.session.passport.user)
  const findUser = await userModel.findOne({
    username: req.session.passport.user,
  });

  const newPost = await postModel.create({
    postText: req.body.caption,
    image: req.file.filename,
    user: findUser._id,
  });

  findUser.posts.push(newPost._id);
  await findUser.save();
  res.redirect("/profile");
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  res.render("profile", { user });
  // console.log(user)
});
router.get("/feed", (req, res) => {
  res.render("feed");
});
router.get("/", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    // console.log(username, fullName, email, password);

    const newUser = userModel({
      username: username,
      email: email,
      fullName: fullName,
    });

    await userModel.register(newUser, password);
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", (req, res) => {
  // console.log(req.flash("error"))
  res.render("login", { error: req.flash("error") });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
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
