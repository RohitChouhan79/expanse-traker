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
router.post('/forget/:id', async function(req, res, next) {
  try {
    const user=await User.findById(req.params.id);
    if(!user)
      return res.send("User not Found! <a href='/forget'>");

    if (user.token==req.body.token){
      user.token=-1;
      await user.setPassword(req.body.newpassword);
      await user.save()
      res.redirect("/login")
    }else{
      user.token=-1;
      await user.save();
      res.send("Invalid OTP <a href='/forget'>")
    }
    
  } catch (error) {
    res.send(error)
  }
});

router.post(
  "/signin",
  passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/signin",
  }),
  function (req, res, next) {}
)

router.get("/profile",isLoggedIn, async function (req, res, next) {
  try {
    // let { expenses } = await req.user.populate("expenses");
    res.render("profile", { admin: req.user } );
} catch (error) {
  console.log('error', error)
    res.send(error, "error");
}
router.get("/reset", isLoggedIn, function (req, res, next) {
  res.render("reset", { admin: req.user });
});

router.post("/reset", isLoggedIn, async function (req, res, next) {
  try {
      await req.user.changePassword(
          req.body.oldpassword,
          req.body.newpassword
      );
      await req.user.save();
      res.redirect("/profile");
  } catch (error) {
      res.send(error);
  }
});

router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
      res.redirect("/signin");
  });
});
  
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/signin");
  }
}

// .................................................
router.get("/createexpense", isLoggedIn, function (req, res, next) {
  res.render("createexpenses", { admin: req.user });
});

router.post("/createexpense", isLoggedIn, async function (req, res, next) {
  try {

      const expense = new Expanse(req.body);
      req.user.expenses.push(expense._id);
      expense.user = req.user._id;
      await expense.save();
      await req.user.save();
      res.redirect("/profile");
  } catch (error) {
    console.log(error)
      res.send(error);
  }
});

router.get("/filter", async function (req, res, next) {
  try {
      let { expenses } = await req.user.populate("expenses");
      expenses = expenses.filter((e) => e[req.query.key] == req.query.value);
      res.render("profile", { admin: req.user, expenses });
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});
module.exports = router;
