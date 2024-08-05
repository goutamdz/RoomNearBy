var passport = require('passport');
var User=require("../models/user");

module.exports.RenderSignupForm=(req, res) => {
    res.render('users/signup.ejs');
}

module.exports.PostSignUpFormData=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        username=username.toLowerCase();
        email=email.toLowerCase();
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash("status", "user registered & Logged In successfully!");
            res.redirect("/listing");
        });
    }
    catch (err) {
        console.log(err.message);
        req.flash("status", err.message);
        res.redirect("/signup");
    }

}

module.exports.RenderLoginForm= (req, res) => {
    res.render('users/login.ejs');
}

module.exports.LogOutUser=(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash("status","You have been logged out successfully!");
        res.redirect("/listing");
    })
}