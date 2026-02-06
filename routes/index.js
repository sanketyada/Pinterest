var express = require("express");
var router = express.Router();

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const upload = require("../config/multer");

const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("../models/user.model");
passport.use(new LocalStrategy(userModel.authenticate()));
const uploadCloudinary = require("../config/cloudinary");

router.get("/show/pins/:id", isLoggedIn, async (req, res) => {
  // console.log(req.params.id)

  const id = req.params.id;
  if (!id) {
    redirect("/login");
  }

  const post = await postModel.findOne({ _id: id }).populate("user");
  // console.log(post)

  //sending user ,nav:true because it is used in header.ejs for profile and navbar
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("pindetail", { post, nav: true, user });
});
router.get("/show/posts", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  // console.log(user)
  res.render("show", { user, nav: true });
});

router.get("/add", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("add", { nav: true, user });
});

router.post("/changeDp", upload.single("dp"), isLoggedIn, async (req, res) => {
  // console.log(req.file)
  const user = await userModel.findOne({ username: req.session.passport.user });
  // console.log(user);
 
  const dpImage = req.file.path;
  const cloudinaryImage = await uploadCloudinary(dpImage);


  user.dp =cloudinaryImage.url;
  await user.save();
  res.redirect("/profile");
});

router.post(
  "/createPosts",
  upload.single("pic"),
  isLoggedIn,
  async (req, res) => {
    if (!req.file) {
      res.status(401).send("File not seclected");
    }
    // console.log(req.session.passport.user)
    const findUser = await userModel.findOne({
      username: req.session.passport.user,
    });

    const testImage = req.file.path;
    const cloudinaryImage = await uploadCloudinary(testImage);
    if (!cloudinaryImage) {
      res.status(404).send("Unable To uplaod the Image");
    }

    const newPost = await postModel.create({
      postText: req.body.caption,
      description: req.body.description,
      image: cloudinaryImage.url,
      user: findUser._id,
    });

    findUser.posts.push(newPost._id);
    await findUser.save();
    res.redirect("/profile");
  },
);
router.get("/index", (req, res) => {
  res.render("index");
});
router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  res.render("profile", { user, nav: true });
});
router.get("/feed", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  const post = await postModel.find().populate("user");
  // console.log(post)
  res.render("feed", { user, post, nav: true });
});
router.get("/", (req, res) => {
  res.render("register", { nav: false });
});

router.post("/register", async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    // console.log(username, fullName, email, password);

    const newUser = userModel({
      username: username,
      email: email,
      fullName: fullName,
      dp: "https://plus.unsplash.com/premium_photo-1675865394768-564a9179f411?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  res.render("login", { error: req.flash("error"), nav: false });
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
