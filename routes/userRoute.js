const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js");
var passport = require('passport');
const { saveRedirectUrl,inSmallCase } = require("../middleware.js");
const Controller=require("../controllers/User.js")

router.get("/signup",Controller.RenderSignupForm )

router.post("/signup", Controller.PostSignUpFormData);

router.get("/login",Controller.RenderLoginForm);

router.post("/login",
    saveRedirectUrl,
    inSmallCase,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        req.flash("status", "welcome back to wonderLust! You are logged in!")
        res.redirect(res.locals.redirectUrl);
    }
)


router.get("/logout",Controller.LogOutUser)


module.exports = router;