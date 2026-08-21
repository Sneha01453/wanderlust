const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
        description:{
            type:String,
        },
        image:{
            url:String,
            filename:String,
            // type:String,
            // default:"https://unsplash.com/photos/a-view-of-a-beach-through-an-opening-in-a-rock-EJ6Y59HMDEY",
            // set:(v)=>
            //     v===""?"https://unsplash.com/photos/a-view-of-a-beach-through-an-opening-in-a-rock-EJ6Y59HMDEY"
            //    :v,
        },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
     type:{
        type:String,
        enum:['Point'],
        required:true
        },
        
     coordinates:{
        type:[Number],
        required:true
       }
    },
    category:{
        type:String,
        enum:["Trending",
        "Rooms",
        "Iconic cities",
        "Mountains",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farms",
        "Arctic",
        "Domes",
        "Boats"],
        required:true
    }
}
);

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id :{$in :listing.reviews}});
    }

});
 const Listing = mongoose.model("Listing",listingSchema);
 module.exports=Listing;