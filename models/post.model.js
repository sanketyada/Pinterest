const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description:{
    type:String
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
