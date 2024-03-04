var express = require('express');
var router = express.Router();
var userModel = require('./users');
var postModel = require('./posts');
const localStrategy = require("passport-local");
const passport = require('passport');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));


router.post('/delete', isLoggedIn, async(req,res) =>{

  const postId = req.body.postidform;
  try {
    
    await postModel.findByIdAndDelete(postId);

    let user = await userModel.findOne({ username: req.session.passport.user });
    user.posts = user.posts.filter(post => post.toString() !== postId);
    await user.save();
    res.redirect('/profile'); // Redirect back to the profile page after deletion
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the post");
  }
  
  
})


router.post('/upload', isLoggedIn, upload.single('file'), async (req,res) =>{
  if(!req.file){
    return res.status(400).send('No file were uploaded.');
  }
  let user = await userModel.findOne({username : req.session.passport.user })
  let currpost = await postModel.create({
    postText : req.body.filecaption,
    image : req.file.filename,
    userid : user._id
  });

  user.posts.push(currpost._id)
  await user.save();

  res.redirect('/profile');

});

router.post('/dpupload', isLoggedIn, upload.single('file'), async (req,res) =>{
  if(!req.file){
    return res.status(400).send('No file were uploaded.');
  }
  let user = await userModel.findOne({username : req.session.passport.user });
  user.dp=req.file.filename;
  await user.save();

  res.redirect('/profile');

});

router.get('/uploadfile', isLoggedIn, (req,res) =>{
  res.render('uploadfile');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed', { title: 'Feed Page' });
});

router.post('/register', function(req, res){
  const userData = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email
  })

  userModel.register(userData,req.body.password).then(function(registerduser){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    })
  })
});


router.get('/profile', isLoggedIn, async function(req, res){

  let curruser = await userModel.findOne({
    username : req.session.passport.user
  }).populate("posts");
  console.log(curruser);

  res.render('profile', {curruser});
});

router.get('/logout', function(req,res,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/login');
  });
});

function isLoggedIn(req,res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function(req,res){});

module.exports = router;
