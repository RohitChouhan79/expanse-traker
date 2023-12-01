var express = require('express');
var router = express.Router();
const User=require("../models/userModels")
const passport=require("passport")  
const LocalStrategy=require("passport-local")
passport.use(new LocalStrategy(User.authenticate()))
const Expanse=require("../models/expanseModels")

const {sendmail}=require("../utils/sendmail")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{admin:req.user});
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{admin:req.user});
});

router.post('/signup',async function(req, res, next) {
  try {
     User.register({
      username:req.body.username,email:req.body.email
    },req.body.password);
    res.redirect("/login")
  } catch (error) {
    res.send(error)
  }
});

router.get('/login', function(req, res, next) {
  res.render('login',{admin:req.user});
});

router.post('/login',
  passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
  }),
  function(req,res,next){}
);

router.get('/forget', function(req, res, next) {
  res.render('forgetpasword',{admin:req.user});
});

router.post('/send-mail', async function(req, res, next) {
  try {
    const user=await User.findOne({email:req.body.email});
    if(!user) return res.send("User Not Found! <a href='/forget'>Try Again</a>")
    sendmail(user.email,user,req,res)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
});

// Work on forget password option now
router.post('/forget/<%= id%>', async function(req, res, next) {
  try {
    
  } catch (error) {
    
  }
});
module.exports = router;
