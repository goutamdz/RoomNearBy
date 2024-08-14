const list = require("../models/list");
const { joeSchema, commentSchema } = require("../joeSchema");
const review = require('../models/review.js');
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => {
    try {
        const result = await list.find({});
        res.render("listing/home.ejs", { result });
    }
    catch (err) {
        res.send("not able to get data");
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/newForm.ejs");
}

module.exports.postingNewListing = async (req, res) => {
    const result = joeSchema.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    let url = req.file.path;
    let filename = req.file.filename;

    let { title, description, image, price, location, country,Email,phoneNumber } = req.body;
    let listing1 = new list({ title, description, price, location, country ,Email,phoneNumber})
    listing1.image = { url, filename };
    listing1.owner = req.user._id;
    await listing1.save()
        .then(() => {
            console.log("Data Saved in database")
            req.flash("status", "New Listing Added Successfully");
            res.redirect("/listing");
        })
        .catch((err) => {
            console.log(err.message);
            req.flash("status", "New Listing could not be added!");
            res.redirect("/listing");
        });

}



module.exports.renderIndividualListing = async (req, res) => {
    let { id } = req.params;
    const result = await list.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('owner');

    // console.log(result.reviews[0].author.username);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    res.render("listing/show.ejs", { result, monthNames });
}

module.exports.renderEditListingForm = async (req, res) => {
    let { id } = req.params;
    const result = await list.findById(id);
    res.render("listing/edit.ejs", { result });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const result = joeSchema.validate(req.body);
   
    if (result.error) {
        req.flash("error", result.error.details[0].message)
        return res.redirect("/listing/" + id);
    }
    let { title, description, price, location, country ,phoneNumber,Email} = req.body;


    try {
        const listing1 = await list.findByIdAndUpdate(id, req.body)

        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing1.image = { url, filename };
        }
        listing1.save();
        req.flash("status", "Listing updated successfully!");
        res.redirect(`/listing/${id}`)
    }
    catch (err) {
        req.flash("status", "Listing could not be updated!");
        res.redirect(`/listing/${id}`)
    }

}

module.exports.deleteListing = async (req, res) => {
    try {
        let { id } = req.params;
        let myitem = await list.findById(id);

        for (item of myitem.reviews) {
            review.findByIdAndDelete(item)
                .then(() => { console.log("deleted review Successfully") })
                .catch(() => { console.log("not able to delete review") })
        }
        await cloudinary.api.delete_resources([myitem.image.filename], { resource_type: 'image' });
        console.log("Image deleted from Cloudinary successfully!");

        list.findByIdAndDelete(id)
            .then(() => {

                req.flash("status", "Listing Deleted Successfully!");
                res.redirect("/listing")
            })
            .catch(() => { res.send("got error while deleting item") })
    }
    catch(err) {
        req.flash("error",err.message);
        res.redirect("/listing/"+req.params.id);
    }
}

//for Review

module.exports.DeleteReview = async (req, res) => {
    let myitem = await list.findById(req.params.lid);
    myitem.reviews = myitem.reviews.filter(item => item.id !== req.params.rid);
    await review.findByIdAndDelete(req.params.rid);
    req.flash("status", "Review Deleted Successfully!");
    res.redirect(`/listing/${req.params.lid}`);
}

module.exports.postingNewReview = async (req, res) => {
    const result = commentSchema.validate(req.body);
    if (result.error) {
        return res.status(400).send("Not able to insert data, " + result.error);
    }
    let listdoc = await list.findById(req.params.id);
    console.log(req.body);
    let newrvw = new review(req.body);
    newrvw.author = req.user;
    listdoc.reviews.push(newrvw);
    await newrvw.save();
    await listdoc.save();
    req.flash("status", "Review Saved Successfully!");
    res.redirect(`/listing/${req.params.id}`);
}