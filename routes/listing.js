const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
//index route

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedin,

    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing));


//new route
router.get("/new", isLoggedin, listingController.renderNewForm);

//show route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(
    isLoggedin,
    isOwner,
    wrapAsync(listingController.destroyListing));
//create


//edit 
router.get("/:id/edit", isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing));

//update


//delete

module.exports = router;