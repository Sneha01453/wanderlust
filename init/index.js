const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
const axios = require("axios");
require("dotenv").config({ path: "../.env" });
console.log("MAP_TOKEN:", process.env.MAP_TOKEN ? "FOUND" : "NOT FOUND");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
// const initDB=async()=> {
//   await  Listing.deleteMany({});
//    initdata.data= initdata.data.map((obj)=>({...obj,owner:"6a736f6aec90375d787eac98"}))
//  await Listing.insertMany(initdata.data);
// console.log("data was initialized");
    
// };
// initDB();
const initDB = async () => {

    await Listing.deleteMany({});

    const listings = [];

    for (let obj of initdata.data) {

        const address = `${obj.location}, ${obj.country}`;

        try {

            const response = await axios.get(
                "https://api.geoapify.com/v1/geocode/search",
                {
                    params: {
                        text: address,
                        apiKey: process.env.MAP_TOKEN,
                        limit: 1
                    }
                }
            );
const result = response.data.features[0];

            if (result) {

                obj.geometry = {
                    type: "Point",
                    coordinates: [
                        result.geometry.coordinates[0],
                        result.geometry.coordinates[1]
                    ]
                };

                console.log(
                    obj.location,
                    obj.geometry.coordinates
                );

            } else {

                console.log("Location not found:", address);

            }
 } catch (err) {

            console.log("Geocoding error:", obj.location);
            console.log(err.message);

        }

        obj.owner = "6a736f6aec90375d787eac98";

        listings.push(obj);
    }

    await Listing.insertMany(listings);

    console.log("data was initialized");
};

initDB();