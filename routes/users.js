const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://thankachansachin1503:iz1glhyn6lCLB7oW@cluster0.s944z.mongodb.net/");

const plm = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "Post"  

  }],

  dp:{
    type: String
  },

  fullname: {
    type: String,
    required: true
  }
  }
);

userSchema.plugin(plm);


module.exports = mongoose.model('User', userSchema);


