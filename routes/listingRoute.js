const express=require('express');
const router=express.Router();
const {joeSchema,commentSchema}=require("../joeSchema.js");
const list=require('../models/list.js');
const review=require('../models/review.js');
const User=require('../models/review.js');
const Controller=require("../controllers/Listing.js");
const { isLoggedIn,isOwner,isAuthor } = require('../middleware.js');

const {storage}=require("../cloudConfig.js");
const multer  = require('multer')
const upload = multer({ storage})

router.get("/",Controller.index);
router.get("/new",isLoggedIn,Controller.renderNewForm);
router.post("/new",isLoggedIn,upload.single('image'),Controller.postingNewListing);

router.get("/:id",Controller.renderIndividualListing);
router.get("/:id/edit",isLoggedIn,isOwner,Controller.renderEditListingForm);
router.patch("/:id/update",isLoggedIn,isOwner,upload.single('image'),Controller.updateListing);
router.delete("/:id/delete",isLoggedIn, Controller.deleteListing);



router.post("/:id/review",isLoggedIn,Controller.postingNewReview)
router.delete("/:lid/review/:rid",isLoggedIn,isAuthor,Controller.DeleteReview);


module.exports=router;