const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },

  image: {
    type: String

  },

  userid: {
    type : mongoose.Schema.Types.ObjectId ,
    ref: 'User'
  },

  likeCount: [{
    type: Number,
    default: 0
  }],

  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports=  mongoose.model('Post', postSchema);


