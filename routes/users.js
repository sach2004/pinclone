const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://sachin:sachin@cluster0.nlf26rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

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


