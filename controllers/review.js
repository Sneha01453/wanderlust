const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//post review
module.exports.createReview = async (req, res) => {
  // console.log("Inside review route");
  // console.log(req.body);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  newReview.author = req.user._id;
  console.log(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success","new review created!");
  res.redirect(`/listings/${listing._id}`);

}

//delete review

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","review deleted!");
  res.redirect(`/listings/${id}`);
  }

