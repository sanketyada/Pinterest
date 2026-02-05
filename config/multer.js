const multer = require("multer");
const { v1: uuidv1 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv1();
    cb(null, uniqueFilename + path.extname(file.originalname)); //bas extesion nikaal ke originalfile se new mae me jod diya
  },
  //   filename: function (req, file, cb) {
  //     const uniqueFilename = uuidv1();
  //     cb(null, uniqueFilename+file.originalname);
  //   },
});

const upload = multer({ storage: storage });
module.exports = upload;
