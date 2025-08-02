const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
// const upload = multer({dest: "uploads/"});
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
// .post(upload.single("listing[image][url]"), (req,res)=>{
//     // res.send(req.body);
//     res.send(req.file);
// }
);

//new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,
    upload.single("listing[image]"),
    validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;