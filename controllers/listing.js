const { mongoosePopulatedDocumentMarker } = require("mongoose");
const Listing = require("../models/listing");
const axios = require("axios");
// index
// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("./listings/index.ejs", { allListings });
//     // res.render();
// };
module.exports.index = async (req, res) => {

    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("./listings/index.ejs", { allListings });
};

// new

module.exports.renderNewForm = (req, res) => {

    res.render("./listings/new.ejs");
}


// show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Request does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}


//create listing

module.exports.createListing = async (req, res, next) => {
     try {
        // Location entered by the user
        let location = req.body.listing.location;

        // Geocoding
        let response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: location,
                    format: "json",
                    limit: 1
                },
                headers: {
                    "User-Agent": "Wanderlust-App"
                }
            }
        );
         if (response.data.length === 0) {
            req.flash("error","Location not found");
            return res.redirect("/listings/new");
         }
         //get latitude and longitude
        let latitude = parseFloat(response.data[0].lat);
        let longitude = parseFloat(response.data[0].lon);
         console.log("Location:", location);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url," --",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    //store GeoJSON data
    
    newListing.geometry={
        type:"Point",
        coordinates:[longitude,latitude]
    };
    await newListing.save();
    req.flash("success", "new listing created!");
    res.redirect("/listings");
  }catch(err) {
        next(err);
       }
};


   

//edit listing
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Request does not exist");
        return res.redirect("/listings");
    }
    let originalImgUrl= listing.image.url;
    let originalImageUrl=originalImgUrl.replace("/upload","/upload/w_150,h_100,c_fill");
    res.render("./listings/edit.ejs", { listing,originalImageUrl });
}

//update route
module.exports.updateListing = async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "send valid data for listing");
    // }
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !=="undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "listing updated!");
    res.redirect(`/listings/${id}`);
}

//delete

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
}