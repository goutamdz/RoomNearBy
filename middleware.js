const list=require('./models/list');
const review=require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.originalUrl,"  ",req.path);
    // console.log(req.user);
    // console.log(req.isAuthenticated());
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

//passport clear the session when it return

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    else {
        res.locals.redirectUrl = "/listing";
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await list.findById(id);
    if (!listing.owner._id.equals(res.locals.curUser._id)) {
        req.flash("error", "Only the Owner's have permission to do changes!! ");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isAuthor=async(req,res,next)=>{
    let { lid,rid } = req.params;
    let comment = await review.findById(rid);
    if (!comment.author.equals(res.locals.curUser._id)) {
        req.flash("error", "Only the Owner's have permission to do changes!! ");
        return res.redirect(`/listing/${lid}`);
    }
    next();
}

module.exports.inSmallCase=async(req,res,next)=>{
    req.body.username=req.body.username.toLowerCase();
    next();
}
